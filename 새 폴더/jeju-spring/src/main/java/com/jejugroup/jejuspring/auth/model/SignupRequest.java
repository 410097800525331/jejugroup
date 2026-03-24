package com.jejugroup.jejuspring.auth.model;

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
}
