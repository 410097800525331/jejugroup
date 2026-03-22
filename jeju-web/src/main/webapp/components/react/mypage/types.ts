export type BookingType = "air" | "rent" | "stay";

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
  name: string;
  passport?: PassportInfo;
  phone: string;
}


