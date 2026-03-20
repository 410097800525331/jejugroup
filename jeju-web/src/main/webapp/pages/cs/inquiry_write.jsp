<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>1:1 문의 등록</title>
</head>
<body>
<h1>1:1 문의 등록</h1>
<c:if test="${not empty errorMessage}">
    <p style="color:red;">${errorMessage}</p>
</c:if>
<form action="${pageContext.request.contextPath}/inquiry/insert" method="post">
    <p>
        <label for="service">서비스</label><br>
        <select id="service" name="service">
            <option value="">선택하세요</option>
            <option value="jeju-air" ${formService == 'jeju-air' ? 'selected' : ''}>제주항공</option>
            <option value="jeju-stay" ${formService == 'jeju-stay' ? 'selected' : ''}>제주스테이</option>
            <option value="jeju-rental" ${formService == 'jeju-rental' ? 'selected' : ''}>제주렌터카</option>
            <option value="common" ${formService == 'common' ? 'selected' : ''}>공통</option>
        </select>
    </p>
    <p>
        <label for="title">제목</label><br>
        <input type="text" id="title" name="title" value="${fn:escapeXml(formTitle)}" style="width:400px;">
    </p>
    <p>
        <label for="content">내용</label><br>
        <textarea id="content" name="content" rows="10" cols="80"><c:out value="${formContent}" /></textarea>
    </p>
    <p>
        <button type="submit">문의 등록</button>
        <a href="${pageContext.request.contextPath}/inquiry/list">목록으로</a>
    </p>
</form>
</body>
</html>
