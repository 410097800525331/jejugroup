const CITY_DATA = {
    tokyo: {
        description: "현대와 전통이 공존하는 아시아 대표 도시. 맛집, 쇼핑, 교통 효율이 좋아서 첫 자유여행지로도 안정적이다.",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
        lists: [
            {
                items: ["110V 사용", "멀티 어댑터 준비", "호텔 대여 가능 여부 확인"],
                title: "전압 및 소켓",
            },
            {
                items: ["엔화 사용", "현금과 카드 병행", "트래블 카드 수수료 확인"],
                title: "환율 및 결제",
            },
            {
                items: ["여름은 덥고 습함", "겨울은 건조", "봄/가을 여행 만족도 높음"],
                title: "날씨 및 옷차림",
            },
            {
                items: ["에스컬레이터 한 줄 서기", "식당 흡연 여부 확인", "관광지는 영어 표기 많음"],
                title: "언어 및 매너",
            },
        ],
        title: "Tokyo, Japan",
    },
    paris: {
        description: "박물관, 미식, 산책이 강한 도시라 하루 동선을 촘촘히 짜기보다 구역 단위로 나누는 편이 낫다.",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
        lists: [
            { items: ["230V 사용", "C/E 타입 플러그", "멀티 어댑터 필수"], title: "전압 및 소켓" },
            { items: ["유로 사용", "카드 결제 비중 높음", "팁 문화는 과하지 않음"], title: "환율 및 결제" },
            { items: ["봄/가을 추천", "겨울은 흐림 대비", "걷기 좋은 신발 필수"], title: "날씨 및 옷차림" },
            { items: ["식당 예약 선호", "대중교통 파업 체크", "소매치기 주의"], title: "언어 및 매너" },
        ],
        title: "Paris, France",
    },
    newyork: {
        description: "교통과 음식 선택지가 많지만 이동 피로도도 큰 도시라, 하루 목표를 적게 잡는 편이 훨씬 효율적이다.",
        image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=400&q=80",
        lists: [
            { items: ["110V 사용", "A/B 타입 플러그", "고속 충전기 호환 확인"], title: "전압 및 소켓" },
            { items: ["달러 사용", "팁 문화 강함", "카드 결제가 기본"], title: "환율 및 결제" },
            { items: ["겨울 체감 온도 낮음", "여름은 고온다습", "실내 냉방 강함"], title: "날씨 및 옷차림" },
            { items: ["지하철 24시간 운행", "치안 편차 큼", "야간 이동 구역 체크"], title: "언어 및 매너" },
        ],
        title: "New York, USA",
    },
    bangkok: {
        description: "더위, 교통 체증, 야간 생활이 강해서 낮과 밤 동선을 분리하면 훨씬 편하다.",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80",
        lists: [
            { items: ["220V 사용", "A/C/O 타입 혼재", "멀티 어댑터 추천"], title: "전압 및 소켓" },
            { items: ["바트 사용", "QR 결제 확대", "현금도 일정량 필요"], title: "환율 및 결제" },
            { items: ["연중 더움", "우기 체크", "얇은 옷 + 실내 대비 겉옷"], title: "날씨 및 옷차림" },
            { items: ["사원 복장 주의", "Grab 활용", "교통 체증 시간 피하기"], title: "언어 및 매너" },
        ],
        title: "Bangkok, Thailand",
    },
    bali: {
        description: "휴양지 감성으로 보이지만 지역별 성격이 크게 달라서 이동 시간 계산을 대충 잡으면 꽤 피곤해진다.",
        image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80",
        lists: [
            { items: ["230V 사용", "C/F 타입 플러그", "습도 대비 전자기기 관리"], title: "전압 및 소켓" },
            { items: ["루피아 사용", "소액 현금 필요", "관광지 카드 가능"], title: "환율 및 결제" },
            { items: ["건기/우기 차이 큼", "강한 햇빛", "모기 대비 필요"], title: "날씨 및 옷차림" },
            { items: ["오토바이 많음", "지역 간 거리 체감 큼", "문화행사 일정 체크"], title: "언어 및 매너" },
        ],
        title: "Bali, Indonesia",
    },
    danang: {
        description: "리조트 휴양과 근교 투어를 섞기 좋은 도시라 가족 여행 기준으로 만족도가 높다.",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80",
        lists: [
            { items: ["220V 사용", "A/C/F 타입", "기본 멀티 어댑터 준비"], title: "전압 및 소켓" },
            { items: ["동 사용", "현금/카드 병행", "환전은 시내가 유리"], title: "환율 및 결제" },
            { items: ["건기 해변 일정 적합", "우기 집중호우 체크", "리조트 실내 냉방 대비"], title: "날씨 및 옷차림" },
            { items: ["Grab 활용도 높음", "호이안 이동 시간 체크", "야시장 가격 흥정 가능"], title: "언어 및 매너" },
        ],
        title: "Da Nang, Vietnam",
    },
};

const tabButtons = Array.from(document.querySelectorAll(".city-tab"));
const cityImage = document.getElementById("tips-city-image");
const cityTitle = document.getElementById("tips-city-title");
const cityDescription = document.getElementById("tips-city-description");
const cardTitleElements = [
    document.getElementById("tip-card-1-title"),
    document.getElementById("tip-card-2-title"),
    document.getElementById("tip-card-3-title"),
    document.getElementById("tip-card-4-title"),
];
const cardListElements = [
    document.getElementById("tip-card-1-list"),
    document.getElementById("tip-card-2-list"),
    document.getElementById("tip-card-3-list"),
    document.getElementById("tip-card-4-list"),
];

if (!cityImage || !cityTitle || !cityDescription || cardTitleElements.some((el) => !el) || cardListElements.some((el) => !el)) {
    throw new Error("[jeju-spring] tips page bootstrap failed");
}

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const key = button.dataset.city;
        if (!key || !CITY_DATA[key]) {
            return;
        }

        tabButtons.forEach((tab) => tab.classList.toggle("active", tab === button));
        renderCity(CITY_DATA[key]);
    });
});

renderCity(CITY_DATA.tokyo);

function renderCity(city) {
    cityImage.src = city.image;
    cityTitle.textContent = city.title;
    cityDescription.textContent = city.description;

    city.lists.forEach((section, index) => {
        cardTitleElements[index].textContent = section.title;
        const targetList = cardListElements[index];
        targetList.innerHTML = "";
        section.items.forEach((item) => {
            const element = document.createElement("li");
            element.textContent = item;
            targetList.appendChild(element);
        });
    });
}
