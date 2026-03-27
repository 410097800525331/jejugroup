import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";

import { useAuth } from "@/contexts/AuthContext";
import InquiryForm from "@/components/serviceCenter/InquiryForm";
import InquiryList from "@/components/serviceCenter/InquiryList";
import InquirySupportAttachments from "@/components/serviceCenter/InquirySupportAttachments";
import InquirySupportComments from "@/components/serviceCenter/InquirySupportComments";
import SearchBar from "@/components/serviceCenter/SearchBar";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { getServiceLabel } from "@/data/serviceCenterData";
import { getTicketDetail, listMyTickets } from "@/lib/serviceCenterApi";
import type { InquiryRecord, ServiceType, TicketApi } from "@/types/service-center";
import "@/styles/bbs.css";

const PAGE_SIZE = 4;

const toServiceType = (value: unknown): ServiceType => {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized.includes("stay") || normalized.includes("hotel")) return "jeju-stay";
  if (normalized.includes("rental") || normalized.includes("car")) return "jeju-rental";
  if (normalized.includes("air") || normalized.includes("flight")) return "jeju-air";
  if (normalized.includes("common")) return "common";

  return "common";
};

const COMPLETED_STATUS_KEYWORDS = ["answered", "resolved", "closed", "completed", "done", "complete", "close"];

const toStatus = (value: unknown): "pending" | "completed" => {
  const normalized = String(value ?? "").toLowerCase();
  return COMPLETED_STATUS_KEYWORDS.some((keyword) => normalized.includes(keyword)) ? "completed" : "pending";
};

const toDateLabel = (value: unknown) => {
  if (!value) {
    return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
      .format(new Date())
      .replace(/\.\s/g, ".")
      .replace(/\.$/, "");
  }

  const parsedDate = new Date(String(value));
  if (Number.isNaN(parsedDate.getTime())) {
    const text = String(value);
    return text.includes("-") ? text.replaceAll("-", ".") : text;
  }

  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(parsedDate)
    .replace(/\.\s/g, ".")
    .replace(/\.$/, "");
};

const ticketToInquiryRecord = (ticket: TicketApi): InquiryRecord => {
  const id = ticket.ticketId ?? ticket.id;
  const normalizedId = Number(id);

  return {
    id: Number.isFinite(normalizedId) ? normalizedId : Date.now(),
    title: String(ticket.title ?? "문의"),
    date: toDateLabel(ticket.createdAt ?? ticket.updatedAt),
    status: toStatus(ticket.status),
    service: toServiceType(ticket.serviceType ?? ticket.service),
    inquiryType: String(ticket.inquiryType ?? ""),
    content: String(ticket.content ?? ""),
    name: "",
    email: "",
    phone: "",
  };
};

const getTicketMessageText = (ticket: TicketApi) => {
  const messages = ticket.messages ?? [];

  for (const message of messages) {
    const body = String(message.body ?? message.content ?? "").trim();
    if (body) {
      return body;
    }
  }

  return "";
};

export default function Inquiries() {
  const { isAuthenticated } = useAuth();
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"list" | "write">("list");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketApi | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const detailRequestSeq = useRef(0);

  const clearTicketDetail = useCallback(() => {
    detailRequestSeq.current += 1;
    setSelectedTicketId(null);
    setSelectedTicket(null);
    setDetailLoading(false);
    setDetailError(null);
  }, []);

  const handleChatbotClick = () => {
    alert("문의 상담 연결은 아직 준비 중이야. 조금만 기다려줘.");
  };

  const refreshInquiries = useCallback(async () => {
    if (!isAuthenticated) {
      setInquiries([]);
      setLoadError(null);
      setIsLoading(false);
      clearTicketDetail();
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await listMyTickets();

      if (!response.ok) {
        throw response.error;
      }

      setInquiries(response.data.map(ticketToInquiryRecord));
    } catch (error) {
      setInquiries([]);
      setLoadError(error instanceof Error ? error.message : "문의 내역을 불러오지 못했어. 잠시 뒤 다시 시도해줘.");
    } finally {
      setIsLoading(false);
    }
  }, [clearTicketDetail, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setInquiries([]);
      setLoadError(null);
      setIsLoading(false);
      setCurrentPage(1);
      clearTicketDetail();
      return;
    }

    void refreshInquiries();
  }, [clearTicketDetail, isAuthenticated, refreshInquiries]);

  const filteredInquiries = useMemo(() => {
    if (!searchQuery) return inquiries;

    const normalizedQuery = searchQuery.toLowerCase();
    return inquiries.filter(
      (inquiry) =>
        inquiry.title.toLowerCase().includes(normalizedQuery) ||
        inquiry.content.toLowerCase().includes(normalizedQuery) ||
        inquiry.service.toLowerCase().includes(normalizedQuery) ||
        inquiry.status.toLowerCase().includes(normalizedQuery),
    );
  }, [inquiries, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE));
  const pagedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredInquiries.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredInquiries]);

  const selectedInquiry = useMemo(
    () => inquiries.find((inquiry) => inquiry.id === selectedTicketId) ?? null,
    [inquiries, selectedTicketId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, view]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleInquirySelect = useCallback(async (inquiry: InquiryRecord) => {
    const requestId = ++detailRequestSeq.current;
    setSelectedTicketId(inquiry.id);
    setSelectedTicket(null);
    setDetailError(null);
    setDetailLoading(true);

    try {
      const response = await getTicketDetail(inquiry.id);

      if (requestId !== detailRequestSeq.current) return;
      if (!response.ok) throw response.error;
      if (!response.data) throw new Error("상세 정보를 찾지 못했어.");

      setSelectedTicket(response.data);
    } catch (error) {
      if (requestId !== detailRequestSeq.current) return;

      setSelectedTicket(null);
      setDetailError(error instanceof Error ? error.message : "상세 정보를 불러오지 못했어.");
    } finally {
      if (requestId === detailRequestSeq.current) {
        setDetailLoading(false);
      }
    }
  }, []);

  const handleInquirySubmitted = async () => {
    clearTicketDetail();
    await refreshInquiries();
    setSearchQuery("");
    setCurrentPage(1);
    setView("list");
  };

  const detailTicket = selectedTicket;
  const detailStatus = selectedTicket ? toStatus(selectedTicket.status) : selectedInquiry?.status;
  const detailService = selectedTicket ? toServiceType(selectedTicket.serviceType ?? selectedTicket.service) : selectedInquiry?.service;
  const detailTitle = selectedTicket?.title ?? selectedInquiry?.title ?? "";
  const detailContent = selectedTicket?.content ?? selectedInquiry?.content ?? "";
  const detailReply = selectedTicket ? selectedTicket.reply ?? getTicketMessageText(selectedTicket) : null;
  const detailInquiryType = selectedTicket?.inquiryType ?? selectedInquiry?.inquiryType ?? "";
  const detailTicketOwnerId = typeof selectedTicket?.userId === "string" ? selectedTicket.userId : null;
  const detailTicketId = detailTicket ? Number(detailTicket.ticketId ?? detailTicket.id) : null;
  const hasDetailTicketId = detailTicketId !== null && Number.isFinite(detailTicketId);

  return (
    <div className="min-h-screen bg-white">
      <SearchBar query={searchQuery} setQuery={setSearchQuery} onChatbotClick={handleChatbotClick} />

      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center gap-4 text-gray-400 font-bold">
            <Link href="/">
              <a className="flex items-center gap-1.5 transition-colors hover:text-orange-500">
                <ChevronLeft size={18} />
                <span>메인 고객센터</span>
              </a>
            </Link>
            {view === "write" ? (
              <div className="flex items-center gap-4">
                <span className="select-none text-gray-200">/</span>
                <button
                  onClick={() => setView("list")}
                  className="flex items-center p-0 transition-colors hover:text-orange-500"
                  style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
                  type="button"
                >
                  목록으로 돌아가기
                </button>
              </div>
            ) : null}
          </div>

          {view === "list" ? (
            <>
              <InquiryList
                authenticated={isAuthenticated}
                currentPage={currentPage}
                errorMessage={loadError}
                inquiries={pagedInquiries}
                isLoading={isLoading}
                onPageChange={setCurrentPage}
                onWriteClick={() => setView("write")}
                onInquirySelect={handleInquirySelect}
                selectedInquiryId={selectedTicketId}
                totalPages={totalPages}
              />

              {selectedTicketId !== null ? (
                <section className="mt-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
                  <div className="flex flex-col gap-4 border-b border-orange-50 pb-5 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-orange-500">문의 상세</p>
                      <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{detailTitle || "선택한 문의"}</h2>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-600">
                          {getServiceLabel(detailService ?? "common")}
                        </span>
                        {detailInquiryType ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{detailInquiryType}</span>
                        ) : null}
                        <span
                          className={`rounded-full px-3 py-1 ${
                            detailStatus === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {detailStatus === "completed" ? "처리 완료" : "처리 대기"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearTicketDetail}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600"
                    >
                      닫기
                    </button>
                  </div>

                  {detailLoading ? (
                    <div className="py-10 text-sm font-medium text-slate-500">상세 정보를 불러오는 중이야.</div>
                  ) : detailError ? (
                    <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                      {detailError}
                    </div>
                  ) : detailTicket ? (
                    <div className="space-y-6">
                      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.75fr)]">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                          <div className="text-sm font-bold text-slate-500">문의 내용</div>
                          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {detailContent || "문의 내용이 없어."}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-100 bg-white p-5">
                            <div className="text-sm font-bold text-slate-500">기본 정보</div>
                            <dl className="mt-4 space-y-3 text-sm">
                              <div className="flex items-center justify-between gap-4">
                                <dt className="text-slate-500">접수 번호</dt>
                                <dd className="font-bold text-slate-900">{detailTicket.ticketId ?? detailTicket.id}</dd>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <dt className="text-slate-500">작성자</dt>
                                <dd className="font-bold text-slate-900">{detailTicket.requesterName ?? "정보 없음"}</dd>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <dt className="text-slate-500">작성일</dt>
                                <dd className="font-bold text-slate-900">{toDateLabel(detailTicket.createdAt ?? detailTicket.updatedAt)}</dd>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <dt className="text-slate-500">서비스</dt>
                                <dd className="font-bold text-slate-900">{getServiceLabel(detailService ?? "common")}</dd>
                              </div>
                            </dl>
                          </div>

                          <div className="rounded-2xl border border-slate-100 bg-white p-5">
                            <div className="text-sm font-bold text-slate-500">답변</div>
                            <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                              {detailReply || "아직 등록된 답변이 없어."}
                            </div>
                          </div>
                        </div>
                      </div>

                      {hasDetailTicketId ? (
                        <div className="grid gap-6 xl:grid-cols-2">
                          <InquirySupportComments ticketId={detailTicketId} ticketOwnerId={detailTicketOwnerId} ticketTitle={detailTitle} />
                          <InquirySupportAttachments
                            ticketId={detailTicketId}
                            ticketOwnerId={detailTicketOwnerId}
                            ticketTitle={detailTitle}
                            ticketStatus={detailStatus}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="py-10 text-sm font-medium text-slate-500">상세 정보를 찾지 못했어.</div>
                  )}
                </section>
              ) : null}
            </>
          ) : (
            <div className="bbs-container">
              <InquiryForm onSubmitted={handleInquirySubmitted} />
            </div>
          )}
        </div>
      </main>

      <ServiceCenterFooter />
    </div>
  );
}
