<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="true"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>출국 준비 체크리스트 | JEJU STAY</title>
    <meta name="description" content="여권, 결제, 통신, 짐 정리까지 출국 직전 체크리스트를 한 화면에서 정리하세요.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
        rel="stylesheet">

    <script src="https://unpkg.com/lucide@latest"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../hotel/hotel.css">
    <link rel="stylesheet" href="../../../components/react/layout/header.css">
    <link rel="stylesheet" href="../../../components/react/layout/footer.css">
    <link rel="stylesheet" href="../../../components/react/ui/FAB/fab.css">
    <link rel="stylesheet" href="../../../components/react/widget/chatbot-style.css">
    <link rel="stylesheet" href="./travel_checklist.css">
</head>

<body class="travel-checklist-page">
    <div id="hotel-header-placeholder"></div>

    <main class="travel-checklist-page-main">
        <div id="jeju-travel-checklist-app" aria-live="polite">
            <div class="travel-checklist-loading">체크리스트 불러오는 중</div>
        </div>
    </main>

    <div id="hotel-footer-placeholder"></div>

    <script type="module" src="../../../components/runtime/bootstrap.js"></script>
</body>

</html>
