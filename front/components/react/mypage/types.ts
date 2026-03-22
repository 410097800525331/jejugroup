export type BookingType = "air" | "rent" | "stay" | "voucher";

export interface BookingItem {
  amount: string;
  date: string;
  duration?: string;
  id: string;
  paymentMethod?: string;
  status: string;
  tags: string[];
  title: string;
  type: BookingType;
  voucherUrl?: string;
}

export interface ItineraryActivity {
  checked: boolean;
  id: string;
  label: string;
}

export interface ItineraryCompanion {
  id: string;
  isMember: boolean;
  name: string;
}

export interface ItineraryItem {
  activities: ItineraryActivity[];
  companions: ItineraryCompanion[];
  date: string;
  googleMapUrl: string;
  id: string;
  time: string;
  title: string;
}


export interface StatItem {
  label: string;
  tone: BookingType | "wallet" | "coupon" | "point";
  value: string;
}

export interface SupportItem {
  count: number | null;
  href: string;
  id: string;
  label: string;
}

export interface PassportInfo {
  expiryDate: string;
  issuingCountry: string;
  number: string;
}

export interface UserProfile {
  email: string;
  memberships: string[];
  id?: string;
  name: string;
  passport?: PassportInfo;
  role?: string;
  phone: string;
  tier?: string;
}

export interface DashboardStatSummary {
  coupon?: number | string;
  couponCount?: number | string;
  coupons?: number | string;
  point?: number | string;
  points?: number | string;
  reservationCount?: number | string;
  reservations?: number | string;
  tripCount?: number | string;
  trips?: number | string;
  upcomingTrips?: number | string;
}

export interface DashboardBookingInput {
  amount?: string | number;
  date?: string;
  duration?: string;
  id?: string;
  paymentMethod?: string;
  status?: string;
  tags?: Array<string | null | undefined>;
  title?: string;
  type?: BookingType;
  voucherUrl?: string;
}

export interface DashboardPassportInput {
  expiryDate?: string;
  issuingCountry?: string;
  number?: string;
}

export interface DashboardSessionInput {
  bookings?: DashboardBookingInput[];
  data?: unknown;
  email?: string;
  id?: string;
  member?: unknown;
  memberships?: Array<string | null | undefined>;
  name?: string;
  passport?: DashboardPassportInput | null;
  phone?: string;
  profile?: unknown;
  role?: string;
  session?: unknown;
  stats?: StatItem[] | DashboardStatSummary | null;
  tier?: string;
  user?: unknown;
}

export interface DashboardSnapshot {
  bookings: BookingItem[];
  profile: UserProfile;
  stats: StatItem[];
}

