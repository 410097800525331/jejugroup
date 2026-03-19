import { LucideIcon } from "lucide-react";

export type ServiceType = "jeju-air" | "jeju-stay" | "jeju-rental";
export type InquiryStatus = "pending" | "completed";

export interface Notice {
  id: number;
  service: ServiceType;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
  color: string;
  icon: LucideIcon;
}

export interface FAQ {
  id: number;
  service: ServiceType;
  category: string;
  question: string;
  answer: string;
  color?: string;
  icon?: LucideIcon;
}

export interface Contact {
  name: string;
  phone: string;
  hours: string;
  color: string;
  icon: LucideIcon;
}

export interface InquirySubmission {
  service: ServiceType;
  title: string;
  content: string;
}

export interface InquiryRecord {
  id: number;
  service: ServiceType;
  title: string;
  content: string;
  date: string;
  status: InquiryStatus;
}
