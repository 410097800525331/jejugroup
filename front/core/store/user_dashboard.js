/**
 * user_dashboard.js
 * 제주그룹 통합 마이페이지 전역 스토어 (Single Source of Truth)
 * 프론트엔드 모듈화 규격(Zero Monolith)에 따라 데이터 계층 완벽 분리
 */

const DUMMY_USER_SESSION = {
  user: {
    name: "홍길동",
    tier: "GOLD",
    tierColor: "#FFC107",
    miles: 12500,
    email: "hong@jejugroup.example.com",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=hong"
  },
  journeys: [
    {
      id: "JRN-20251101",
      date: "2025. 11. 01 (토) - 11. 05 (수)",
      title: "제주도 가족 로드트립",
      status: "UPCOMING",
      air: {
        provider: "Jeju Air",
        flight: "7C111",
        departure: "GMP 08:30",
        arrival: "CJU 09:40",
        status: "CONFIRMED"
      },
      car: {
        provider: "Jeju Rentcar",
        model: "제네시스 GV80",
        pickup: "2025. 11. 01 10:30",
        return: "2025. 11. 05 14:00",
        status: "CONFIRMED"
      },
      stay: {
        provider: "Jeju Hotel",
        name: "제주호텔 프리미어 오션스위트",
        checkIn: "2025. 11. 01 15:00",
        checkOut: "2025. 11. 05 11:00",
        status: "CONFIRMED"
      }
    },
    {
      id: "JRN-20250815",
      date: "2025. 08. 15 (금) - 08. 17 (일)",
      title: "제주도 힐링 골프 여행",
      status: "COMPLETED",
      air: {
        provider: "Jeju Air",
        flight: "7C125",
        departure: "GMP 14:00",
        arrival: "CJU 15:15",
        status: "COMPLETED"
      },
      car: null,
      stay: {
        provider: "Private Stay",
        name: "프라이빗 스테이 애월",
        checkIn: "2025. 08. 15 15:00",
        checkOut: "2025. 08. 17 11:00",
        status: "COMPLETED"
      }
    }
  ]
};

class DashboardStore {
  constructor() {
    this.data = null;
    this.isLoading = false;
    this.error = null;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.data, this.isLoading, this.error));
  }

  async fetchDashboardData() {
    this.isLoading = true;
    this.error = null;
    this.notify();

    try {
      // Simulate network request (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // DB 연동 시 이 부분을 실제 fetch API로 교체
      this.data = JSON.parse(JSON.stringify(DUMMY_USER_SESSION));
    } catch (err) {
      console.error("[Dashboard Store] Fetch failed", err);
      this.error = "여정 정보를 불러오는데 실패했습니다.";
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  getUser() {
    return this.data?.user || null;
  }

  getJourneys() {
    return this.data?.journeys || [];
  }
}

// 싱글톤 스토어 인스턴스로 관리 (전역 상태 공유)
export const globalDashboardStore = new DashboardStore();
