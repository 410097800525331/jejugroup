package com.jejugroup.jejuspring.stay.application;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.stay.view.StayHotelListFilterOptionView;
import com.jejugroup.jejuspring.stay.view.StayHotelListFilterSectionView;
import com.jejugroup.jejuspring.stay.view.StayHotelListItemView;
import com.jejugroup.jejuspring.stay.view.StayHotelListPageView;
import com.jejugroup.jejuspring.stay.view.StayHotelListSearchSummaryView;

@Service
public class StayHotelListFactory {
    public StayHotelListPageView build(String shell, StayHotelListQuery query) {
        RegionProfile profile = resolveRegionProfile(query);
        Set<String> selectedFilters = normalizeFilters(query.filters());
        List<StayHotelListItemView> filteredHotels = filterHotels(profile.hotels(), selectedFilters, profile);

        return new StayHotelListPageView(
            shell,
            profile.region(),
            profile.label(),
            profile.mapButtonLabel(),
            "/migration",
            buildSearchSummary(query, profile),
            buildFilterSections(profile, selectedFilters),
            filteredHotels
        );
    }

    private StayHotelListSearchSummaryView buildSearchSummary(StayHotelListQuery query, RegionProfile profile) {
        String destinationLabel = hasText(query.keyword())
            ? query.keyword().trim()
            : profile.label() + ", " + profile.countryLabel();

        String dateLabel = hasText(query.checkIn()) && hasText(query.checkOut())
            ? query.checkIn() + " - " + query.checkOut()
            : "날짜를 선택하세요";

        String guestLabel = "성인 " + query.adults() + "명"
            + (query.children() > 0 ? ", 아동 " + query.children() + "명" : "")
            + ", 객실 " + query.rooms() + "개";

        return new StayHotelListSearchSummaryView(destinationLabel, dateLabel, guestLabel);
    }

    private List<StayHotelListFilterSectionView> buildFilterSections(RegionProfile profile, Set<String> selectedFilters) {
        return List.of(
            new StayHotelListFilterSectionView("popular", profile.label() + " 인기 검색 조건", withChecked(profile.popularFilters(), selectedFilters)),
            new StayHotelListFilterSectionView("property-types", "숙소 종류", withChecked(profile.propertyTypes(), selectedFilters)),
            new StayHotelListFilterSectionView("locations", "지역", withChecked(profile.locations(), selectedFilters)),
            new StayHotelListFilterSectionView("payment-options", "결제 관련 옵션", withChecked(profile.paymentOptions(), selectedFilters)),
            new StayHotelListFilterSectionView("guest-ratings", "투숙객 평가 점수", withChecked(profile.guestRatings(), selectedFilters)),
            new StayHotelListFilterSectionView("amenities", "숙소 편의 시설 및 서비스", withChecked(profile.amenities(), selectedFilters))
        ).stream().collect(Collectors.collectingAndThen(Collectors.toList(), sections -> {
            sections.addAll(buildLegacyLongSections(profile.region(), selectedFilters));
            return List.copyOf(sections);
        }));
    }

    private List<StayHotelListFilterSectionView> buildLegacyLongSections(String region, Set<String> selectedFilters) {
        if (!"hiroshima".equals(region)) {
            return List.of();
        }

        return List.of(
            new StayHotelListFilterSectionView("star-rating", "숙소 성급", withChecked(List.of(
                option("ui-five-star", "5-성급", 10, null),
                option("ui-four-star", "4-성급", 47, null),
                option("ui-three-star", "3-성급", 149, null),
                option("ui-two-star", "2-성급", 63, null),
                option("ui-one-star", "1-성급", 44, null)
            ), selectedFilters)),
            new StayHotelListFilterSectionView("meal-options", "이용 가능 서비스 / 옵션", withChecked(List.of(
                option("ui-breakfast-included", "조식 포함", 63, null),
                option("ui-dinner-included", "석식(저녁) 포함", 17, null),
                option("ui-free-sauna", "사우나 무료 이용", 3, null),
                option("ui-early-checkin", "얼리 체크인", 2, null),
                option("ui-late-checkout", "레이트 체크아웃", 2, null),
                option("ui-lunch-included", "중식(점심) 포함", 1, null),
                option("ui-shuttle", "무료 셔틀 서비스", 1, null)
            ), selectedFilters)),
            new StayHotelListFilterSectionView("room-amenities", "객실 편의 시설/서비스", withChecked(List.of(
                option("ui-heating", "난방", 193, null),
                option("ui-fridge", "냉장고", 185, null),
                option("ui-tv", "TV", 177, null),
                option("ui-bathtub", "욕조", 155, null),
                option("ui-aircon", "에어컨", 111, null),
                option("ui-washer", "세탁기", 78, null),
                option("ui-room-internet", "인터넷", 70, null),
                option("ui-coffee-maker", "커피/티 메이커", 43, null),
                option("ui-balcony", "발코니/테라스", 39, null),
                option("ui-room-kitchen", "주방", 22, null),
                option("ui-ironing", "다림질 도구", 20, null),
                option("ui-room-pet", "반려동물 동반 가능", 5, null)
            ), selectedFilters)),
            new StayHotelListFilterSectionView("distance", "도심까지의 거리", withChecked(List.of(
                option("ui-city-center", "도심에 위치", 96, null),
                option("ui-city-under-2", "도심까지 2km 미만", 200, null),
                option("ui-city-2-5", "도심까지 2~5km", 16, null),
                option("ui-city-5-10", "도심까지 5~10km", 14, null)
            ), selectedFilters)),
            new StayHotelListFilterSectionView("bed-types", "침대 종류", withChecked(List.of(
                option("ui-double-bed", "더블베드", 251, null),
                option("ui-single-bed", "싱글/트윈베드", 151, null),
                option("ui-queen-bed", "퀸베드", 73, null),
                option("ui-bunk-bed", "벙크베드", 24, null),
                option("ui-king-bed", "킹베드", 17, null)
            ), selectedFilters)),
            new StayHotelListFilterSectionView("landmarks", "주변 인기 명소", withChecked(List.of(
                option("ui-okonomimura", "오코노미무라", 134, null),
                option("ui-atomic-bomb-dome", "원폭 돔", 128, null),
                option("ui-peace-museum", "히로시마 평화 기념관", 113, null),
                option("ui-sukkein", "수케이엔 정원", 87, null),
                option("ui-hiroshima-castle", "히로시마 성", 45, null)
            ), selectedFilters))
        );
    }

    private List<StayHotelListFilterOptionView> withChecked(List<StayHotelListFilterOptionView> options, Set<String> selectedFilters) {
        return options.stream()
            .map(option -> new StayHotelListFilterOptionView(
                option.id(),
                option.label(),
                option.count(),
                option.description(),
                selectedFilters.contains(option.id())
            ))
            .toList();
    }

    private Set<String> normalizeFilters(List<String> filters) {
        return filters.stream()
            .filter(this::hasText)
            .map(String::trim)
            .collect(Collectors.toSet());
    }

    private List<StayHotelListItemView> filterHotels(List<StayHotelListItemView> hotels, Set<String> selectedFilters, RegionProfile profile) {
        Set<String> locationOptionIds = profile.locations().stream()
            .map(StayHotelListFilterOptionView::id)
            .collect(Collectors.toSet());

        return hotels.stream()
            .filter(hotel -> matchesHotel(hotel, selectedFilters, locationOptionIds))
            .toList();
    }

    private boolean matchesHotel(StayHotelListItemView hotel, Set<String> selectedFilters, Set<String> locationOptionIds) {
        if (selectedFilters.isEmpty()) {
            return true;
        }

        Set<String> propertyTypeFilters = selectedFilters.stream()
            .filter(this::isPropertyTypeFilter)
            .collect(Collectors.toSet());

        Set<String> locationFilters = selectedFilters.stream()
            .filter(locationOptionIds::contains)
            .collect(Collectors.toSet());

        if (!propertyTypeFilters.isEmpty() && !propertyTypeFilters.contains(hotel.propertyTypeId())) {
            return false;
        }

        if (!locationFilters.isEmpty() && !locationFilters.contains(hotel.locationId())) {
            return false;
        }

        for (String filterId : selectedFilters) {
            if (filterId.startsWith("rating-")) {
                int threshold = Integer.parseInt(filterId.substring("rating-".length()));
                if (parseScore(hotel.reviewScore()) < threshold) {
                    return false;
                }
                continue;
            }

            if (filterId.startsWith("ui-")) {
                continue;
            }

            if (isPropertyTypeFilter(filterId)) {
                continue;
            }

            if (locationFilters.contains(filterId)) {
                continue;
            }

            if (!hotel.filterIds().contains(filterId)) {
                return false;
            }
        }

        return true;
    }

    private boolean isPropertyTypeFilter(String filterId) {
        return Set.of("hotel", "resort", "ryokan", "apartment", "capsule", "poolvilla", "private-house", "villa").contains(filterId);
    }

    private double parseScore(String reviewScore) {
        try {
            return Double.parseDouble(reviewScore);
        } catch (NumberFormatException exception) {
            return 0;
        }
    }

    private RegionProfile resolveRegionProfile(StayHotelListQuery query) {
        String region = normalizeRegion(query.region());
        String keyword = query.keyword() == null ? "" : query.keyword().trim().toLowerCase();

        if ("jeju".equals(region) || keyword.contains("제주") || keyword.contains("jeju")) {
            return createJejuProfile();
        }

        if ("osaka".equals(region) || keyword.contains("오사카") || keyword.contains("osaka")) {
            return createOsakaProfile();
        }

        if ("bangkok".equals(region)) {
            return createGenericProfile("bangkok", "방콕", "태국");
        }

        if ("tokyo".equals(region)) {
            return createGenericProfile("tokyo", "도쿄", "일본");
        }

        if ("danang".equals(region)) {
            return createGenericProfile("danang", "다낭", "베트남");
        }

        if ("singapore".equals(region)) {
            return createGenericProfile("singapore", "싱가포르", "싱가포르");
        }

        return createHiroshimaProfile();
    }

    private String normalizeRegion(String region) {
        if (!hasText(region)) {
            return "hiroshima";
        }

        return region.trim().toLowerCase();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private RegionProfile createHiroshimaProfile() {
        return new RegionProfile(
            "hiroshima",
            "히로시마",
            "일본",
            "지도에서 히로시마 호텔 보기",
            List.of(
                option("kitchen", "주방", null, null),
                option("pay-now", "지금 바로 결제", null, null),
                option("downtown", "다운타운", null, null),
                option("internet", "인터넷", null, null),
                option("frontdesk", "24시간 프런트 데스크", null, null),
                option("spa", "스파/사우나", null, null),
                option("other-popular", "기타", null, null)
            ),
            List.of(
                option("hotel", "호텔", 302, null),
                option("resort", "리조트", 4, null),
                option("ryokan", "료칸", 20, null),
                option("apartment", "아파트", 53, null),
                option("guesthouse", "게스트하우스 / 비앤비", 12, null),
                option("hostel", "호스텔", 11, null),
                option("serviced-apartment", "서비스 아파트", 4, null),
                option("inn", "인", 1, null),
                option("resort-villa", "리조트 빌라", 1, null),
                option("private-house-entire", "프라이빗 하우스 전체", 7, null),
                option("capsule", "캡슐 호텔", 4, null),
                option("love-hotel", "러브호텔", 1, null),
                option("villa", "빌라", 2, null)
            ),
            List.of(
                option("hiroshima-center", "히로시마", 306, null),
                option("miyajima", "미야지마", 63, "럭셔리 숙박, 인기 명소"),
                option("hatsukaichi", "하쓰카이치", 12, null),
                option("naka-ward", "나카 워드", 8, null),
                option("others", "기타", 6, null),
                option("etajima", "에타지마", 6, null),
                option("downtown-location", "다운타운", 5, null),
                option("nishi-ward", "니시구", 3, null),
                option("otake", "오타케", 3, null),
                option("yokogawa", "요코가와", 3, null),
                option("kaita", "가이타", 2, null),
                option("hiroshima-station-area", "히로시마역", 1, null)
            ),
            List.of(
                option("free-cancel", "예약 무료 취소", 5, null),
                option("pay-at-hotel", "숙소에서 요금 결제", 34, null),
                option("prepaid", "지금 바로 결제", 157, null)
            ),
            List.of(
                option("rating-9", "9+ 최고", 72, null),
                option("rating-8", "8+ 우수", 228, null),
                option("rating-7", "7+ 좋음", 290, null)
            ),
            List.of(
                option("pool", "수영장", 5, null),
                option("parking", "주차장", 99, null),
                option("fitness", "피트니스", 6, null),
                option("restaurant", "레스토랑", 63, null),
                option("airport-transfer", "공항 이동 교통편 서비스", 1, null),
                option("family-friendly", "가족/아동 여행객 친화형 시설", 117, null),
                option("non-smoking", "금연", 133, null),
                option("smoking-area", "흡연 구역", 94, null),
                option("pet-friendly", "반려동물 동반 가능", 19, null),
                option("accessible", "장애인용 편의 시설/서비스", 42, null),
                option("business", "비즈니스 관련 편의 시설", 29, null)
            ),
            List.of(
                hotel("hiroshima-premium", "히로시마 프리미엄 호텔", "★★★★★", "히로시마 시내 중심 · 원폭 돔 인근", "hiroshima-center", "hotel", "9.2", "Excellent", "₩250,000", "₩189,000", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", "특가 상품", List.of("internet", "spa", "pay-now", "restaurant"), List.of("무료 Wi-Fi", "스파 & 마사지", "피트니스 센터")),
                hotel("miyajima-grand", "미야지마 그랜드 리조트", "★★★★", "미야지마 해변가 · 선착장 도보 10분", "miyajima", "resort", "8.8", "Great", "₩320,000", "₩265,000", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", "인기 숙소", List.of("pay-at-hotel", "restaurant", "pool"), List.of("조식 포함", "오션뷰", "공항 셔틀")),
                hotel("hiroshima-station", "히로시마 스테이션 비즈니스 호텔", "★★★", "히로시마역 도보 5분", "hiroshima-center", "hotel", "8.4", "Very Good", "₩170,000", "₩132,000", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", "조식 특가", List.of("frontdesk", "free-cancel", "internet"), List.of("역세권", "셀프 체크인", "무료 취소")),
                hotel("setouchi-spa", "세토우치 스파 스테이", "★★★★★", "세토우치 오션뷰", "miyajima", "resort", "9.5", "Exceptional", "₩410,000", "₩338,000", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", "럭셔리 추천", List.of("spa", "pool", "pay-now"), List.of("인피니티 풀", "사우나", "레이트 체크아웃")),
                hotel("rihga-royal", "리가 로얄 호텔 히로시마", "★★★★★", "히로시마 평화공원 도보 3분", "hiroshima-center", "hotel", "9.1", "Excellent", "₩210,000", "₩150,000", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", "베스트셀러", List.of("restaurant", "downtown", "non-smoking"), List.of("대욕장", "조식 맛집")),
                hotel("ana-crowne-plaza", "ANA 크라운 플라자 히로시마", "★★★★", "나카 워드 중심가", "naka-ward", "hotel", "8.5", "Excellent", "₩180,000", "₩120,000", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", "특가", List.of("fitness", "business", "downtown"), List.of("피트니스", "비즈니스")),
                hotel("candeo-hiroshima", "칸데오 호텔 히로시마", "★★★★", "핫초보리 역 인근", "hiroshima-center", "hotel", "8.9", "Excellent", "₩250,000", "₩175,000", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", "스파 포함", List.of("spa", "downtown", "non-smoking"), List.of("루프탑 스파", "사우나")),
                hotel("the-knot", "The Knot Hiroshima", "★★★★", "평화대로 위치", "hiroshima-center", "hotel", "9.3", "Exceptional", "₩190,000", "₩140,000", "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80", "디자인 호텔", List.of("downtown", "restaurant", "non-smoking"), List.of("루프탑 바", "모던 인테리어")),
                hotel("washington-hotel", "워싱턴 호텔", "★★★", "히로시마 역세권", "hiroshima-station-area", "hotel", "8.2", "Very Good", "₩130,000", "₩95,000", "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=600&q=80", "가성비 갑", List.of("frontdesk", "internet"), List.of("깔끔함", "교통 편리")),
                hotel("sheraton-grand", "쉐라톤 그랜드 히로시마", "★★★★★", "히로시마역 직결", "hiroshima-station-area", "hotel", "9.6", "Exceptional", "₩350,000", "₩280,000", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", "럭셔리", List.of("pool", "fitness", "restaurant"), List.of("수영장", "클럽 라운지"))
            )
        );
    }

    private RegionProfile createJejuProfile() {
        return new RegionProfile(
            "jeju",
            "제주",
            "대한민국",
            "지도에서 제주 호텔 보기",
            List.of(
                option("ocean-view", "오션뷰", null, null),
                option("pool-villa", "풀빌라", null, null),
                option("breakfast", "조식 포함", null, null),
                option("rental-friendly", "렌터카 이동 편리", null, null)
            ),
            List.of(
                option("hotel", "호텔", 188, null),
                option("resort", "리조트", 41, null),
                option("poolvilla", "풀빌라", 32, null),
                option("private-house", "독채 숙소", 27, null)
            ),
            List.of(
                option("jeju-city", "제주시", 109, null),
                option("seogwipo", "서귀포시", 96, "바다 전망, 리조트 밀집"),
                option("jungmun", "중문", 44, null),
                option("aewol", "애월", 36, null)
            ),
            List.of(
                option("free-cancel", "예약 무료 취소", 81, null),
                option("pay-at-hotel", "숙소에서 요금 결제", 42, null),
                option("prepaid", "지금 바로 결제", 133, null)
            ),
            List.of(
                option("rating-9", "9+ 최고", 66, null),
                option("rating-8", "8+ 우수", 142, null),
                option("rating-7", "7+ 좋음", 181, null)
            ),
            List.of(
                option("pool", "수영장", 58, null),
                option("spa", "스파", 17, null),
                option("parking", "무료 주차", 144, null),
                option("ocean", "오션뷰 객실", 73, null)
            ),
            List.of(
                hotel("jeju-grand-hyatt", "그랜드 하얏트 제주", "★★★★★", "제주시 노형동 · 공항 15분", "jeju-city", "hotel", "9.1", "Excellent", "₩420,000", "₩349,000", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", "JEJU PICK", List.of("parking", "pool", "breakfast"), List.of("도심형 럭셔리", "실내 수영장", "라운지")),
                hotel("jeju-shinhwa", "제주신화월드 메리어트", "★★★★★", "서귀포 안덕면 · 가족 여행 인기", "seogwipo", "resort", "8.9", "Great", "₩360,000", "₩289,000", "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80", "패밀리 특가", List.of("pool", "breakfast", "rental-friendly"), List.of("워터파크", "키즈 친화", "조식 포함")),
                hotel("jeju-aewol-stay", "애월 오션 스테이", "★★★★", "애월 해안도로 · 카페 거리 인근", "aewol", "hotel", "8.7", "Excellent", "₩210,000", "₩168,000", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", "오션뷰", List.of("ocean-view", "parking", "rental-friendly"), List.of("노을 뷰", "무료 주차", "커플 추천")),
                hotel("jeju-jungmun-resort", "중문 씨뷰 리조트", "★★★★", "중문 관광단지 · 해변 도보권", "jungmun", "resort", "9.0", "Excellent", "₩280,000", "₩228,000", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", "리조트 추천", List.of("pool", "spa", "ocean-view"), List.of("야외 수영장", "스파", "레이트 체크아웃"))
            )
        );
    }

    private RegionProfile createOsakaProfile() {
        return new RegionProfile(
            "osaka",
            "오사카",
            "일본",
            "지도에서 오사카 호텔 보기",
            List.of(
                option("namba", "난바 도보권", null, null),
                option("shopping", "쇼핑 중심지", null, null),
                option("station", "역세권", null, null),
                option("family", "유니버설 접근성", null, null)
            ),
            List.of(
                option("hotel", "호텔", 544, null),
                option("resort", "리조트", 11, null),
                option("capsule", "캡슐 호텔", 26, null),
                option("apartment", "서비스 아파트", 88, null)
            ),
            List.of(
                option("namba", "난바", 142, null),
                option("umeda", "우메다", 101, "비즈니스, 백화점 중심"),
                option("shinsaibashi", "신사이바시", 88, null),
                option("universal", "유니버설 시티", 24, null)
            ),
            List.of(
                option("free-cancel", "예약 무료 취소", 133, null),
                option("pay-at-hotel", "숙소에서 요금 결제", 67, null),
                option("prepaid", "지금 바로 결제", 302, null)
            ),
            List.of(
                option("rating-9", "9+ 최고", 98, null),
                option("rating-8", "8+ 우수", 314, null),
                option("rating-7", "7+ 좋음", 463, null)
            ),
            List.of(
                option("station", "역 도보 5분", 241, null),
                option("breakfast", "조식 포함", 154, null),
                option("family", "패밀리룸", 96, null),
                option("onsen", "온천/대욕장", 44, null)
            ),
            List.of(
                hotel("osaka-ritz", "리츠칼튼 오사카", "★★★★★", "우메다 · 오사카역 차량 5분", "umeda", "hotel", "9.4", "Exceptional", "₩520,000", "₩438,000", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", "럭셔리 추천", List.of("shopping", "breakfast", "onsen"), List.of("클래식 인테리어", "라운지", "미슐랭 다이닝")),
                hotel("osaka-cross", "크로스 호텔 오사카", "★★★★", "도톤보리 · 난바역 도보 3분", "namba", "hotel", "8.9", "Great", "₩260,000", "₩214,000", "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80", "쇼핑 특화", List.of("namba", "shopping", "station"), List.of("도톤보리 인접", "커플 추천", "역세권")),
                hotel("osaka-liber", "리베르 호텔 오사카", "★★★★", "유니버설 시티 · 가족 여행", "universal", "resort", "9.0", "Excellent", "₩310,000", "₩258,000", "https://images.unsplash.com/photo-1590490360182-c87295ec4232?w=600&q=80", "패밀리 인기", List.of("family", "breakfast", "onsen"), List.of("대욕장", "USJ 접근성", "조식 포함")),
                hotel("osaka-capsule-premium", "난바 프리미엄 캡슐 스테이", "★★★", "난카이 난바역 도보 4분", "namba", "capsule", "8.5", "Very Good", "₩92,000", "₩68,000", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", "가성비", List.of("namba", "station"), List.of("1인 여행", "깔끔함", "역세권"))
            )
        );
    }

    private RegionProfile createGenericProfile(String region, String label, String countryLabel) {
        return new RegionProfile(
            region,
            label,
            countryLabel,
            "지도에서 " + label + " 호텔 보기",
            List.of(
                option(region + "-central", label + " 중심가", null, null),
                option(region + "-shopping", "쇼핑 중심지", null, null),
                option(region + "-resort", "리조트 특가", null, null),
                option(region + "-breakfast", "조식 포함", null, null)
            ),
            List.of(
                option("hotel", "호텔", 214, null),
                option("resort", "리조트", 18, null),
                option("apartment", "서비스 아파트", 37, null),
                option("villa", "빌라", 9, null)
            ),
            List.of(
                option(region + "-center", label + " 센트럴", 81, null),
                option(region + "-beach", label + " 베이", 28, "인기 관광 구역"),
                option(region + "-station", label + " 역세권", 44, null),
                option(region + "-old-town", label + " 올드타운", 17, null)
            ),
            List.of(
                option(region + "-free-cancel", "예약 무료 취소", 59, null),
                option(region + "-pay-at-hotel", "숙소에서 요금 결제", 33, null),
                option(region + "-prepaid", "지금 바로 결제", 118, null)
            ),
            List.of(
                option("rating-9", "9+ 최고", 39, null),
                option("rating-8", "8+ 우수", 102, null),
                option("rating-7", "7+ 좋음", 164, null)
            ),
            List.of(
                option(region + "-pool", "수영장", 22, null),
                option(region + "-spa", "스파", 11, null),
                option(region + "-parking", "무료 주차", 57, null),
                option(region + "-breakfast-amenity", "조식 포함", 76, null)
            ),
            List.of(
                hotel(region + "-central", label + " 센트럴 호텔", "★★★★★", label + " 중심가 · 대표 관광지 인접", region + "-center", "hotel", "9.1", "Excellent", "₩330,000", "₩269,000", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", "추천 호텔", List.of(region + "-central", region + "-shopping", region + "-breakfast"), List.of("무료 Wi-Fi", "라운지", "조식 포함")),
                hotel(region + "-grand", label + " 그랜드 리조트", "★★★★", label + " 베이 프런트 · 전망 특화", region + "-beach", "resort", "8.8", "Great", "₩290,000", "₩228,000", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", "리조트 특가", List.of(region + "-resort", region + "-pool", region + "-spa"), List.of("오션뷰", "수영장", "스파")),
                hotel(region + "-station", label + " 스테이션 스테이", "★★★", label + " 역 도보 5분", region + "-station", "hotel", "8.4", "Very Good", "₩180,000", "₩139,000", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", "역세권", List.of(region + "-station", region + "-free-cancel"), List.of("역세권", "셀프 체크인", "무료 취소")),
                hotel(region + "-suite", label + " 프리미엄 스위트", "★★★★★", label + " 메인 스트립 · 야경 명소", region + "-old-town", "villa", "9.3", "Exceptional", "₩410,000", "₩338,000", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", "럭셔리", List.of(region + "-villa", region + "-shopping"), List.of("스위트룸", "레이트 체크아웃", "피트니스"))
            )
        );
    }

    private StayHotelListFilterOptionView option(String id, String label, Integer count, String description) {
        return new StayHotelListFilterOptionView(id, label, count, description, false);
    }

    private StayHotelListItemView hotel(
        String id,
        String title,
        String stars,
        String location,
        String locationId,
        String propertyTypeId,
        String reviewScore,
        String reviewLabel,
        String originalPrice,
        String currentPrice,
        String imageUrl,
        String badge,
        List<String> filterIds,
        List<String> tags
    ) {
        return new StayHotelListItemView(
            id,
            title,
            stars,
            location,
            locationId,
            propertyTypeId,
            reviewScore,
            reviewLabel,
            originalPrice,
            currentPrice,
            imageUrl,
            badge,
            filterIds,
            tags
        );
    }

    private record RegionProfile(
        String region,
        String label,
        String countryLabel,
        String mapButtonLabel,
        List<StayHotelListFilterOptionView> popularFilters,
        List<StayHotelListFilterOptionView> propertyTypes,
        List<StayHotelListFilterOptionView> locations,
        List<StayHotelListFilterOptionView> paymentOptions,
        List<StayHotelListFilterOptionView> guestRatings,
        List<StayHotelListFilterOptionView> amenities,
        List<StayHotelListItemView> hotels
    ) {
    }
}
