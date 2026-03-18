import { deepFreeze } from "../utils/object_util.module.js";

const pageRoute = (path, options = {}) =>
  Object.freeze({
    kind: "page",
    path,
    ...options,
  });

const hashPageRoute = (path, hash, options = {}) =>
  Object.freeze({
    kind: "hash-page",
    path,
    hash,
    ...options,
  });

const externalRoute = (url, options = {}) =>
  Object.freeze({
    kind: "external",
    url,
    ...options,
  });

const serializeRouteMetadata = (routeMeta) => {
  if (!routeMeta || typeof routeMeta !== "object") {
    return routeMeta;
  }

  if ("kind" in routeMeta) {
    if (routeMeta.kind === "external") {
      return routeMeta.url;
    }

    const queryString = routeMeta.defaultQuery
      ? `?${new URLSearchParams(routeMeta.defaultQuery).toString()}`
      : "";
    const hash = routeMeta.hash ?? "";

    return `${routeMeta.path}${queryString}${hash}`;
  }

  return Object.fromEntries(
    Object.entries(routeMeta).map(([key, value]) => [key, serializeRouteMetadata(value)]),
  );
};

export const ROUTE_METADATA = deepFreeze({
  HOME: pageRoute("/index.html"),

  AUTH: {
    LOGIN: pageRoute("/pages/auth/login.html", { shellStrategy: "auth-shell" }),
    SIGNUP: pageRoute("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
    PASS_AUTH: pageRoute("/pages/auth/pass_auth.html"),
    OAUTH_CALLBACK: pageRoute("/pages/auth/oauth_callback.html"),
  },

  CS: {
    CUSTOMER_CENTER: pageRoute("/pages/cs/customer_center.html"),
    FAQ: hashPageRoute("/pages/cs/customer_center.html", "#/faqs"),
    INQUIRY: pageRoute("/pages/cs/customer_center.html"),
  },

  MYPAGE: {
    DASHBOARD: pageRoute("/pages/mypage/dashboard.html"),
    PROFILE: pageRoute("/pages/mypage/dashboard.html"),
    BOOKINGS: pageRoute("/pages/mypage/dashboard.html"),
  },

  ADMIN: {
    DASHBOARD: pageRoute("/admin/pages/dashboard.html"),
    RESERVATIONS: pageRoute("/admin/pages/reservations.html"),
    LODGING: pageRoute("/admin/pages/lodging.html"),
    MEMBERS: pageRoute("/admin/pages/members.html"),
    CMS: pageRoute("/admin/pages/cms.html"),
  },

  SERVICES: {
    RENT_CAR: externalRoute("https://jejurentcar.netlify.app/"),

    STAY: {
      MAIN: pageRoute("/jejustay/pages/hotel/jejuhotel.html"),
      HOTEL_LIST: pageRoute("/jejustay/pages/hotel/hotel-list.html"),
      LIFE: pageRoute("/jejustay/pages/stay/jejustay_life.html"),
      PRIVATE: pageRoute("/jejustay/pages/stay/private_stay.html"),
    },

    TRAVEL: {
      ACTIVITIES: pageRoute("/jejustay/pages/travel/activities.html"),
      ESIM: pageRoute("/jejustay/pages/travel/esim.html"),
      GUIDE: pageRoute("/jejustay/pages/travel/travel_guide.html"),
      TIPS: pageRoute("/jejustay/pages/travel/travel_tips.html"),
      CHECKLIST: pageRoute("/jejustay/pages/travel/travel_checklist.html"),
    },

    DEALS: {
      MAIN: pageRoute("/jejustay/pages/deals/deals.html"),
      MEMBER: pageRoute("/jejustay/pages/deals/deals_member.html"),
      PARTNER: pageRoute("/jejustay/pages/deals/deals_partner.html"),
    },

    AIR: {
      MAIN: pageRoute("/jejuair/index.html"),

      ABOUT: {
        COMPANY: pageRoute("/jejuair/pages/about/about.html"),
        CAREER: pageRoute("/jejuair/pages/about/career.html"),
        CCM: pageRoute("/jejuair/pages/about/ccm.html"),
      },

      BOOKING: {
        AVAILABILITY: pageRoute("/jejuair/pages/booking/Availability.html"),
        ROUTE: pageRoute("/jejuair/pages/booking/route.html"),
        PAYMENT: pageRoute("/jejuair/pages/booking/payment.html"),
        GUEST_RESERVATION: pageRoute("/jejuair/pages/booking/viewOnOffReservationList.html"),
      },

      BOARDING: {
        FAST_PROCEDURE: pageRoute("/jejuair/pages/boarding/fastProcedure.html"),
        MOBILE_CHECKIN: pageRoute("/jejuair/pages/boarding/viewCheckin.html"),
        E_DOCUMENT: pageRoute("/jejuair/pages/boarding/eDocument.html"),
      },

      BAGGAGE: {
        PREORDERED: pageRoute("/jejuair/pages/baggage/preorderedBaggage.html"),
        CABIN: pageRoute("/jejuair/pages/baggage/cabinBaggage.html"),
        LIMITATION: pageRoute("/jejuair/pages/baggage/transportLimitation.html"),
        LIABILITY: pageRoute("/jejuair/pages/baggage/liability.html"),
      },

      PET: {
        PASS: pageRoute("/jejuair/pages/pet/petPass.html"),
        SERVICE: pageRoute("/jejuair/pages/pet/petService.html"),
      },

      JMEMBERS: {
        SIGHTSEEING: pageRoute("/jejuair/pages/jmembers/jmembersSightseeing.html"),
        AIRPLANE: pageRoute("/jejuair/pages/jmembers/jmembersAirplane.html"),
        GOLF: pageRoute("/jejuair/pages/jmembers/jmembersGolf.html"),
        INSURANCE: pageRoute("/jejuair/pages/jmembers/jmembersInsurance.html"),
      },

      CS: {
        CUSTOMER_SERVICE: pageRoute("/jejuair/pages/cs/customerService.html"),
        NOTICE: pageRoute("/jejuair/pages/cs/notic.html"),
      },

      AUTH: {
        LOGIN: pageRoute("/pages/auth/login.html", { shellStrategy: "auth-shell" }),
        JOIN: pageRoute("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
        PASS_AUTH: pageRoute("/pages/auth/pass_auth.html"),
        SIGNUP: pageRoute("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
        MYPAGE: pageRoute("/pages/mypage/dashboard.html", { defaultQuery: { shell: "air" } }),
      },

      EVENT: pageRoute("/jejuair/pages/event/event.html"),
    },
  },
});

export const ROUTES = deepFreeze(serializeRouteMetadata(ROUTE_METADATA));
