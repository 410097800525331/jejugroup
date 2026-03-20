<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>고객 문의 게시판</title>
</head>
<body>
<h1>고객 문의 게시판</h1>
<p><a href="${pageContext.request.contextPath}/inquiry/write">문의 등록</a></p>
<c:choose>
    <c:when test="${empty inquiryList}">
        <p>등록된 문의가 없습니다.</p>
    </c:when>
    <c:otherwise>
        <table border="1" cellpadding="8" cellspacing="0">
            <thead>
            <tr>
                <th>번호</th>
                <th>제목</th>
                <th>서비스</th>
                <th>상태</th>
                <th>등록일</th>
            </tr>
            </thead>
            <tbody>
            <c:forEach var="inquiry" items="${inquiryList}">
                <tr>
                    <td>${inquiry.id}</td>
                    <td><a href="${pageContext.request.contextPath}/inquiry/detail?id=${inquiry.id}"><c:out value="${inquiry.title}" /></a></td>
                    <td><c:out value="${inquiry.service}" /></td>
                    <td><c:out value="${inquiry.status}" /></td>
                    <td><fmt:formatDate value="${inquiry.createdAt}" pattern="yyyy-MM-dd HH:mm" /></td>
                </tr>
            </c:forEach>
            </tbody>
        </table>
    </c:otherwise>
</c:choose>
</body>
</html>
