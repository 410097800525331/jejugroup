package com.jejugroup.jejuspring.frontmirror.web;

import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

/**
 * Final-runtime baseline의 host-only 경로를 서빙한다.
 * 이 범위의 host-only 라우트는 완료된 런타임 커버리지로 본다.
 */
@Controller
public class FrontMirrorHostController {
    private static final Map<String, HostPageSpec> HOST_PAGES = Map.ofEntries(
        Map.entry(
            "/",
            new HostPageSpec(
                "제주그룹 랜딩",
                "Landing host page",
                "메인 랜딩은 front-mirror 경계에서 서빙한다.",
                "front/index.html",
                "landing-host",
                List.of(
                    "/와 /index.html은 같은 host-only 랜딩이다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/index.html",
            new HostPageSpec(
                "제주그룹 랜딩",
                "Landing host page",
                "메인 랜딩은 front-mirror 경계에서 서빙한다.",
                "front/index.html",
                "landing-host",
                List.of(
                    "/와 /index.html은 같은 host-only 랜딩이다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/jejuair/index.html",
            new HostPageSpec(
                "제주에어",
                "Spring host page",
                "제주에어 최상위 진입점은 Spring이 호스트만 맡는다.",
                "front/jejuair/index.html",
                "air-host",
                List.of(
                    "landing CTA는 이 경로로 연결된다.",
                    "깊은 하위 페이지는 이번 cutover 범위 밖이다.",
                    "화면 본문은 front 원본 기준으로 유지한다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/deals/deals.html",
            new HostPageSpec(
                "제주그룹 혜택",
                "Landing host page",
                "deals 메인 화면은 front-mirror 경계에서 서빙한다.",
                "front/jejustay/pages/deals/deals.html",
                "landing-host",
                List.of(
                    "/deals는 이 canonical host-only 경로로 redirect 된다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/deals/deals_member.html",
            new HostPageSpec(
                "제주그룹 멤버 혜택",
                "Landing host page",
                "member deals 화면은 front-mirror 경계에서 서빙한다.",
                "front/jejustay/pages/deals/deals_member.html",
                "landing-host",
                List.of(
                    "/deals/member는 이 canonical host-only 경로로 redirect 된다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/deals/deals_partner.html",
            new HostPageSpec(
                "제주그룹 파트너 혜택",
                "Landing host page",
                "partner deals 화면은 front-mirror 경계에서 서빙한다.",
                "front/jejustay/pages/deals/deals_partner.html",
                "landing-host",
                List.of(
                    "/deals/partner는 이 canonical host-only 경로로 redirect 된다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/hotel/hotel-list.html",
            new HostPageSpec(
                "제주스테이 호텔 목록",
                "Landing host page",
                "호텔 목록은 front-mirror 경계에서 서빙한다.",
                "front/jejustay/pages/hotel/hotel-list.html",
                "landing-host",
                List.of(
                    "/stay/hotel-list는 이 canonical host-only 경로로 redirect 된다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/travel/activities.html",
            new HostPageSpec(
                "제주여행 액티비티",
                "Landing host page",
                "activities 화면은 front-mirror 경계에서 서빙한다.",
                "front/jejustay/pages/travel/activities.html",
                "landing-host",
                List.of(
                    "/travel/activities는 이 canonical host-only 경로로 redirect 된다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/travel/esim.html",
            new HostPageSpec(
                "제주여행 eSIM",
                "Landing host page",
                "eSIM 화면은 front-mirror 경계에서 서빙한다.",
                "front/jejustay/pages/travel/esim.html",
                "landing-host",
                List.of(
                    "/travel/esim은 이 canonical host-only 경로로 redirect 된다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/travel/travel_guide.html",
            new HostPageSpec(
                "제주여행 가이드",
                "Landing host page",
                "travel guide 화면은 front-mirror 경계에서 서빙한다.",
                "front/jejustay/pages/travel/travel_guide.html",
                "landing-host",
                List.of(
                    "/travel/guide는 이 canonical host-only 경로로 redirect 된다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/travel/travel_tips.html",
            new HostPageSpec(
                "제주여행 팁",
                "Landing host page",
                "travel tips 화면은 front-mirror 경계에서 서빙한다.",
                "front/jejustay/pages/travel/travel_tips.html",
                "landing-host",
                List.of(
                    "/travel/tips는 이 canonical host-only 경로로 redirect 된다.",
                    "전용 Spring 템플릿은 더 이상 쓰지 않는다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/about/about.html",
            new HostPageSpec(
                "제주에어 소개",
                "Spring host page",
                "about 페이지는 Spring host-only로 유지한다.",
                "front/jejuair/pages/about/about.html",
                "air-host",
                List.of(
                    "about 페이지는 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/about/career.html",
            new HostPageSpec(
                "제주에어 채용",
                "Spring host page",
                "career 페이지는 Spring host-only로 유지한다.",
                "front/jejuair/pages/about/career.html",
                "air-host",
                List.of(
                    "career 페이지는 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/about/ccm.html",
            new HostPageSpec(
                "제주에어 CCM",
                "Spring host page",
                "ccm 페이지는 Spring host-only로 유지한다.",
                "front/jejuair/pages/about/ccm.html",
                "air-host",
                List.of(
                    "ccm 페이지는 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/baggage/cabinBaggage.html",
            new HostPageSpec(
                "수하물 기내반입",
                "Spring host page",
                "기내 반입 안내 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/baggage/cabinBaggage.html",
                "air-host",
                List.of(
                    "수하물 안내 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/baggage/liability.html",
            new HostPageSpec(
                "수하물 배상책임",
                "Spring host page",
                "수하물 배상책임 안내 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/baggage/liability.html",
                "air-host",
                List.of(
                    "수하물 책임 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/baggage/preorderedBaggage.html",
            new HostPageSpec(
                "수하물 사전구매",
                "Spring host page",
                "수하물 사전구매 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/baggage/preorderedBaggage.html",
                "air-host",
                List.of(
                    "사전구매 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/baggage/transportLimitation.html",
            new HostPageSpec(
                "수하물 운송제한",
                "Spring host page",
                "수하물 운송제한 안내 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/baggage/transportLimitation.html",
                "air-host",
                List.of(
                    "운송제한 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/boarding/eDocument.html",
            new HostPageSpec(
                "탑승 전자문서",
                "Spring host page",
                "탑승 전자문서 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/boarding/eDocument.html",
                "air-host",
                List.of(
                    "전자문서 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/boarding/fastProcedure.html",
            new HostPageSpec(
                "탑승 빠른절차",
                "Spring host page",
                "탑승 빠른절차 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/boarding/fastProcedure.html",
                "air-host",
                List.of(
                    "빠른절차 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/boarding/viewCheckin.html",
            new HostPageSpec(
                "탑승 체크인 조회",
                "Spring host page",
                "탑승 체크인 조회 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/boarding/viewCheckin.html",
                "air-host",
                List.of(
                    "체크인 조회 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/booking/Availability.html",
            new HostPageSpec(
                "예약 가능 여부",
                "Spring host page",
                "예약 가능 여부 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/booking/Availability.html",
                "air-host",
                List.of(
                    "예약 가능 여부 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/booking/payment.html",
            new HostPageSpec(
                "예약 결제",
                "Spring host page",
                "예약 결제 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/booking/payment.html",
                "air-host",
                List.of(
                    "결제 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/booking/route.html",
            new HostPageSpec(
                "예약 노선",
                "Spring host page",
                "예약 노선 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/booking/route.html",
                "air-host",
                List.of(
                    "노선 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/booking/viewOnOffReservationList.html",
            new HostPageSpec(
                "예약 현황",
                "Spring host page",
                "예약 현황 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/booking/viewOnOffReservationList.html",
                "air-host",
                List.of(
                    "예약 현황 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/event/event.html",
            new HostPageSpec(
                "이벤트",
                "Spring host page",
                "이벤트 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/event/event.html",
                "air-host",
                List.of(
                    "이벤트 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/jmembers/jmembersAirplane.html",
            new HostPageSpec(
                "J멤버스 비행기",
                "Spring host page",
                "J멤버스 비행기 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/jmembers/jmembersAirplane.html",
                "air-host",
                List.of(
                    "J멤버스 비행기 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/jmembers/jmembersGolf.html",
            new HostPageSpec(
                "J멤버스 골프",
                "Spring host page",
                "J멤버스 골프 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/jmembers/jmembersGolf.html",
                "air-host",
                List.of(
                    "J멤버스 골프 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/jmembers/jmembersInsurance.html",
            new HostPageSpec(
                "J멤버스 보험",
                "Spring host page",
                "J멤버스 보험 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/jmembers/jmembersInsurance.html",
                "air-host",
                List.of(
                    "J멤버스 보험 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/jmembers/jmembersSightseeing.html",
            new HostPageSpec(
                "J멤버스 관광",
                "Spring host page",
                "J멤버스 관광 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/jmembers/jmembersSightseeing.html",
                "air-host",
                List.of(
                    "J멤버스 관광 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/pet/petPass.html",
            new HostPageSpec(
                "반려동물 패스",
                "Spring host page",
                "반려동물 패스 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/pet/petPass.html",
                "air-host",
                List.of(
                    "반려동물 패스 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/jejuair/pages/pet/petService.html",
            new HostPageSpec(
                "반려동물 서비스",
                "Spring host page",
                "반려동물 서비스 페이지는 Spring이 호스트만 맡는다.",
                "front/jejuair/pages/pet/petService.html",
                "air-host",
                List.of(
                    "반려동물 서비스 본문은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/pages/auth/oauth_callback.html",
            new HostPageSpec(
                "OAuth 인증 콜백",
                "Spring host page",
                "OAuth callback 페이지는 Spring이 호스트만 맡는다.",
                "front/pages/auth/oauth_callback.html",
                "auth-host",
                List.of(
                    "OAuth 콜백 화면은 front 원본 기준으로 유지한다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 서빙한다."
                )
            )
        ),
        Map.entry(
            "/pages/cs/customer_center.html",
            new HostPageSpec(
                "고객센터",
                "Front mirror host",
                "고객센터 React 앱의 Spring 최종 런타임 호스트다.",
                "front/apps/cs/client/index.html",
                "customer-center",
                List.of(
                    "notices, faqs, inquiries는 Spring API를 사용한다.",
                    "Spring은 이 경로의 host만 담당하고 본문 의미는 front 원본을 따른다.",
                    "정적 전용 페이지가 아니라 React island / shell 통합 진입점이다."
                )
            )
        ),
        Map.entry(
            "/pages/auth/login.html",
            new HostPageSpec(
                "로그인",
                "Spring host page",
                "로그인 진입점은 Spring이 호스트만 맡고 본문은 front 원본을 따른다.",
                "front/pages/auth/login.html",
                "auth-host",
                List.of(
                    "로그인 화면은 front-mirror auth 템플릿으로 유지한다.",
                    "AuthPageController는 /auth/login 별칭만 남긴다."
                )
            )
        ),
        Map.entry(
            "/pages/auth/signup.html",
            new HostPageSpec(
                "회원가입",
                "Spring host page",
                "회원가입 진입점은 Spring이 호스트만 맡고 본문은 front 원본을 따른다.",
                "front/pages/auth/signup.html",
                "auth-host",
                List.of(
                    "회원가입 화면은 front-mirror auth 템플릿으로 유지한다.",
                    "AuthPageController는 /auth/signup 별칭만 남긴다."
                )
            )
        ),
        Map.entry(
            "/pages/auth/pass_auth.html",
            new HostPageSpec(
                "PASS 인증",
                "Spring host page",
                "PASS 인증 진입점은 Spring이 호스트만 맡고 본문은 front 원본을 따른다.",
                "front/pages/auth/pass_auth.html",
                "auth-host",
                List.of(
                    "PASS 인증 화면은 front-mirror auth 템플릿으로 유지한다.",
                    "AuthPageController는 /auth/pass 별칭만 남긴다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/hotel/jejuhotel.html",
            new HostPageSpec(
                "제주스테이 호텔",
                "Spring host page",
                "호텔 검색 진입점은 Spring에서 호스트만 담당한다.",
                "front/jejustay/pages/hotel/jejuhotel.html",
                "stay-host",
                List.of(
                    "호텔 검색 섹션은 front 원본의 레이아웃과 런타임을 따른다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 호스트 계층에서 유지한다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/stay/jejustay_life.html",
            new HostPageSpec(
                "제주스테이 라이프",
                "Spring host page",
                "라이프 검색 진입점은 Spring에서 호스트만 담당한다.",
                "front/jejustay/pages/stay/jejustay_life.html",
                "stay-host",
                List.of(
                    "검색 위젯과 섹션 구성은 front 원본 기준이다.",
                    "Spring은 URL과 host shell만 고정한다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/stay/private_stay.html",
            new HostPageSpec(
                "프라이빗 스테이",
                "Spring host page",
                "프라이빗 스테이 진입점은 Spring에서 호스트만 담당한다.",
                "front/jejustay/pages/stay/private_stay.html",
                "stay-host",
                List.of(
                    "호텔 검색 위젯을 공유하는 호스트 경로다.",
                    "전용 Spring 템플릿이 아니라 front-mirror 경계에서 유지한다."
                )
            )
        ),
        Map.entry(
            "/jejustay/pages/travel/travel_checklist.html",
            new HostPageSpec(
                "여행 체크리스트",
                "Spring host page",
                "여행 체크리스트 진입점은 Spring에서 호스트만 담당한다.",
                "front/jejustay/pages/travel/travel_checklist.html",
                "travel-host",
                List.of(
                    "체크리스트 island는 front 원본 기준으로 유지한다.",
                    "Spring final runtime에서는 host shell만 제공한다."
                )
            )
        ),
        Map.entry(
            "/pages/mypage/dashboard.html",
            new HostPageSpec(
                "MyPage dashboard",
                "Front mirror host",
                "Canonical mypage dashboard is served from the front-mirror runtime page.",
                "front/pages/mypage/dashboard.html",
                "mypage-host",
                List.of(
                    "/mypage/dashboard is redirect-only.",
                    "Dedicated Spring template rendering is no longer used here."
                )
            )
        ),
        Map.entry(
            "/admin/pages/dashboard.html",
            new HostPageSpec(
                "관리자 대시보드",
                "Spring host page",
                "관리자 페이지는 Spring 최종 런타임에서 호스트만 담당한다.",
                "front/admin/pages/dashboard.html",
                "admin-host",
                List.of(
                    "관리자 페이지는 front 원본과 동기화되는 mirror boundary다.",
                    "Spring은 실제 관리 UI의 host path만 제공한다."
                )
            )
        ),
        Map.entry(
            "/admin/pages/reservations.html",
            new HostPageSpec(
                "관리자 예약",
                "Spring host page",
                "예약 관리 페이지는 Spring 최종 런타임에서 호스트만 담당한다.",
                "front/admin/pages/reservations.html",
                "admin-host",
                List.of(
                    "예약 관리 UI는 front 원본을 기준으로 유지한다.",
                    "Spring은 host shell과 route만 제공한다."
                )
            )
        ),
        Map.entry(
            "/admin/pages/lodging.html",
            new HostPageSpec(
                "관리자 숙박",
                "Spring host page",
                "숙박 관리 페이지는 Spring 최종 런타임에서 호스트만 담당한다.",
                "front/admin/pages/lodging.html",
                "admin-host",
                List.of(
                    "숙박 관리 UI는 front mirror boundary다.",
                    "Spring은 host shell만 제공한다."
                )
            )
        ),
        Map.entry(
            "/admin/pages/members.html",
            new HostPageSpec(
                "관리자 회원",
                "Spring host page",
                "회원 관리 페이지는 Spring 최종 런타임에서 호스트만 담당한다.",
                "front/admin/pages/members.html",
                "admin-host",
                List.of(
                    "회원 관리 UI는 front 원본 기준으로 유지한다.",
                    "Spring은 route ownership만 고정한다."
                )
            )
        ),
        Map.entry(
            "/admin/pages/cms.html",
            new HostPageSpec(
                "관리자 CMS",
                "Spring host page",
                "CMS 관리 페이지는 Spring 최종 런타임에서 호스트만 담당한다.",
                "front/admin/pages/cms.html",
                "admin-host",
                List.of(
                    "공지/FAQ CMS는 front 원본과 Spring API를 연결하는 mirror boundary다.",
                    "Spring은 host와 데이터 API를 함께 책임진다."
                )
            )
        )
    );

    private final ResourceLoader resourceLoader;

    public FrontMirrorHostController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @GetMapping({
        "/",
        "/index.html",
        "/jejuair/index.html",
        "/jejuair/pages/about/about.html",
        "/jejuair/pages/about/career.html",
        "/jejuair/pages/about/ccm.html",
        "/jejuair/pages/baggage/cabinBaggage.html",
        "/jejuair/pages/baggage/liability.html",
        "/jejuair/pages/baggage/preorderedBaggage.html",
        "/jejuair/pages/baggage/transportLimitation.html",
        "/jejuair/pages/boarding/eDocument.html",
        "/jejuair/pages/boarding/fastProcedure.html",
        "/jejuair/pages/boarding/viewCheckin.html",
        "/jejuair/pages/booking/Availability.html",
        "/jejuair/pages/booking/payment.html",
        "/jejuair/pages/booking/route.html",
        "/jejuair/pages/booking/viewOnOffReservationList.html",
        "/jejuair/pages/event/event.html",
        "/jejuair/pages/jmembers/jmembersAirplane.html",
        "/jejuair/pages/jmembers/jmembersGolf.html",
        "/jejuair/pages/jmembers/jmembersInsurance.html",
        "/jejuair/pages/jmembers/jmembersSightseeing.html",
        "/jejuair/pages/pet/petPass.html",
        "/jejuair/pages/pet/petService.html",
        "/pages/cs/customer_center.html",
        "/pages/auth/login.html",
        "/pages/auth/signup.html",
        "/pages/auth/pass_auth.html",
        "/pages/auth/oauth_callback.html",
        "/jejustay/pages/deals/deals.html",
        "/jejustay/pages/deals/deals_member.html",
        "/jejustay/pages/deals/deals_partner.html",
        "/jejustay/pages/hotel/hotel-list.html",
        "/jejustay/pages/travel/activities.html",
        "/jejustay/pages/travel/esim.html",
        "/jejustay/pages/travel/travel_guide.html",
        "/jejustay/pages/travel/travel_tips.html",
        "/jejustay/pages/hotel/jejuhotel.html",
        "/jejustay/pages/stay/jejustay_life.html",
        "/jejustay/pages/stay/private_stay.html",
        "/jejustay/pages/travel/travel_checklist.html",
        "/pages/mypage/dashboard.html",
        "/admin/pages/dashboard.html",
        "/admin/pages/reservations.html",
        "/admin/pages/lodging.html",
        "/admin/pages/members.html",
        "/admin/pages/cms.html"
    })
    public String host(HttpServletRequest request, Model model) {
        String path = normalizeRequestPath(request);
        HostPageSpec hostPage = HOST_PAGES.get(path);
        if (hostPage == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        String viewName = toFrontMirrorViewName(path);
        if (!templateExists(viewName)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "front-mirror template is missing");
        }

        model.addAttribute("hostPage", hostPage);
        model.addAttribute("frontMirrorViewName", viewName);
        return viewName;
    }

    private String normalizeRequestPath(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String contextPath = request.getContextPath();
        if (contextPath != null && !contextPath.isBlank() && requestUri.startsWith(contextPath)) {
            return requestUri.substring(contextPath.length());
        }
        return requestUri;
    }

    private String toFrontMirrorViewName(String path) {
        if (!path.endsWith(".html")) {
            if ("/".equals(path)) {
                return "front-mirror/index";
            }
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return "front-mirror" + path.substring(0, path.length() - ".html".length());
    }

    private boolean templateExists(String viewName) {
        return resourceLoader.getResource("classpath:/templates/" + viewName + ".html").exists();
    }

    public record HostPageSpec(
        String title,
        String eyebrow,
        String summary,
        String frontSourcePath,
        String boundaryKind,
        List<String> notes
    ) {
    }
}
