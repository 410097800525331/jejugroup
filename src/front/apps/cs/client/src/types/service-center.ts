import { LucideIcon } from "lucide-react";

export type ServiceType = "jeju-air" | "jeju-stay" | "jeju-rental" | "common";
export type NoticeType = "notice" | "event";
export type InquiryStatus = "pending" | "completed";
export type SupportTicketStatus = InquiryStatus;
export type SupportTicketPriority = "low" | "normal" | "high";
export type ApiRequestState = "idle" | "loading" | "success" | "error";

export interface ServiceCenterApiErrorShape {
  message?: string;
  status: number;
  code?: string;
  details?: unknown;
  url?: string;
}

export class ServiceCenterApiError extends Error implements ServiceCenterApiErrorShape {
  status: number;
  code?: string;
  details?: unknown;
  url?: string;

  constructor(message: string, init: ServiceCenterApiErrorShape) {
    super(message);
    this.name = "ServiceCenterApiError";
    this.status = init.status;
    this.code = init.code;
    this.details = init.details;
    this.url = init.url;
  }
}

export type ApiResult<T> =
  | {
      ok: true;
      status: number;
      data: T;
      error: null;
    }
  | {
      ok: false;
      status: number;
      data: null;
      error: ServiceCenterApiError;
    };

export interface ApiState<T> {
  status: ApiRequestState;
  data: T | null;
  error: ServiceCenterApiError | null;
}

export interface SessionUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  roles?: string[];
  authSource?: string;
  isLocalAdmin?: boolean;
  [key: string]: unknown;
}

export interface SessionApiResponse {
  success?: boolean;
  authenticated?: boolean;
  user?: SessionUser | null;
  session?: SessionUser | null;
  data?: {
    user?: SessionUser | null;
    session?: SessionUser | null;
  } | null;
  message?: string;
  error?: string;
  code?: string;
}

export interface Notice {
  id: number;
  service: ServiceType;
  noticeType?: NoticeType;
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

export interface NoticeFormDraft {
  serviceType: ServiceType;
  noticeType: NoticeType;
  title: string;
  excerpt: string;
  content: string;
  publishedAt?: string | null;
  pinned?: boolean;
  active?: boolean;
}

export interface FaqFormDraft {
  serviceType: ServiceType;
  category: string;
  question: string;
  answer: string;
  sortOrder?: number;
  active?: boolean;
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
  inquiryType: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  content: string;
  agreement: boolean;
}

export interface InquiryRecord extends Omit<InquirySubmission, "agreement"> {
  id: number;
  ticketId?: number | string;
  date: string;
  status: InquiryStatus;
  reply?: string | null;
  repliedAt?: string | null;
}

export interface NoticeApi {
  id: number | string;
  serviceType?: ServiceType | string;
  service?: ServiceType | string;
  noticeType?: NoticeType | string;
  title?: string;
  content?: string;
  excerpt?: string;
  summary?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  isActive?: boolean;
  pinned?: boolean;
  isPinned?: boolean;
  category?: string;
  [key: string]: unknown;
}

export interface NoticeListApiResponse {
  success?: boolean;
  data?: NoticeApi[] | { items?: NoticeApi[]; total?: number; page?: number; size?: number } | null;
  items?: NoticeApi[];
  notices?: NoticeApi[];
  total?: number;
  page?: number;
  size?: number;
  message?: string;
  error?: string;
  code?: string;
  [key: string]: unknown;
}

export interface NoticeDetailApiResponse {
  success?: boolean;
  data?: NoticeApi | null;
  notice?: NoticeApi | null;
  item?: NoticeApi | null;
  message?: string;
  error?: string;
  code?: string;
  [key: string]: unknown;
}

export interface FaqApi {
  id: number | string;
  serviceType?: ServiceType | string;
  service?: ServiceType | string;
  category?: string;
  question?: string;
  answer?: string;
  order?: number;
  sortOrder?: number;
  active?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface FaqListApiResponse {
  success?: boolean;
  data?: FaqApi[] | { items?: FaqApi[]; total?: number; page?: number; size?: number } | null;
  items?: FaqApi[];
  faqs?: FaqApi[];
  total?: number;
  page?: number;
  size?: number;
  message?: string;
  error?: string;
  code?: string;
  [key: string]: unknown;
}

export interface TicketCommentDraft {
  content: string;
  isInternal?: boolean;
}

export interface TicketAttachmentDraft {
  originalFilename: string;
  storedFilename: string;
  storageKey: string;
  contentType?: string | null;
  fileSizeBytes?: number;
}

export interface TicketMessageApi {
  id?: number | string;
  author?: string;
  authorName?: string;
  body?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  authorUserId?: string;
  authorRole?: string;
  internal?: boolean;
  [key: string]: unknown;
}

export interface TicketCommentApi {
  id: number | string;
  ticketId: number | string;
  authorUserId?: string;
  authorRole?: string;
  authorName?: string;
  content?: string;
  internal?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface TicketAttachmentApi {
  id: number | string;
  ticketId: number | string;
  uploadedByUserId?: string;
  originalFilename?: string;
  storedFilename?: string;
  storageKey?: string;
  contentType?: string | null;
  fileSizeBytes?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface TicketApi {
  id: number | string;
  ticketId?: number | string;
  userId?: string;
  serviceType?: ServiceType | string;
  service?: ServiceType | string;
  inquiryType?: string;
  inquiryTypeCode?: string;
  requesterName?: string;
  requesterEmail?: string;
  requesterPhone?: string;
  title?: string;
  content?: string;
  status?: SupportTicketStatus | string;
  priority?: SupportTicketPriority | string;
  reply?: string | null;
  repliedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  messages?: TicketMessageApi[];
  comments?: TicketCommentApi[];
  attachments?: TicketAttachmentApi[];
  [key: string]: unknown;
}

export interface TicketListApiResponse {
  success?: boolean;
  data?: TicketApi[] | { items?: TicketApi[]; total?: number; page?: number; size?: number } | null;
  items?: TicketApi[];
  tickets?: TicketApi[];
  total?: number;
  page?: number;
  size?: number;
  message?: string;
  error?: string;
  code?: string;
  [key: string]: unknown;
}

export interface TicketDetailApiResponse {
  success?: boolean;
  data?: TicketApi | null;
  ticket?: TicketApi | null;
  item?: TicketApi | null;
  message?: string;
  error?: string;
  code?: string;
  [key: string]: unknown;
}

export interface TicketCreateRequest {
  serviceType: ServiceType;
  inquiryType: string;
  title: string;
  content: string;
  name?: string;
  email?: string;
  phone?: string;
  inquiryTypeCode?: string;
  requesterName?: string;
  requesterEmail?: string;
  requesterPhone?: string;
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  agreement?: boolean;
}

export interface TicketUpdateRequest extends TicketCreateRequest {
  password: string;
}

export interface TicketDeleteRequest {
  password: string;
}

export interface TicketCreateResponse {
  success?: boolean;
  data?: TicketApi | null;
  ticket?: TicketApi | null;
  item?: TicketApi | null;
  message?: string;
  error?: string;
  code?: string;
  [key: string]: unknown;
}

export interface DeletedRecord {
  id: number | string;
  entity: string;
}

export interface TicketCommentDeleteResult {
  deleted: boolean;
  commentId: number | string;
}

export interface TicketAttachmentDeleteResult {
  deleted: boolean;
  attachmentId: number | string;
}
