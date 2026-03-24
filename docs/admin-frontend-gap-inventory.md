# Admin Frontend Gap Inventory

이 문서는 `jeju-spring/src/main/resources/db/migration/V1__jeju_spring_db_baseline.sql`, `V8__booking_payment_mypage_source.sql`, `V9__product_inventory_cms_admin_ops.sql`, `V10__booking_tree_integrity_and_payment_external_id_uniqueness.sql`, `V12__user_membership_links.sql` 을 근거로, DB에는 있으나 front admin에서 전용 운영 UI로 아직 분리되지 않은 축을 정리한 인벤토리다.

전제:
- 현재 노출 위치는 `front/admin` 기준으로 적었다.
- 전용 운영 UI가 아니라는 판단은 "허브형 탭에 섞임", "세부 데이터는 간접 노출만 됨", "예약/회원/CMS 공용 맥락에 묶여 있음" 기준이다.
- `priority 3`의 DB 네이밍 변경은 이번 범위 밖이다.

| 테이블 | 현재 노출 위치 | 왜 전용 운영 UI가 아니라고 보는지 | 추천 수용 위치 |
| --- | --- | --- | --- |
| `support_categories` | `front/admin/pages/members.html` / `문의사항` 탭에 흡수 | 별도 운영 탭이 아니라 문의사항 관리 안에 흡수된 상태라 전용 화면은 아니다 | `front/admin/pages/members.html` / `문의사항` 탭 |
| `support_tickets` | 없음 | 접수 목록, 상태, 답변 흐름을 직접 다루는 전용 화면이 없다 | `front/admin/pages/members.html` / `문의사항` 탭 아래 지원 접수 영역 |
| `membership_plans` | `front/admin/pages/members.html` / `멤버십` 탭 | 멤버십은 회원 허브의 한 갈래로만 묶여 있어 요금제 운영이 독립되지 않았다 | `front/admin/pages/members.html` / `멤버십` 탭 |
| `membership_plan_benefits` | `front/admin/pages/members.html` / `멤버십` 탭 | 혜택 상세가 플랜 하위 데이터라 전용 편집면이 없다 | `front/admin/pages/members.html` / `멤버십` 탭 |
| `roles` | `front/admin/pages/members.html` / `권한` 탭 | 역할 정의가 권한 허브 안에 묶여 있어 역할 전용 관리면은 아니다 | `front/admin/pages/members.html` / `권한` 탭 |
| `permissions` | `front/admin/pages/members.html` / `권한` 탭 | 세부 권한만 따로 운영하는 전용 화면이 없다 | `front/admin/pages/members.html` / `권한` 탭 |
| `role_permissions` | `front/admin/pages/members.html` / `권한` 탭 | 역할-권한 매핑이 역할 관리의 하위 데이터로만 보인다 | `front/admin/pages/members.html` / `권한` 탭 |
| `user_roles` | `front/admin/pages/members.html` / `권한` 탭 | 회원별 역할 부여가 권한 허브에 종속돼 있다 | `front/admin/pages/members.html` / `권한` 탭 |
| `booking_passengers` | `front/admin/pages/reservations.html` / `탑승객/이용자` 탭 | 예약 흐름 안의 하위 인물 데이터라 탑승객 전용 화면은 아니다 | `front/admin/pages/reservations.html` / `탑승객/이용자` 탭 |
| `admin_action_logs` | 없음 | 관리자 감사 로그를 읽기 전용으로 탐색하는 운영 UI가 없다 | `front/admin/pages/cms.html` / `공지사항·FAQ·배너·노출 규칙` 후보 영역 |
| `admin_preferences` | 없음 | 관리자 개인/공유 설정을 편집하는 전용 화면이 없다 | `front/admin/pages/cms.html` / `공지사항·FAQ·배너·노출 규칙` 후보 영역 |
| `user_blacklists` | 없음 | 사용자 차단 사유, 기간, 처리자를 직접 관리하는 UI가 없다 | `front/admin/pages/members.html` / `권한` 탭 |
| `user_auth_accounts` | 없음 | 외부 인증 계정 연결 상태를 운영자가 직접 점검하는 화면이 없다 | `front/admin/pages/members.html` / `회원` 또는 `권한` 탭 |
| `user_coupons` | 없음 | 쿠폰 발급/사용/만료를 회원 운영 화면과 분리해 다루지 않는다 | `front/admin/pages/members.html` / `멤버십` 탭 |
| `point_ledger` | 없음 | 포인트 적립/차감 이력을 확인하는 운영 뷰가 없다 | `front/admin/pages/reservations.html` / `결제` 탭 |
| `travel_events` | `front/admin/pages/reservations.html` / `탑승객/이용자` 탭 | 여행 일정 데이터가 예약 허브의 한 뷰로만 묶여 있어 일정 전용 운영면은 아니다 | `front/admin/pages/reservations.html` / `탑승객/이용자` 탭 |

priority 3의 DB 네이밍 변경은 이 문서와 이번 admin frontend 정리 범위 밖이다.
