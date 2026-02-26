import { deepFreeze } from '../utils/object_util.js';

/**
 * Frontend route registry (Single Source of Truth)
 * Keep this file static-only: no runtime logic.
 */
export const ROUTES = deepFreeze({
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

  SERVICES: {
    AIR: 'https://jejuair.netlify.app/',
    RENT_CAR: 'https://jejurentcar.netlify.app/',

    STAY: {
      MAIN: '/jejustay/pages/hotel/jejuhotel.html',
      HOTEL_LIST: '/jejustay/pages/hotel/hotel-list.html',
      LIFE: '/jejustay/pages/stay/jejustay_life.html',
      PRIVATE: '/jejustay/pages/stay/private_stay.html',
      RESERVATION_CHECK: '/jejustay/pages/stay/reservation_check.html'
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
    }
  },

  ADMIN: {
    DASHBOARD: '/admin/pages/dashboard.html',
    RESERVATIONS: '/admin/pages/reservations.html',
    LODGING: '/admin/pages/lodging.html',
    MEMBERS: '/admin/pages/members.html',
    CMS: '/admin/pages/cms.html'
  }
});
