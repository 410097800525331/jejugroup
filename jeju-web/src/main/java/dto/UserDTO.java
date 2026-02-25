package dto;

import lombok.Data;
import java.io.Serializable;

/**
 * [Lombok Enabled DTO]
 * 이클립스 플러그인 설정 완료 후 롬복 어노테이션 복구.
 */
@Data
public class UserDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;          // varchar(50)
    private String pw;          // varchar(255)
    private String name;        // varchar(20)
    private String phone;       // varchar(30)
    private String gender;      // char(1)
    private String provider;    // varchar(10) (KAKAO, NAVER, PASS)
    private String role;        // varchar(10) default 'USER'
    
    // UI Form Data (Virtual layer for consent, etc.)
    private boolean agreeTerms;
    private boolean agreeMarketing;
}
