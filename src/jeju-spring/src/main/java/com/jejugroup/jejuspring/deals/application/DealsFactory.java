package com.jejugroup.jejuspring.deals.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.deals.view.DealsCardView;
import com.jejugroup.jejuspring.deals.view.DealsCouponView;
import com.jejugroup.jejuspring.deals.view.DealsPageView;

@Service
public class DealsFactory {
    public DealsPageView buildMain(String shell) {
        return new DealsPageView(
            shell,
            "/migration",
            "전 세계 여행을 더 가볍게, 글로벌 특가 프로모션",
            "호텔, 리조트, 렌터카, 액티비티까지 JEJU STAY 특가를 한 곳에서 묶는다.",
            coupons(),
            cards()
        );
    }

    public DealsPageView buildMember(String shell) {
        return new DealsPageView(
            shell,
            "/migration",
            "JEJU UNIVERSE 회원 전용 혜택",
            "회원 등급별 할인, 포인트 적립, 전용 특가를 한 번에 보는 화면.",
            List.of(),
            List.of(
                new DealsCardView("Private Member Sale", "로그인 회원 전용 비공개 특가", "", "최대 70% 할인", "member", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", "회원 전용"),
                new DealsCardView("Cashback & Points", "숙박 완료 후 현금처럼 쓰는 포인트", "", "포인트 2배 적립", "member", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", "적립 혜택"),
                new DealsCardView("VIP Experience", "공항 픽업과 라운지, 스파 혜택", "", "VIP 서비스", "member", "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", "프리미엄")
            )
        );
    }

    public DealsPageView buildPartner(String shell) {
        return new DealsPageView(
            shell,
            "/migration",
            "Partnership Benefits",
            "제휴 카드와 항공 연동을 통해 결제 혜택을 더 키우는 전용 페이지.",
            List.of(),
            List.of(
                new DealsCardView("현대카드 M포인트 사용 / 할인", "국내외 숙소 예약 시 포인트 결제 및 즉시 할인", "", "MAX 15% OFF", "partner", "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800&q=80", "HYUNDAI CARD"),
                new DealsCardView("삼성카드 LINK 전용 혜택", "20만원 이상 결제 시 2만원 청구 할인", "", "₩20,000 OFF", "partner", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", "SAMSUNG CARD"),
                new DealsCardView("제주항공 탑승객 특별 적립", "항공권 예약 번호 인증 시 포인트 2배 적립", "", "2X POINTS", "partner", "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80", "JEJU AIR")
            )
        );
    }

    private List<DealsCouponView> coupons() {
        return List.of(
            new DealsCouponView("호텔 10% 할인", "HOTEL10", "국내외 호텔 예약 시 바로 적용"),
            new DealsCouponView("액티비티 12% 할인", "ACT12", "인기 액티비티 결제 시 사용"),
            new DealsCouponView("렌터카 15,000원 할인", "CAR15000", "제휴 렌터카 예약 전용")
        );
    }

    private List<DealsCardView> cards() {
        return List.of(
            new DealsCardView("도쿄 시부야 부티크 호텔", "도심 한복판에서 누리는 프라이빗 스테이", "₩420,000", "₩289,000", "hotel", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80", "HOTEL"),
            new DealsCardView("발리 풀빌라 2박 패키지", "허니문 감성의 풀빌라 특가", "₩520,000", "₩358,000", "pension", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", "PENSION"),
            new DealsCardView("제주 전기차 렌터카 특가", "공항 픽업 포함 전기차 프로모션", "₩98,000", "₩71,000", "rentacar", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80", "RENT"),
            new DealsCardView("오사카 유니버설 입장권", "즉시 확정되는 인기 테마파크 티켓", "₩95,000", "₩88,000", "activity", "https://images.unsplash.com/photo-1718965908210-a795ff8c9358?w=800&q=80", "ACTIVITY")
        );
    }
}
