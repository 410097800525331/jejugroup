package util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * BCryptUtil: Zero Monolith 기반 단일 책임 원칙에 따른 패스워드 해싱 전담 유틸리티.
 * 해싱(암호화) 및 검증(비교)만 단독으로 수행하며 에러 처리를 철저히 격리함.
 */
public class BCryptUtil {
    
    // 해싱 강도 (Work factor). 값이 클수록 보안은 강해지나 연산 시간이 길어짐
    private static final int WORK_FACTOR = 10;

    /**
     * 평문 비밀번호를 BCrypt 알고리즘으로 단방향 해싱함.
     * @param plainPassword 평문(입력받은) 패스워드
     * @return 해시된 문자열 ($2a$... 포맷)
     */
    public static String hashPassword(String plainPassword) {
        if (plainPassword == null || plainPassword.isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 비어 있을 수 없음");
        }
        // 솔트값을 자동으로 생성하여 평문과 섞음
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(WORK_FACTOR));
    }

    /**
     * 평문 비밀번호와 DB에 저장된 해시값이 일치하는지 검증함.
     * @param plainPassword 평문 패스워드 (로그인 시 유저가 입력한 값)
     * @param hashedPassword DB에 저장된 BCrypt 해시 문자열
     * @return 일치 여부 (true/false)
     */
    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || plainPassword.isEmpty() || hashedPassword == null || hashedPassword.isEmpty()) {
            return false;
        }
        try {
            return BCrypt.checkpw(plainPassword, hashedPassword);
        } catch (IllegalArgumentException e) {
            // 저장된 해시값이 BCrypt 포맷이 아닌 경우 예외 처리 (방어 로직)
            System.err.println("[SECURITY] 비정상적인 해시 포맷 검증 시도 차단됨");
            return false;
        }
    }
}
