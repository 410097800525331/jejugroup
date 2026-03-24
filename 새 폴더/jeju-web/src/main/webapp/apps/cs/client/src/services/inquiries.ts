import type { InquiryRecord, InquiryStatus, InquirySubmission, ServiceType } from "@/types/service-center";

interface InquiryApiItem {
  id: number;
  title: string;
  content: string;
  service: string;
  status: string;
  createdAt: string;
}

const getContextPath = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const segments = window.location.pathname.split("/").filter(Boolean);
  return segments.length > 0 ? `/${segments[0]}` : "";
};

const buildApiUrl = (path: string) => `${getContextPath()}${path}`;

const normalizeService = (service: string): ServiceType => {
  if (service === "jeju-air" || service === "jeju-stay" || service === "jeju-rental" || service === "common") {
    return service;
  }

  return "common";
};

const normalizeStatus = (status: string): InquiryStatus => {
  if (status === "completed" || status === "답변완료" || status === "처리완료") {
    return "completed";
  }

  return "pending";
};

const formatDate = (value: string) => {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(parsedDate)
    .replace(/\.\s/g, ".")
    .replace(/\.$/, "");
};

const parseErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    if (payload && typeof payload.message === "string" && payload.message) {
      return payload.message;
    }
  } catch {
    // Ignore JSON parse errors.
  }

  return "문의 처리 중 오류가 발생했습니다.";
};

export const fetchInquiries = async (): Promise<InquiryRecord[]> => {
  const response = await fetch(buildApiUrl("/api/inquiries"), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const items = (await response.json()) as InquiryApiItem[];
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    service: normalizeService(item.service),
    status: normalizeStatus(item.status),
    date: formatDate(item.createdAt),
    inquiryType: "",
    name: "",
    email: "",
    phone: "",
  }));
};

export const createInquiry = async (submission: InquirySubmission): Promise<void> => {
  const body = new URLSearchParams({
    service: submission.service,
    inquiryType: submission.inquiryType,
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    title: submission.title,
    content: submission.content,
  });

  const response = await fetch(buildApiUrl("/api/inquiries"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
};
