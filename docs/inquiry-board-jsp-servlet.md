# Inquiry Board JSP/Servlet Guide

## 개요

- 위치: `jeju-web`
- 패턴: Servlet -> DAO -> JSP
- 기능: 문의 등록, 문의 목록, 문의 상세 조회
- URL:
  - `/inquiry/list`
  - `/inquiry/write`
  - `/inquiry/insert`
  - `/inquiry/detail?id=1`

## 파일 구조

```text
jeju-web/
  src/main/java/
    controller/
      InquiryListServlet.java
      InquiryWriteServlet.java
      InquiryInsertServlet.java
      InquiryDetailServlet.java
    dao/
      InquiryDAO.java
    dto/
      Inquiry.java
    util/
      DBConnection.java
  src/main/webapp/
    pages/cs/
      inquiry_list.jsp
      inquiry_write.jsp
      inquiry_detail.jsp
    WEB-INF/
      web.xml
```

## DB 테이블

```sql
CREATE TABLE inquiry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    service VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 설정 메모

- JDBC 드라이버는 `mysql-connector-j-9.6.0.jar` 기준입니다.
- DB 연결 정보는 `DBConnection.java`의 기본값 또는 `.env`의 `DB_URL`, `DB_USER`, `DB_PASSWORD`를 사용합니다.
- 최초 등록 상태는 `접수`로 저장됩니다.
