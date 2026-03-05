package util;

public class BCryptUtilTest {
    public static void main(String[] args) {
        System.out.println("[TDD] BCryptUtil 단위 테스트를 가동한다");
        
        String plain = "MetaDesign123!";
        
        // 1. 해싱 동작 테스트
        String hashed = BCryptUtil.hashPassword(plain);
        System.out.println(">> 생성된 해시: " + hashed);
        
        if (hashed == null || !hashed.startsWith("$2a$")) {
            System.err.println("[FAIL] 해시 포맷이 비정상임 (jbcrypt 규격 위반)");
            System.exit(1);
        }
        
        // 2. 정상 해시 검증 테스트 (GREEN)
        boolean isMatch = BCryptUtil.checkPassword(plain, hashed);
        if (!isMatch) {
            System.err.println("[FAIL] 올바른 패스워드 검증에 실패함");
            System.exit(1);
        }
        
        // 3. 비정상 해시 검증 차단 테스트
        boolean isNotMatch = BCryptUtil.checkPassword("Wrong123!", hashed);
        if (isNotMatch) {
            System.err.println("[FAIL] 틀린 패스워드가 검증을 통과함 (보안 펑크)");
            System.exit(1);
        }
        
        System.out.println("[PASS] 모든 BCryptUtil 모듈 테스트가 완벽하게 통과됨");
    }
}
