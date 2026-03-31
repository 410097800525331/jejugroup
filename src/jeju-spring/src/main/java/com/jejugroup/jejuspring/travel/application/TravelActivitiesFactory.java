package com.jejugroup.jejuspring.travel.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.travel.view.TravelActivitiesPageView;
import com.jejugroup.jejuspring.travel.view.TravelActivityView;
import com.jejugroup.jejuspring.travel.view.TravelCategoryView;

@Service
public class TravelActivitiesFactory {
    public TravelActivitiesPageView build(String shell) {
        return new TravelActivitiesPageView(
            shell,
            "/auth/login?shell=%s".formatted(shell),
            "/auth/pass?shell=%s".formatted(shell),
            "/migration",
            categories(),
            activities()
        );
    }

    private List<TravelCategoryView> categories() {
        return List.of(
            new TravelCategoryView("all", "전체"),
            new TravelCategoryView("tour", "투어/가이드"),
            new TravelCategoryView("ticket", "티켓/입장권"),
            new TravelCategoryView("water", "워터스포츠"),
            new TravelCategoryView("spa", "스파/힐링"),
            new TravelCategoryView("food", "맛집/다이닝")
        );
    }

    private List<TravelActivityView> activities() {
        return List.of(
            new TravelActivityView("cebu-whale", "water", "[세부] 오슬롭 고래상어 투어 + 캐녀닝", "세부 · 워터스포츠", "4.9", "128", "https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=600&q=80", "즉시 확정", "제주 유니버스 혜택", "₩120,000", "₩89,000"),
            new TravelActivityView("bangkok-spa", "spa", "[방콕] 렛츠 릴렉스 스파", "방콕 · 마사지", "4.8", "342", "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80", "즉시 확정", "포인트 2배", "₩45,000", "₩38,500"),
            new TravelActivityView("venice-gondola", "tour", "[베니스] 곤돌라 탑승권 + 오디오 가이드", "베니스 · 투어", "4.7", "89", "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=80", "즉시 확정", "빠른 입장", "₩60,000", "₩52,000"),
            new TravelActivityView("hawaii-surf", "water", "[와이키키] 서핑 입문 강습", "하와이 · 서핑", "5.0", "56", "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&q=80", "즉시 확정", "사진 촬영 무료", "₩150,000", "₩135,000"),
            new TravelActivityView("osaka-usj", "ticket", "[오사카] 유니버설 스튜디오 재팬 입장권", "오사카 · 테마파크", "4.9", "2450", "https://images.unsplash.com/photo-1718965908210-a795ff8c9358?w=500&h=500&q=80&fit=crop&crop=focalpoint&fp-y=0.61", "즉시 확정", "공식 파트너", "₩95,000", "₩88,000"),
            new TravelActivityView("paris-louvre", "ticket", "[파리] 루브르 박물관 우선 입장권", "파리 · 미술관", "4.8", "1102", "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80", "즉시 확정", "빠른 입장", "₩32,000", "₩29,900"),
            new TravelActivityView("danang-bana", "tour", "[다낭] 바나힐 일일 투어", "다낭 · 투어", "4.7", "580", "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80", "즉시 확정", "점심 뷔페 포함", "₩65,000", "₩55,000"),
            new TravelActivityView("taipei-101", "ticket", "[타이베이] 101 타워 전망대 입장권", "타이베이 · 전망대", "4.8", "890", "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=600&q=80", "즉시 확정", "패스트트랙", "₩25,000", "₩21,500"),
            new TravelActivityView("bali-swing", "tour", "[발리] 우붓 정글 스윙 + 인생샷 투어", "발리 · 투어", "4.9", "420", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", "즉시 확정", "사진 촬영 무료", "₩40,000", "₩32,000"),
            new TravelActivityView("tokyo-tsukiji", "food", "[도쿄] 츠키지 시장 워킹 푸드 투어", "도쿄 · 맛집", "4.9", "150", "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80", "즉시 확정", "시식 포함", "₩80,000", "₩72,000"),
            new TravelActivityView("fukuoka-ramen", "food", "[후쿠오카] 정통 라멘 만들기 클래스", "후쿠오카 · 쿠킹클래스", "4.8", "95", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", "즉시 확정", "로컬 클래스", "₩55,000", "₩49,000"),
            new TravelActivityView("sapporo-onsen", "spa", "[삿포로] 조잔케이 온천 당일 입욕권", "삿포로 · 온천", "4.9", "310", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", "즉시 확정", "왕복 셔틀", "₩35,000", "₩28,000")
        );
    }
}
