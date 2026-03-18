export type BookingType = "air" | "rent" | "stay";

export interface BookingItem {
  amount: string;
  date: string;
  id: string;
  status: string;
  tags: string[];
  title: string;
  type: BookingType;
}

export interface StatItem {
  label: string;
  tone: BookingType | "wallet";
  value: string;
}

export interface SupportItem {
  count: number | null;
  href: string;
  id: string;
  label: string;
}

