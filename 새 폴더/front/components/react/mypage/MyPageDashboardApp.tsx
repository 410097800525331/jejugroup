import { SummarySection } from "./SummarySection";
import { BookingSection } from "./BookingSection";
import { ItinerarySection } from "./ItinerarySection";
import { AccountBenefitSection } from "./AccountBenefitSection";
import { SupportSection } from "./SupportSection";
import { DashboardProvider } from "./state";

const DashboardContent = () => {
  return (
    <div className="meta-dashboard-layout">
      {/* 1. 상단 요약 (Dashboard) */}
      <SummarySection />

      {/* 2. 예약 현황 (Bookings) */}
      <BookingSection />

      {/* 3. 나의 여행지 (Itinerary) */}
      <ItinerarySection />

      {/* 4. 회원/혜택 (Account & Benefits) */}
      <AccountBenefitSection />

      {/* 5. 고객지원 (Support) */}
      <SupportSection />
    </div>
  );
};

export const MyPageDashboardApp = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

