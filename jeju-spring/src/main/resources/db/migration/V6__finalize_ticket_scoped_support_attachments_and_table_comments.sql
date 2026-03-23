ALTER TABLE support_attachments
    DROP FOREIGN KEY fk_support_attachments_comment_ticket_pair,
    DROP INDEX idx_support_attachments_comment_ticket,
    DROP INDEX idx_support_attachments_comment,
    DROP COLUMN comment_ticket_id,
    DROP COLUMN comment_id;

ALTER TABLE support_comments
    DROP INDEX uk_support_comments_ticket_id_id;

ALTER TABLE users COMMENT = 'AuthService 레거시 users 계약을 유지하는 회원 기본 정보 테이블';
ALTER TABLE user_profiles COMMENT = '회원의 표시 이름, 프로필 이미지, 언어 설정을 저장하는 테이블';
ALTER TABLE user_auth_accounts COMMENT = '외부 인증 제공자와 회원 계정을 연결하는 테이블';
ALTER TABLE roles COMMENT = '시스템 역할과 권한 묶음을 정의하는 테이블';
ALTER TABLE permissions COMMENT = '역할에 부여할 수 있는 세부 권한을 정의하는 테이블';
ALTER TABLE role_permissions COMMENT = '역할과 권한의 연결 관계를 저장하는 테이블';
ALTER TABLE user_roles COMMENT = '회원에게 부여된 역할과 기본 역할 여부를 저장하는 테이블';
ALTER TABLE companion_links COMMENT = '회원이 함께 이용할 동행 정보를 저장하는 테이블';
ALTER TABLE notices COMMENT = '서비스 공지사항을 저장하는 테이블';
ALTER TABLE faqs COMMENT = '자주 묻는 질문과 답변을 저장하는 테이블';
ALTER TABLE support_categories COMMENT = '고객센터 문의 분류를 저장하는 테이블';
ALTER TABLE support_tickets COMMENT = '고객센터 문의 접수와 처리 상태를 저장하는 테이블';
ALTER TABLE support_comments COMMENT = '고객센터 문의에 달린 답변과 메모를 저장하는 테이블';
ALTER TABLE support_attachments COMMENT = '고객센터 문의에 첨부되는 파일 정보를 저장하는 테이블';
