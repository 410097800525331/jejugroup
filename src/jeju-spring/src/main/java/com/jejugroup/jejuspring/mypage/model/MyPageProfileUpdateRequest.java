package com.jejugroup.jejuspring.mypage.model;

public record MyPageProfileUpdateRequest(
    String name,
    String nickname,
    String email,
    String phone,
    String bio
) {
}
