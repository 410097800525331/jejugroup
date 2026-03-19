package com.jejugroup.jejuspring.mypage.view;

import java.util.List;

public record MyPageBookingView(
    String id,
    String type,
    String title,
    String status,
    String date,
    String amount,
    List<String> tags
) {
}
