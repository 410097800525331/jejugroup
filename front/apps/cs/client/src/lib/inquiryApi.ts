import type { InquiryRecord, InquiryStatus, InquirySubmission, ServiceType } from "@/types/service-center";

interface InquiryApiPayload {
  id: number;
  title: string;
  content: string;
  service: ServiceType;
  status: InquiryStatus;
  date: string;
}

interface InquiryListResponse {
  success: boolean;
  message?: string;
  inquiries?: InquiryApiPayload[];
}

interface InquiryWriteResponse {
  success: boolean;
  message?: string;
  inquiry?: InquiryApiPayload;
}

interface InquiryDeleteResponse {
  success: boolean;
  message?: string;
}

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (configuredBaseUrl) {
    return trimTrailingSlash(configuredBaseUrl);
  }

  if (typeof window === "undefined") {
    return "";
  }

  const { origin, hostname, pathname, port } = window.location;
  if ((hostname === "localhost" || hostname === "127.0.0.1") && port === "3000") {
    return "";
  }

  const [firstSegment] = pathname.split("/").filter(Boolean);
  if (firstSegment === "jeju-web") {
    return `${origin}/jeju-web`;
  }

  return origin;
};

const buildApiUrl = (path: string) => {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
};

const toInquiryRecord = (inquiry: InquiryApiPayload): InquiryRecord => ({
  id: Number(inquiry.id),
  title: inquiry.title,
  content: inquiry.content,
  service: inquiry.service,
  status: inquiry.status,
  date: inquiry.date,
});

const getErrorMessage = (message?: string, fallback = "문의 처리 중 오류가 발생했습니다.") =>
  message && message.trim() ? message : fallback;

const parseJson = async <T>(response: Response): Promise<T> => {
  const raw = await response.text();
  if (!raw) {
    return {} as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("서버 응답을 해석하지 못했습니다.");
  }
};

export async function fetchInquiries(signal?: AbortSignal): Promise<InquiryRecord[]> {
  const response = await fetch(buildApiUrl("/inquiry/list"), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
    signal,
  });

  const data = await parseJson<InquiryListResponse>(response);
  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data.message, "문의 목록을 불러오지 못했습니다."));
  }

  return (data.inquiries ?? []).map(toInquiryRecord);
}

export async function createInquiry(submission: InquirySubmission): Promise<InquiryRecord> {
  const response = await fetch(buildApiUrl("/inquiry/write"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title: submission.title,
      content: submission.content,
      service: submission.service,
    }),
  });

  const data = await parseJson<InquiryWriteResponse>(response);
  if (!response.ok || !data.success || !data.inquiry) {
    throw new Error(getErrorMessage(data.message, "문의 등록에 실패했습니다."));
  }

  return toInquiryRecord(data.inquiry);
}

export async function updateInquiry(inquiry: InquiryRecord): Promise<InquiryRecord> {
  const response = await fetch(buildApiUrl("/inquiry/update"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      id: inquiry.id,
      title: inquiry.title,
      content: inquiry.content,
      service: inquiry.service,
    }),
  });

  const data = await parseJson<InquiryWriteResponse>(response);
  if (!response.ok || !data.success || !data.inquiry) {
    throw new Error(getErrorMessage(data.message, "문의 수정에 실패했습니다."));
  }

  return toInquiryRecord(data.inquiry);
}

export async function deleteInquiry(id: number): Promise<void> {
  const response = await fetch(buildApiUrl("/inquiry/delete"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id }),
  });

  const data = await parseJson<InquiryDeleteResponse>(response);
  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data.message, "문의 삭제에 실패했습니다."));
  }
}
