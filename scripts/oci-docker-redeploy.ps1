[CmdletBinding()]
param(
    [string]$HostIp = "129.146.53.253",
    [string]$SshUser = "ubuntu",
    [string]$KeyPath = "D:\lsh\git\jejugroup\ssh-key-2026-03-30.key",
    [string]$RemoteAppDir = "/opt/jejugroup",
    [string]$PublicHealthUrl = "http://129.146.53.253/actuator/health"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$tempDir = Join-Path $repoRoot ".codex-temp"
$archivePath = Join-Path $tempDir "oci-docker-redeploy-src.tar.gz"
$wrapperJarPath = Join-Path $repoRoot "jeju-spring\gradle\wrapper\gradle-wrapper.jar"

function Invoke-Ssh {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Script
    )

    $scriptBlock = @"
$Script
"@

    $scriptBlock | ssh -i $KeyPath -o StrictHostKeyChecking=accept-new "$SshUser@$HostIp" "bash -s"
}

if (-not (Test-Path $KeyPath)) {
    throw "SSH 키 파일을 찾지 못했어: $KeyPath"
}

if (-not (Test-Path $wrapperJarPath)) {
    throw "Gradle wrapper jar를 찾지 못했어: $wrapperJarPath"
}

New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
if (Test-Path $archivePath) {
    Remove-Item $archivePath -Force
}

Push-Location $repoRoot
try {
    tar -czf $archivePath `
        --exclude=.git `
        --exclude=node_modules `
        --exclude=.codex-temp `
        --exclude=.gradle `
        --exclude=front/.generated `
        --exclude=parity_shots `
        --exclude=test-results `
        --exclude=jeju-spring/build `
        --exclude=jeju-spring/target `
        --exclude=*.war `
        --exclude=*.jar `
        --exclude=*.pem `
        --exclude=*.key `
        --exclude=.env `
        --exclude=.env.* `
        --exclude=jeju-spring/.env `
        --exclude=jeju-web/.env `
        .
} finally {
    Pop-Location
}

Write-Host "[REDEPLOY] archive ready: $archivePath"

scp -i $KeyPath -o StrictHostKeyChecking=accept-new $archivePath "${SshUser}@${HostIp}:${RemoteAppDir}/oci-docker-redeploy-src.tar.gz"
scp -i $KeyPath -o StrictHostKeyChecking=accept-new $wrapperJarPath "${SshUser}@${HostIp}:${RemoteAppDir}/gradle-wrapper.jar"

$remoteScript = @"
set -e
APP_DIR=$RemoteAppDir
SRC_DIR=`$APP_DIR/docker-src
ARCHIVE=`$APP_DIR/oci-docker-redeploy-src.tar.gz
WRAPPER_TMP=`$APP_DIR/gradle-wrapper.jar

rm -rf "`$SRC_DIR"
mkdir -p "`$SRC_DIR"
tar -xzf "`$ARCHIVE" -C "`$SRC_DIR"
mkdir -p "`$SRC_DIR/jeju-spring/gradle/wrapper"
mv "`$WRAPPER_TMP" "`$SRC_DIR/jeju-spring/gradle/wrapper/gradle-wrapper.jar"
sudo mkdir -p /uploads /uploads/mypage-avatars
sudo chown -R 1000:1000 /uploads || true

cd "`$SRC_DIR"
docker compose up -d mysql
docker compose up -d --build app nginx
docker compose ps

for i in `$(seq 1 60); do
  code=`$(curl -s -o /tmp/jeju-health.json -w '%{http_code}' http://127.0.0.1/actuator/health || true)
  if [ "`$code" = "200" ]; then
    cat /tmp/jeju-health.json
    exit 0
  fi
  sleep 2
done

echo "[REDEPLOY] remote health check timed out" >&2
docker compose logs --no-color --tail=120 app nginx >&2 || true
exit 1
"@

Invoke-Ssh -Script $remoteScript

Write-Host "[REDEPLOY] local public health check: $PublicHealthUrl"
$publicOk = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $response = curl.exe -fsS $PublicHealthUrl
        Write-Host $response
        $publicOk = $true
        break
    } catch {
        Start-Sleep -Seconds 2
    }
}

if (-not $publicOk) {
    throw "공개 health check 실패: $PublicHealthUrl"
}

Write-Host "[REDEPLOY] done"
