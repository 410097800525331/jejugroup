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

    private String loginId;
    private String password;
    private String name;
    private String email;
    private String role;
    
    // UI 폼 데이터
    private String phone;
    private String birthdate;
    private String gender;
    private String address;
    private boolean agreeMarketing;
}
