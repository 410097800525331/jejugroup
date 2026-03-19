# CS Inquiry API

통합 고객센터 `1:1 문의`는 두 경로로 동작한다.

- 로컬 개발: `front/apps/cs` Vite 서버가 `/inquiry/*` 요청을 `http://127.0.0.1:3001`의 CS dev API로 프록시한다.
- 배포/미러: `jeju-web`의 Java Servlet API가 같은 `/inquiry/*` 경로를 처리한다.

둘 다 같은 MySQL `inquiry` 테이블 스키마를 사용한다.

## Endpoints

- `GET /inquiry/list`
  - 문의 목록 조회
  - 응답 필드: `id`, `title`, `content`, `service`, `status`, `date`
- `GET /inquiry/detail?id={id}`
  - 문의 상세 조회
- `POST /inquiry/update`
  - 요청 JSON 필드: `id`, `title`, `content`, `service`
  - 수정된 문의 레코드를 반환
- `POST /inquiry/delete`
  - 요청 JSON 필드: `id`
- `POST /inquiry/write`
  - 요청 JSON 필드: `title`, `content`, `service`
  - 등록 직후 생성된 문의 레코드를 반환

## Database Schema

`inquiry` 테이블은 아래 스키마를 기준으로 사용한다.

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

## Local Development

1. `jeju-web/.env` 파일을 만든다.

```env
DB_URL=jdbc:mysql://127.0.0.1:3306/jejudb?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USER=root
DB_PASSWORD=your-password
```

2. API 서버를 켠다.

```bash
pnpm run dev:cs:api
```

3. 프론트를 켠다.

```bash
pnpm run dev:cs
```

4. 브라우저에서 `http://localhost:3000/#/inquiries`로 확인한다.
5. 작성 후 목록에서 문의를 눌러 상세, 수정, 삭제 흐름을 확인한다.

## Notes

- 로컬 개발에서는 Vite 프록시를 사용하므로 별도 CORS 설정 없이 동작한다.
- `jeju-web` Servlet과 `front/apps/cs/server/dev-api.mjs`는 같은 필드만 저장/조회한다.
- 목록 화면에서는 `전체 / 제주항공 / 제주스테이 / 제주렌터카` 필터를 지원한다.
