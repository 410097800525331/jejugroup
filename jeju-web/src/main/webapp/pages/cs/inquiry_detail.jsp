<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>문의 상세보기</title>
</head>
<body>
<h1><c:out value="${inquiry.title}" /></h1>
<p>문의 번호: ${inquiry.id}</p>
<p>서비스: <c:out value="${inquiry.service}" /></p>
<p>처리 상태: <c:out value="${inquiry.status}" /></p>
<p>등록일: <fmt:formatDate value="${inquiry.createdAt}" pattern="yyyy-MM-dd HH:mm:ss" /></p>
<h3>문의 내용</h3>
<pre><c:out value="${inquiry.content}" /></pre>
<p>
    <a href="${pageContext.request.contextPath}/inquiry/list">목록으로</a>
    <a href="${pageContext.request.contextPath}/inquiry/write">새 문의 등록</a>
</p>
</body>
</html>
