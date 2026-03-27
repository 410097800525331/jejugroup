package com.jejugroup.jejuspring.mypage.model;

public record MyPageProfileUpdateRequest(
    String name,
    String email,
    String phone
) {
}
