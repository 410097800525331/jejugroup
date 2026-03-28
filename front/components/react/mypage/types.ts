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
  ownerId?: string;
  ownerName?: string;
  status?: TravelEventStatus;
  type?: BookingType;
}

export interface ItineraryCompanion {
  avatarUrl?: string;
  bio?: string;
  id: string;
  isMember: boolean;
  name: string;
}

export type CompanionSearchMode = "suggestions" | "results";

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

export interface DashboardItineraryActivityInput {
  checked?: boolean;
  id?: string;
  label?: string;
}

export interface DashboardItineraryCompanionInput {
  avatarUrl?: string;
  bio?: string;
  id?: string;
  isMember?: boolean;
  name?: string;
}

export type TravelEventStatus = "reserved" | "used" | "cancelled" | "missed";

export interface TravelEvent {
  activityLabel: string;
  date: string;
  dayId: string;
  googleMapUrl: string;
  id: string;
  ownerId: string;
  ownerName: string;
  status: TravelEventStatus;
  time: string;
  title: string;
  type: BookingType;
}

export interface DashboardItineraryInput {
  activities?: DashboardItineraryActivityInput[] | null;
  companions?: DashboardItineraryCompanionInput[] | null;
  date?: string;
  googleMapUrl?: string;
  id?: string;
  time?: string;
  title?: string;
}

export interface DashboardSupportInput {
  count?: number | string | null;
  href?: string;
  id?: string;
  label?: string;
}

export interface DashboardTravelEventInput {
  activityLabel?: string;
  date?: string;
  dayId?: string;
  googleMapUrl?: string;
  id?: string;
  ownerId?: string;
  ownerName?: string;
  status?: TravelEventStatus;
  time?: string;
  title?: string;
  type?: BookingType;
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
  avatarUrl?: string;
  bio?: string;
  name: string;
  nickname?: string;
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
  bio?: string;
  email?: string;
  id?: string;
  inquiries?: DashboardSupportInput[] | null;
  itinerary?: DashboardItineraryInput[] | null;
  linkedCompanions?: DashboardItineraryCompanionInput[] | null;
  member?: unknown;
  memberships?: Array<string | null | undefined>;
  name?: string;
  nickname?: string;
  passport?: DashboardPassportInput | null;
  phone?: string;
  profile?: unknown;
  role?: string;
  session?: unknown;
  stats?: StatItem[] | DashboardStatSummary | null;
  support?: DashboardSupportInput[] | null;
  supportItems?: DashboardSupportInput[] | null;
  tier?: string;
  travelEvents?: DashboardTravelEventInput[] | null;
  intro?: string;
  user?: unknown;
}

export interface DashboardSnapshot {
  bookings: BookingItem[];
  itinerary: ItineraryItem[];
  linkedCompanions: ItineraryCompanion[];
  profile: UserProfile;
  stats: StatItem[];
  supportItems: SupportItem[];
  travelEvents: TravelEvent[];
}
