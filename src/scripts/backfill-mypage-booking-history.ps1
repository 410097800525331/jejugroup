[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$RefreshAmounts
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $scriptRoot 'jeju-spring/.env'
$rangeStart = [DateTime]::ParseExact('2021-03-30', 'yyyy-MM-dd', $null)
$rangeEnd = [DateTime]::ParseExact('2026-03-30', 'yyyy-MM-dd', $null)
$runPrefix = 'BHD-20260331'
$runBookingPrefix = "$runPrefix-"
$dailyMinBookings = 1
$dailyMaxBookings = 50
$bookingAmountMin = 10000
$bookingAmountMax = 20000000
$typePool = @('air', 'stay')
$paymentMethods = @('card', 'kakao_pay', 'transfer')
$paymentProviders = @('inicis', 'kakaopay', 'toss', 'nicepay')
$airDestinations = @(
    '도쿄 - 나리타 국제공항 (NRT)',
    '도쿄 - 하네다 공항 (HND)',
    '오사카 - 간사이 국제공항 (KIX)',
    '후쿠오카 국제공항 (FUK)',
    '히로시마',
    '삿포로',
    '제주'
)
$stayDestinations = @(
    '제주 신라 스테이',
    '제주 오션 스위트',
    '서귀포 라이트 호텔',
    '히로시마 숙박',
    '오사카 숙박',
    '도쿄 숙박'
)

function Read-EnvFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "환경 파일을 찾을 수 없다: $Path"
    }

    $envMap = @{}
    foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
        $trimmed = $line.Trim()
        if (-not $trimmed -or $trimmed.StartsWith('#')) {
            continue
        }

        $index = $trimmed.IndexOf('=')
        if ($index -lt 1) {
            continue
        }

        $key = $trimmed.Substring(0, $index).Trim()
        $value = $trimmed.Substring($index + 1).Trim()
        if ($key) {
            $envMap[$key] = $value
        }
    }

    return $envMap
}

function Resolve-MySqlExe {
    $mysqlExeCommand = Get-Command mysql.exe -ErrorAction SilentlyContinue
    $mysqlCommand = Get-Command mysql -ErrorAction SilentlyContinue

    $candidates = @()
    if ($mysqlExeCommand) {
        $candidates += $mysqlExeCommand.Source
    }
    if ($mysqlCommand) {
        $candidates += $mysqlCommand.Source
    }
    $candidates += 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe'
    $candidates += 'C:\Program Files\MySQL\MySQL Workbench 8.0\mysql.exe'
    $candidates = $candidates | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -Unique

    if (@($candidates).Count -gt 0) {
        return @($candidates)[0]
    }

    throw 'mysql.exe를 찾지 못했다. MySQL Client 설치 상태를 확인해야 한다.'
}

function Parse-JdbcUrl {
    param(
        [Parameter(Mandatory = $true)]
        [string]$JdbcUrl
    )

    $uri = [Uri]($JdbcUrl -replace '^jdbc:', '')
    $database = $uri.AbsolutePath.Trim('/')
    if (-not $database) {
        throw "DB_URL에서 데이터베이스 이름을 읽지 못했다: $JdbcUrl"
    }

    return [pscustomobject]@{
        Host = $uri.Host
        Port = if ($uri.Port -gt 0) { $uri.Port } else { 3306 }
        Database = $database
    }
}

function New-MySqlDefaultsFile {
    param(
        [Parameter(Mandatory = $true)]
        [pscustomobject]$Connection
    )

    $path = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "jejugroup-mysql-$([Guid]::NewGuid().ToString('N')).cnf")
    $content = @(
        '[client]'
        "host=$($Connection.Host)"
        "port=$($Connection.Port)"
        "user=$($Connection.User)"
        "password=$($Connection.Password)"
        "database=$($Connection.Database)"
        'default-character-set=utf8mb4'
    ) -join [Environment]::NewLine

    [System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding($false)))
    return $path
}

function Invoke-MySqlQuery {
    param(
        [Parameter(Mandatory = $true)]
        [string]$MySqlExe,
        [Parameter(Mandatory = $true)]
        [string]$DefaultsFile,
        [Parameter(Mandatory = $true)]
        [string]$Sql
    )

    $args = @(
        "--defaults-extra-file=$DefaultsFile"
        '--batch'
        '--raw'
        '--skip-column-names'
        '-e'
        $Sql
    )

    $result = & $MySqlExe @args
    if ($LASTEXITCODE -ne 0) {
        throw "mysql 쿼리 실행에 실패했다."
    }

    $text = ($result | Out-String).Trim()
    if (-not $text) {
        return @()
    }

    return @(
        $text -split "\r?\n" | Where-Object { $_ -and $_.Trim().Length -gt 0 }
    )
}

function Invoke-MySqlScript {
    param(
        [Parameter(Mandatory = $true)]
        [string]$MySqlExe,
        [Parameter(Mandatory = $true)]
        [string]$DefaultsFile,
        [Parameter(Mandatory = $true)]
        [string]$SqlPath
    )

    $args = @(
        "--defaults-extra-file=$DefaultsFile"
        '--batch'
        '--raw'
        '--skip-column-names'
    )

    Get-Content -LiteralPath $SqlPath -Raw | & $MySqlExe @args
    if ($LASTEXITCODE -ne 0) {
        throw "mysql 스크립트 실행에 실패했다."
    }
}

function ConvertTo-SqlString {
    param(
        [AllowNull()]
        [object]$Value
    )

    if ($null -eq $Value) {
        return 'NULL'
    }

    if ($Value -is [DateTime]) {
        return "'" + $Value.ToString('yyyy-MM-dd HH:mm:ss.fff') + "'"
    }

    if ($Value -is [decimal] -or $Value -is [double] -or $Value -is [float] -or $Value -is [int] -or $Value -is [long]) {
        return $Value.ToString([System.Globalization.CultureInfo]::InvariantCulture)
    }

    $text = [string]$Value
    $escaped = $text.Replace("'", "''")
    return "'" + $escaped + "'"
}

function New-RandomItem {
    param(
        [Parameter(Mandatory = $true)]
        [object[]]$Items
    )

    return $Items[(Get-Random -Minimum 0 -Maximum $Items.Count)]
}

function Get-DailyBookingCount {
    return Get-Random -Minimum $dailyMinBookings -Maximum ($dailyMaxBookings + 1)
}

function Get-RandomBookingAmount {
    return [decimal](Get-Random -Minimum $bookingAmountMin -Maximum ($bookingAmountMax + 1))
}

function Get-StayEndDate {
    param(
        [Parameter(Mandatory = $true)]
        [DateTime]$StartDate
    )

    $stayLength = Get-Random -Minimum 1 -Maximum 5
    $candidate = $StartDate.AddDays($stayLength - 1)
    if ($candidate -gt $rangeEnd) {
        return $StartDate
    }

    return $candidate
}

function Get-BookingDateTime {
    param(
        [Parameter(Mandatory = $true)]
        [DateTime]$Date
    )

    $hour = Get-Random -Minimum 7 -Maximum 22
    $minute = Get-Random -Minimum 0 -Maximum 60
    $second = Get-Random -Minimum 0 -Maximum 60
    $millisecond = Get-Random -Minimum 0 -Maximum 1000
    return $Date.Date.AddHours($hour).AddMinutes($minute).AddSeconds($second).AddMilliseconds($millisecond)
}

function Get-BookingLabel {
    param(
        [Parameter(Mandatory = $true)]
        [string]$BookingType,
        [Parameter(Mandatory = $true)]
        [string]$Destination,
        [Parameter(Mandatory = $true)]
        [DateTime]$BookingDate
    )

    if ($BookingType -eq 'air') {
        return "$Destination 항공권"
    }

    return "$Destination 숙박"
}

function Get-BookingMemo {
    param(
        [Parameter(Mandatory = $true)]
        [string]$BookingType,
        [Parameter(Mandatory = $true)]
        [DateTime]$ServiceStartDate,
        [Parameter(Mandatory = $true)]
        [DateTime]$ServiceEndDate
    )

    if ($BookingType -eq 'air') {
        return "랜덤 백필 항공 예약 / 출발일 $($ServiceStartDate.ToString('yyyy-MM-dd'))"
    }

    if ($ServiceStartDate.Date -eq $ServiceEndDate.Date) {
        return "랜덤 백필 숙박 예약 / 당일 이용"
    }

    return "랜덤 백필 숙박 예약 / $($ServiceStartDate.ToString('yyyy-MM-dd')) ~ $($ServiceEndDate.ToString('yyyy-MM-dd'))"
}

function Split-DisplayName {
    param(
        [Parameter(Mandatory = $true)]
        [string]$DisplayName
    )

    $trimmed = $DisplayName.Trim()
    if (-not $trimmed) {
        return [pscustomobject]@{
            FirstName = '고객'
            LastName = '테스트'
            FullName = '테스트고객'
        }
    }

    if ($trimmed.Length -eq 1) {
        return [pscustomobject]@{
            FirstName = $trimmed
            LastName = $trimmed
            FullName = $trimmed + $trimmed
        }
    }

    $lastName = $trimmed.Substring(0, 1)
    $firstName = $trimmed.Substring(1)

    return [pscustomobject]@{
        FirstName = $firstName
        LastName = $lastName
        FullName = $trimmed
    }
}

function Build-BackfillPlan {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$ExistingRunDateSet,
        [Parameter(Mandatory = $true)]
        [hashtable]$Users,
        [Parameter(Mandatory = $true)]
        [hashtable]$SeedState
    )

    $plan = New-Object System.Collections.Generic.List[object]
    $current = $rangeStart.Date
    while ($current -le $rangeEnd.Date) {
        $dateKey = $current.ToString('yyyy-MM-dd')
        if ($ExistingRunDateSet.ContainsKey($dateKey)) {
            $current = $current.AddDays(1)
            continue
        }

        $dailyBookingCount = Get-DailyBookingCount
        for ($slot = 1; $slot -le $dailyBookingCount; $slot++) {
            $bookingType = New-RandomItem -Items $typePool
            $userId = New-RandomItem -Items @($Users.Keys)
            $displayName = $Users[$userId]
            $bookingDateTime = Get-BookingDateTime -Date $current
            $nameParts = Split-DisplayName -DisplayName $displayName

            if ($bookingType -eq 'air') {
                $destination = New-RandomItem -Items $airDestinations
                $serviceStartDate = $bookingDateTime.Date
                $serviceEndDate = $bookingDateTime.Date
            }
            else {
                $destination = New-RandomItem -Items $stayDestinations
                $serviceStartDate = $bookingDateTime.Date
                $serviceEndDate = Get-StayEndDate -StartDate $serviceStartDate
            }

            $bookingNoSuffix = [Guid]::NewGuid().ToString('N').Substring(0, 8).ToUpper()
            $bookingNo = "$runBookingPrefix$($current.ToString('yyyyMMdd'))-$slot-$bookingNoSuffix"
            $title = Get-BookingLabel -BookingType $bookingType -Destination $destination -BookingDate $current
            $memo = Get-BookingMemo -BookingType $bookingType -ServiceStartDate $serviceStartDate -ServiceEndDate $serviceEndDate
            $totalAmount = Get-RandomBookingAmount
            $paymentMethod = New-RandomItem -Items $paymentMethods
            $paymentProvider = New-RandomItem -Items $paymentProviders

            $bookingId = $SeedState.BookingId
            $itemId = $SeedState.BookingItemId
            $passengerId = $SeedState.BookingPassengerId
            $paymentId = $SeedState.PaymentAttemptId
            $transactionNo = "TX-$bookingNo-01"

            $SeedState.BookingId++
            $SeedState.BookingItemId++
            $SeedState.BookingPassengerId++
            $SeedState.PaymentAttemptId++

            $plan.Add([pscustomobject]@{
                BookingId = $bookingId
                BookingItemId = $itemId
                BookingPassengerId = $passengerId
                PaymentAttemptId = $paymentId
                TransactionNo = $transactionNo
                BookingNo = $bookingNo
                BookingDateTime = $bookingDateTime
                BookingType = $bookingType
                UserId = $userId
                UserName = $displayName
                PassengerName = $nameParts.FullName
                PassengerFirstName = $nameParts.FirstName
                PassengerLastName = $nameParts.LastName
                Destination = $destination
                ItemName = $title
                Memo = $memo
                ServiceStartDate = $serviceStartDate.Date
                ServiceEndDate = $serviceEndDate.Date
                TotalAmount = [decimal]::Round([decimal]$totalAmount, 0)
                PaymentMethod = $paymentMethod
                PaymentProvider = $paymentProvider
            })
        }

        $current = $current.AddDays(1)
    }

    return ,$plan.ToArray()
}

function Build-InsertSql {
    param(
        [Parameter(Mandatory = $true)]
        [object[]]$Plan
    )

    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine('SET NAMES utf8mb4;')

    if ($Plan.Count -eq 0) {
        return $sb.ToString()
    }

    foreach ($dayGroup in ($Plan | Group-Object { $_.BookingDateTime.Date.ToString('yyyy-MM-dd') })) {
        [void]$sb.AppendLine("-- $($dayGroup.Name)")
        [void]$sb.AppendLine('START TRANSACTION;')

        $bookingValues = @()
        $itemValues = @()
        $passengerValues = @()
        $paymentValues = @()
        $transactionValues = @()

        foreach ($row in $dayGroup.Group) {
            $supplierName = if ($row.BookingType -eq 'air') { 'Jeju Air' } else { 'Jeju Stay' }
            $productCode = ("{0}-{1}" -f $row.BookingType.ToUpperInvariant(), $row.BookingNo)

            $bookingTuple = @(
                ConvertTo-SqlString $row.BookingId
                ConvertTo-SqlString $row.BookingNo
                ConvertTo-SqlString $row.Destination
                ConvertTo-SqlString $row.UserId
                ConvertTo-SqlString $row.BookingType
                ConvertTo-SqlString 'confirmed'
                ConvertTo-SqlString 'paid'
                ConvertTo-SqlString 'KRW'
                ConvertTo-SqlString $row.TotalAmount
                ConvertTo-SqlString $row.TotalAmount
                ConvertTo-SqlString $row.BookingDateTime
                'NULL'
                ConvertTo-SqlString $row.Memo
                ConvertTo-SqlString $row.BookingDateTime
                ConvertTo-SqlString $row.BookingDateTime
            )
            $bookingValues += '(' + ($bookingTuple -join ',') + ')'

            $itemTuple = @(
                ConvertTo-SqlString $row.BookingItemId
                ConvertTo-SqlString $row.BookingId
                ConvertTo-SqlString 1
                ConvertTo-SqlString $row.BookingType
                ConvertTo-SqlString $row.ItemName
                ConvertTo-SqlString $productCode
                ConvertTo-SqlString $supplierName
                ConvertTo-SqlString $row.ServiceStartDate
                ConvertTo-SqlString $row.ServiceEndDate
                ConvertTo-SqlString 1
                ConvertTo-SqlString $row.TotalAmount
                ConvertTo-SqlString $row.TotalAmount
                ConvertTo-SqlString 'KRW'
                ConvertTo-SqlString $row.BookingDateTime
                ConvertTo-SqlString $row.BookingDateTime
            )
            $itemValues += '(' + ($itemTuple -join ',') + ')'

            $passengerTuple = @(
                ConvertTo-SqlString $row.BookingPassengerId
                ConvertTo-SqlString $row.BookingId
                ConvertTo-SqlString $row.BookingItemId
                ConvertTo-SqlString $row.UserId
                ConvertTo-SqlString 1
                ConvertTo-SqlString $row.PassengerName
                ConvertTo-SqlString $row.PassengerFirstName
                ConvertTo-SqlString $row.PassengerLastName
                ConvertTo-SqlString 'member'
                'NULL'
                ConvertTo-SqlString ($row.UserId + '@jejugroup.example')
                'NULL'
                'NULL'
                ConvertTo-SqlString 1
                ConvertTo-SqlString 1
                ConvertTo-SqlString $row.BookingDateTime
                ConvertTo-SqlString $row.BookingDateTime
            )
            $passengerValues += '(' + ($passengerTuple -join ',') + ')'

            $paymentTuple = @(
                ConvertTo-SqlString $row.PaymentAttemptId
                ConvertTo-SqlString $row.BookingId
                ConvertTo-SqlString 1
                ConvertTo-SqlString $row.PaymentProvider
                ConvertTo-SqlString $row.PaymentMethod
                ConvertTo-SqlString 'completed'
                ConvertTo-SqlString $row.TotalAmount
                ConvertTo-SqlString $row.TotalAmount
                ConvertTo-SqlString 'KRW'
                ConvertTo-SqlString $row.BookingDateTime
                ConvertTo-SqlString $row.BookingDateTime
                'NULL'
                'NULL'
                ConvertTo-SqlString $row.BookingDateTime
                ConvertTo-SqlString $row.BookingDateTime
            )
            $paymentValues += '(' + ($paymentTuple -join ',') + ')'

            $transactionTuple = @(
                'NULL'
                ConvertTo-SqlString $row.PaymentAttemptId
                ConvertTo-SqlString $row.TransactionNo
                ConvertTo-SqlString 'payment'
                ConvertTo-SqlString 'completed'
                ConvertTo-SqlString $row.TotalAmount
                ConvertTo-SqlString 'KRW'
                'NULL'
                ConvertTo-SqlString $row.BookingDateTime
                ConvertTo-SqlString $row.BookingDateTime
                ConvertTo-SqlString $row.BookingDateTime
                ConvertTo-SqlString $row.BookingDateTime
            )
            $transactionValues += '(' + ($transactionTuple -join ',') + ')'
        }

        [void]$sb.AppendLine(@"
INSERT INTO bookings (
    id,
    booking_no,
    destination,
    user_id,
    booking_type,
    status,
    payment_status,
    currency,
    total_amount,
    paid_amount,
    booked_at,
    cancelled_at,
    memo,
    created_at,
    updated_at
)
VALUES
$($bookingValues -join ",`n");
"@)

        [void]$sb.AppendLine(@"
INSERT INTO booking_items (
    id,
    booking_id,
    item_no,
    booking_type,
    item_name,
    product_code,
    supplier_name,
    service_start_date,
    service_end_date,
    quantity,
    unit_price,
    total_amount,
    currency,
    created_at,
    updated_at
)
VALUES
$($itemValues -join ",`n");
"@)

        [void]$sb.AppendLine(@"
INSERT INTO booking_passengers (
    id,
    booking_id,
    booking_item_id,
    user_id,
    passenger_no,
    passenger_name,
    passenger_first_name,
    passenger_last_name,
    passenger_type,
    phone,
    email,
    birth_date,
    gender,
    is_primary,
    is_member,
    created_at,
    updated_at
)
VALUES
$($passengerValues -join ",`n");
"@)

        [void]$sb.AppendLine(@"
INSERT INTO payment_attempts (
    id,
    booking_id,
    attempt_no,
    payment_provider,
    payment_method,
    status,
    requested_amount,
    approved_amount,
    currency,
    requested_at,
    completed_at,
    failure_code,
    failure_message,
    created_at,
    updated_at
)
VALUES
$($paymentValues -join ",`n");
"@)

        [void]$sb.AppendLine(@"
INSERT INTO payment_transactions (
    id,
    payment_attempt_id,
    transaction_no,
    transaction_type,
    status,
    amount,
    currency,
    external_transaction_id,
    processed_at,
    approved_at,
    created_at,
    updated_at
)
VALUES
$($transactionValues -join ",`n");
"@)

        [void]$sb.AppendLine('COMMIT;')
    }

    return $sb.ToString()
}

function Build-RefreshAmountSql {
    param(
        [Parameter(Mandatory = $true)]
        [string]$BookingPrefix
    )

    $escapedPrefix = $BookingPrefix.Replace("'", "''")

    return @"
SET NAMES utf8mb4;
START TRANSACTION;
CREATE TEMPORARY TABLE tmp_booking_amounts (
    booking_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    amount DECIMAL(12,2) NOT NULL
);
INSERT INTO tmp_booking_amounts (booking_id, amount)
SELECT
    b.id,
    ROUND($bookingAmountMin + (RAND() * ($bookingAmountMax - $bookingAmountMin)), 0)
FROM bookings b
WHERE b.booking_no LIKE '$escapedPrefix%';
UPDATE bookings b
INNER JOIN tmp_booking_amounts t ON t.booking_id = b.id
SET
    b.total_amount = t.amount,
    b.paid_amount = t.amount
WHERE b.booking_no LIKE '$escapedPrefix%';
UPDATE booking_items bi
INNER JOIN bookings b ON b.id = bi.booking_id
INNER JOIN tmp_booking_amounts t ON t.booking_id = b.id
SET
    bi.unit_price = t.amount,
    bi.total_amount = t.amount
WHERE b.booking_no LIKE '$escapedPrefix%';
UPDATE payment_attempts pa
INNER JOIN bookings b ON b.id = pa.booking_id
INNER JOIN tmp_booking_amounts t ON t.booking_id = b.id
SET
    pa.requested_amount = t.amount,
    pa.approved_amount = t.amount
WHERE b.booking_no LIKE '$escapedPrefix%';
UPDATE payment_transactions pt
INNER JOIN payment_attempts pa ON pa.id = pt.payment_attempt_id
INNER JOIN bookings b ON b.id = pa.booking_id
INNER JOIN tmp_booking_amounts t ON t.booking_id = b.id
SET
    pt.amount = t.amount,
    pt.processed_at = b.booked_at,
    pt.approved_at = b.booked_at,
    pt.updated_at = CURRENT_TIMESTAMP(3)
WHERE b.booking_no LIKE '$escapedPrefix%';
COMMIT;
"@
}

function Build-RepairPaymentTransactionSql {
    param(
        [Parameter(Mandatory = $true)]
        [string]$BookingPrefix
    )

    $escapedPrefix = $BookingPrefix.Replace("'", "''")

    return @"
SET NAMES utf8mb4;
START TRANSACTION;
INSERT INTO payment_transactions (
    payment_attempt_id,
    transaction_no,
    transaction_type,
    status,
    amount,
    currency,
    external_transaction_id,
    processed_at,
    approved_at,
    created_at,
    updated_at
)
SELECT
    pa.id,
    CONCAT('TX-', b.booking_no, '-01'),
    'payment',
    'completed',
    pa.approved_amount,
    'KRW',
    NULL,
    b.booked_at,
    b.booked_at,
    b.booked_at,
    b.booked_at
FROM bookings b
INNER JOIN payment_attempts pa ON pa.booking_id = b.id
LEFT JOIN payment_transactions pt ON pt.payment_attempt_id = pa.id
WHERE b.booking_no LIKE '$escapedPrefix%'
  AND pt.id IS NULL;
COMMIT;
"@
}

function Get-DateRange {
    param(
        [Parameter(Mandatory = $true)]
        [DateTime]$Start,
        [Parameter(Mandatory = $true)]
        [DateTime]$End
    )

    $dates = New-Object System.Collections.Generic.List[DateTime]
    $current = $Start.Date
    while ($current -le $End.Date) {
        $dates.Add($current)
        $current = $current.AddDays(1)
    }

    return $dates
}

$envMap = Read-EnvFile -Path $envPath
$connection = Parse-JdbcUrl -JdbcUrl $envMap['DB_URL']
$connection | Add-Member -NotePropertyName User -NotePropertyValue $envMap['DB_USER'] -Force
$connection | Add-Member -NotePropertyName Password -NotePropertyValue $envMap['DB_PASSWORD'] -Force

if (-not $connection.User -or -not $connection.Password) {
    throw 'DB_USER 또는 DB_PASSWORD가 비어 있다.'
}

$mysqlExe = Resolve-MySqlExe
$defaultsFile = $null
$sqlFile = $null

try {
    $defaultsFile = New-MySqlDefaultsFile -Connection $connection

    $existingRunDateRows = Invoke-MySqlQuery -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -Sql @"
SELECT DATE(booked_at) AS booking_date
FROM bookings
WHERE booked_at IS NOT NULL
  AND DATE(booked_at) BETWEEN '2021-03-30' AND '2026-03-30'
  AND booking_no LIKE '$runBookingPrefix%'
GROUP BY DATE(booked_at)
ORDER BY booking_date;
"@

    $existingRunDateSet = @{}
    foreach ($row in $existingRunDateRows) {
        if ([string]::IsNullOrWhiteSpace($row)) {
            continue
        }

        $existingRunDateSet[$row.Trim()] = $true
    }

    $rangeDates = Get-DateRange -Start $rangeStart -End $rangeEnd
    $eligibleDates = @($rangeDates | Where-Object { -not $existingRunDateSet.ContainsKey($_.ToString('yyyy-MM-dd')) })

    $maxIdRow = Invoke-MySqlQuery -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -Sql @"
SELECT
  COALESCE((SELECT MAX(id) FROM bookings), 0) AS bookings_max_id,
  COALESCE((SELECT MAX(id) FROM booking_items), 0) AS booking_items_max_id,
  COALESCE((SELECT MAX(id) FROM booking_passengers), 0) AS booking_passengers_max_id,
  COALESCE((SELECT MAX(id) FROM payment_attempts), 0) AS payment_attempts_max_id,
  COALESCE((SELECT MAX(id) FROM payment_transactions), 0) AS payment_transactions_max_id;
"@

    if (-not $maxIdRow -or @($maxIdRow).Count -eq 0) {
        throw '현재 최대 ID를 읽지 못했다.'
    }

    $maxParts = @($maxIdRow)[0].Split("`t")
    if (@($maxParts).Count -lt 5) {
        throw '현재 최대 ID 결과 형식이 예상과 다르다.'
    }

    $seedState = @{
        BookingId = [long]$maxParts[0] + 1
        BookingItemId = [long]$maxParts[1] + 1
        BookingPassengerId = [long]$maxParts[2] + 1
        PaymentAttemptId = [long]$maxParts[3] + 1
        PaymentTransactionId = [long]$maxParts[4] + 1
    }

    $userRows = Invoke-MySqlQuery -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -Sql @"
SELECT u.id, COALESCE(NULLIF(TRIM(up.display_name), ''), u.name) AS display_name
FROM users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.id IN ('test10','test11','test12','test13','test14','test15','test16','test17','test18','test19','test20','test21','test22','test23','test24','test25','test26','test27','test28','test29')
ORDER BY u.id;
"@

    $users = @{}
    foreach ($row in $userRows) {
        if ([string]::IsNullOrWhiteSpace($row)) {
            continue
        }

        $parts = $row.Split("`t")
        if (@($parts).Count -ge 2) {
            $users[$parts[0].Trim()] = $parts[1].Trim()
        }
    }

    if ($users.Count -lt 20) {
        throw 'test10~test29 사용자 목록을 충분히 읽지 못했다.'
    }

    $plan = Build-BackfillPlan -ExistingRunDateSet $existingRunDateSet -Users $users -SeedState $seedState

    $planByDate = $plan | Group-Object { $_.BookingDateTime.Date.ToString('yyyy-MM-dd') }
    $planCounts = @($planByDate | ForEach-Object { $_.Count })
    $planMin = if ($planCounts.Count -gt 0) { ($planCounts | Measure-Object -Minimum).Minimum } else { 0 }
    $planMax = if ($planCounts.Count -gt 0) { ($planCounts | Measure-Object -Maximum).Maximum } else { 0 }

    Write-Host ("[preview] 기존 run prefix 날짜: {0}" -f $existingRunDateSet.Count)
    Write-Host ("[preview] 대상 날짜: {0}" -f $eligibleDates.Count)
    Write-Host ("[preview] 새로 넣을 예약 수: {0}" -f $plan.Count)
    Write-Host ("[preview] 날짜별 예약 수 범위: {0}..{1}" -f $planMin, $planMax)
    Write-Host ("[preview] run prefix: {0}" -f $runPrefix)

    if ($plan.Count -eq 0) {
        $repairRows = Invoke-MySqlQuery -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -Sql @"
SELECT COUNT(*)
FROM bookings b
INNER JOIN payment_attempts pa ON pa.booking_id = b.id
LEFT JOIN payment_transactions pt ON pt.payment_attempt_id = pa.id
WHERE b.booking_no LIKE '$runBookingPrefix%'
  AND pt.id IS NULL;
"@
        $missingTransactionCount = if (@($repairRows).Count -gt 0) { [int]@($repairRows)[0] } else { 0 }

        if ($missingTransactionCount -gt 0) {
            $repairSql = Build-RepairPaymentTransactionSql -BookingPrefix $runBookingPrefix

            if ($DryRun) {
                Write-Host ("[dry-run] 누락된 payment_transactions {0}건을 채우는 SQL을 생성했지만 실제 실행은 하지 않았다." -f $missingTransactionCount)
                exit 0
            }

            $sqlFile = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "jejugroup-repair-tx-$([Guid]::NewGuid().ToString('N')).sql")
            Set-Content -LiteralPath $sqlFile -Value $repairSql -Encoding UTF8
            Invoke-MySqlScript -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -SqlPath $sqlFile

            $repairSummaryRows = Invoke-MySqlQuery -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -Sql @"
SELECT COUNT(*)
FROM bookings b
INNER JOIN payment_attempts pa ON pa.booking_id = b.id
LEFT JOIN payment_transactions pt ON pt.payment_attempt_id = pa.id
WHERE b.booking_no LIKE '$runBookingPrefix%'
  AND pt.id IS NULL;
"@
            $missingAfter = if (@($repairSummaryRows).Count -gt 0) { [int]@($repairSummaryRows)[0] } else { 0 }
            Write-Host ("[done] 누락된 payment_transactions: {0} -> {1}" -f $missingTransactionCount, $missingAfter)
        }

        if ($RefreshAmounts) {
            $refreshSql = Build-RefreshAmountSql -BookingPrefix $runBookingPrefix

            if ($DryRun) {
                Write-Host '[dry-run] 기존 run prefix 금액 및 거래 row 보강 SQL을 생성했지만 실제 실행은 하지 않았다.'
                exit 0
            }

            $sqlFile = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "jejugroup-refresh-$([Guid]::NewGuid().ToString('N')).sql")
            Set-Content -LiteralPath $sqlFile -Value $refreshSql -Encoding UTF8
            Invoke-MySqlScript -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -SqlPath $sqlFile

            $refreshRows = Invoke-MySqlQuery -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -Sql @"
SELECT
    MIN(total_amount) AS min_amount,
    MAX(total_amount) AS max_amount,
    COUNT(*) AS booking_count
FROM bookings
WHERE booking_no LIKE '$runBookingPrefix%';
"@

            $refreshSummary = if (@($refreshRows).Count -gt 0) { @($refreshRows)[0].Split("`t") } else { @() }
            if (@($refreshSummary).Count -ge 3) {
                Write-Host ("[done] 기존 배치 금액 min/max: {0} / {1}" -f $refreshSummary[0], $refreshSummary[1])
                Write-Host ("[done] 기존 배치 예약 수: {0}" -f $refreshSummary[2])
            }

            exit 0
        }

        if ($missingTransactionCount -gt 0) {
            exit 0
        }

        Write-Host '[noop] 이미 생성된 run prefix 데이터만 있어서 추가 INSERT는 하지 않았다.'
        exit 0
    }

    if ($DryRun) {
        Write-Host '[dry-run] 실제 INSERT는 실행하지 않았다.'
        exit 0
    }

    $sqlFile = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "jejugroup-backfill-$([Guid]::NewGuid().ToString('N')).sql")
    $sql = Build-InsertSql -Plan $plan
    Set-Content -LiteralPath $sqlFile -Value $sql -Encoding UTF8

    Invoke-MySqlScript -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -SqlPath $sqlFile

    $postSummaryRows = Invoke-MySqlQuery -MySqlExe $mysqlExe -DefaultsFile $defaultsFile -Sql @"
SELECT
    COUNT(*) AS generated_days,
    MIN(day_count) AS min_per_day,
    MAX(day_count) AS max_per_day,
    SUM(day_count) AS total_generated
FROM (
    SELECT DATE(booked_at) AS booking_date, COUNT(*) AS day_count
    FROM bookings
    WHERE booked_at IS NOT NULL
      AND DATE(booked_at) BETWEEN '2021-03-30' AND '2026-03-30'
      AND booking_no LIKE '$runBookingPrefix%'
    GROUP BY DATE(booked_at)
) run_summary;
"@

    $postSummary = if (@($postSummaryRows).Count -gt 0) { @($postSummaryRows)[0].Split("`t") } else { @() }
    if (@($postSummary).Count -ge 4) {
        Write-Host ("[done] 생성 날짜 수: {0}" -f $postSummary[0])
        Write-Host ("[done] 날짜별 최소/최대: {0} / {1}" -f $postSummary[1], $postSummary[2])
        Write-Host ("[done] 생성 예약 수: {0}" -f $postSummary[3])
    }
}
finally {
    foreach ($path in @($defaultsFile)) {
        if ($path -and (Test-Path -LiteralPath $path)) {
            Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue
        }
    }

    foreach ($path in @($sqlFile)) {
        if ($path -and (Test-Path -LiteralPath $path)) {
            Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue
        }
    }
}
