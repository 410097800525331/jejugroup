package com.jejugroup.jejuspring.auth.model;

import java.util.Map;

public record SignupRequest(
    String phone,
    String name,
    String id,
    String pw,
    String provider,
    String email,
    String birthDate,
    String rrnBackFirstDigit
) {
    public static SignupRequest fromForm(Map<String, String> form) {
        return new SignupRequest(
            form.get("phone"),
            form.get("name"),
            form.get("id"),
            form.get("pw"),
            form.get("provider"),
            form.get("email"),
            form.get("birthDate"),
            form.get("rrnBackFirstDigit")
        );
    }
}
