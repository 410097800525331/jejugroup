import { deepFreeze } from '../utils/object_util.js';

/**
 * Frontend route registry (Single Source of Truth)
 * Keep this file static-only: no runtime logic.
 */
export const ROUTES = deepFreeze({
  // =========================================================================
  // [ 1. CORE & ADMIN ] 메인, 인증, 마이페이지, 통합 관리자 라우팅
  // =========================================================================
  HOME: '/index.html',

  AUTH: {
    LOGIN: '/pages/auth/login.html',
    SIGNUP: '/pages/auth/signup.html',
    OAUTH_CALLBACK: '/pages/auth/oauth_callback.html'
  },

  CS: {
    CUSTOMER_CENTER: '/pages/cs/customer_center.html',
    FAQ: '/pages/cs/faq.html',
    INQUIRY: '/pages/cs/inquiry.html'
  },

  MYPAGE: {
    DASHBOARD: '/pages/mypage/dashboard.html',
    PROFILE: '/pages/mypage/profile.html',
    BOOKINGS: '/pages/mypage/bookings.html'
  },

  ADMIN: {
    DASHBOARD: '/admin/pages/dashboard.html',
    RESERVATIONS: '/admin/pages/reservations.html',
    LODGING: '/admin/pages/lodging.html',
    MEMBERS: '/admin/pages/members.html',
    CMS: '/admin/pages/cms.html'
  },

  // =========================================================================
  // [ 2. SERVICES ] 도메인별 서비스 라우팅 (Single Source of Truth)
  // =========================================================================
  SERVICES: {
    RENT_CAR: 'https://jejurentcar.netlify.app/',

    // ---------------------------------------------------------------------
    // [ JEJU STAY ] 제주호텔 (메인, 라이프, 트래블, 혜택)
    // ---------------------------------------------------------------------
    STAY: {
      MAIN: '/jejustay/pages/hotel/jejuhotel.html',
      HOTEL_LIST: '/jejustay/pages/hotel/hotel-list.html',
      LIFE: '/jejustay/pages/stay/jejustay_life.html',
      PRIVATE: '/jejustay/pages/stay/private_stay.html'
    },

    TRAVEL: {
      ACTIVITIES: '/jejustay/pages/travel/activities.html',
      ESIM: '/jejustay/pages/travel/esim.html',
      GUIDE: '/jejustay/pages/travel/travel_guide.html',
      TIPS: '/jejustay/pages/travel/travel_tips.html',
      CHECKLIST: '/jejustay/pages/travel/travel_checklist.html'
    },

    DEALS: {
      MAIN: '/jejustay/pages/deals/deals.html',
      MEMBER: '/jejustay/pages/deals/deals_member.html',
      PARTNER: '/jejustay/pages/deals/deals_partner.html'
    },

    // ---------------------------------------------------------------------
    // [ JEJU AIR ] 제주에어 (메인, 노선, 예매 등) - 향후 컴포넌트화 시 하위 추가
    // ---------------------------------------------------------------------
    AIR: {
      MAIN: '/jejuair/index.html',
      
      ABOUT: {
        COMPANY: '/jejuair/pages/about/about.html',
        CAREER: '/jejuair/pages/about/career.html',
        CCM: '/jejuair/pages/about/ccm.html'
      },
      
      BOOKING: {
        AVAILABILITY: '/jejuair/pages/booking/Availability.html',
        ROUTE: '/jejuair/pages/booking/route.html',
        PAYMENT: '/jejuair/pages/booking/payment.html',
        GUEST_RESERVATION: '/jejuair/pages/booking/viewOnOffReservationList.html'
      },
      
      BOARDING: {
        FAST_PROCEDURE: '/jejuair/pages/boarding/fastProcedure.html',
        MOBILE_CHECKIN: '/jejuair/pages/boarding/viewCheckin.html',
        E_DOCUMENT: '/jejuair/pages/boarding/eDocument.html'
      },
      
      BAGGAGE: {
        PREORDERED: '/jejuair/pages/baggage/preorderedBaggage.html',
        CABIN: '/jejuair/pages/baggage/cabinBaggage.html',
        LIMITATION: '/jejuair/pages/baggage/transportLimitation.html',
        LIABILITY: '/jejuair/pages/baggage/liability.html'
      },
      
      PET: {
        PASS: '/jejuair/pages/pet/petPass.html',
        SERVICE: '/jejuair/pages/pet/petService.html'
      },
      
      JMEMBERS: {
        SIGHTSEEING: '/jejuair/pages/jmembers/jmembersSightseeing.html',
        AIRPLANE: '/jejuair/pages/jmembers/jmembersAirplane.html',
        GOLF: '/jejuair/pages/jmembers/jmembersGolf.html',
        INSURANCE: '/jejuair/pages/jmembers/jmembersInsurance.html'
      },
      
      CS: {
        CUSTOMER_SERVICE: '/jejuair/pages/cs/customerService.html',
        NOTICE: '/jejuair/pages/cs/notic.html'
      },
      
      AUTH: {
        LOGIN: '/jejuair/pages/auth/login.html',
        JOIN: '/jejuair/pages/auth/join.html',
        SIGNUP: '/jejuair/pages/auth/join.html',
        MYPAGE: '/jejuair/pages/auth/my_page.html'
      },
      
      EVENT: '/jejuair/pages/event/event.html'
    }
  }
});
