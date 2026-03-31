import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";

import { useAuth } from "@/contexts/AuthContext";
import InquiryForm from "@/components/serviceCenter/InquiryForm";
import InquiryList from "@/components/serviceCenter/InquiryList";
import InquirySupportComments from "@/components/serviceCenter/InquirySupportComments";
import SearchBar from "@/components/serviceCenter/SearchBar";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { getLoginUrl } from "@/const";
import { getServiceLabel } from "@/data/serviceCenterData";
import { deleteTicket, getTicketDetail, listMyTickets, updateTicket } from "@/lib/serviceCenterApi";
import type { InquiryRecord, ServiceType, TicketApi, TicketUpdateRequest } from "@/types/service-center";
import "@/styles/bbs.css";

const PAGE_SIZE = 4;

type DetailAction = "edit" | "delete" | null;

type EditDraft = {
  title: string;
  content: string;
  password: string;
};

type DeleteDraft = {
  password: string;
};

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

const isAdminUser = (user: { id?: string; role?: string; roles?: string[]; isLocalAdmin?: boolean } | null) => {
  const roles = user?.roles ?? [];
  return Boolean(user?.isLocalAdmin || user?.role?.toUpperCase() === "ADMIN" || roles.some((role) => role.toUpperCase() === "ADMIN"));
};

export default function Inquiries() {
  const { isAuthenticated, user } = useAuth();
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
  const [detailAction, setDetailAction] = useState<DetailAction>(null);
  const [detailActionError, setDetailActionError] = useState<string | null>(null);
  const [detailActionBusy, setDetailActionBusy] = useState(false);
  const [editDraft, setEditDraft] = useState<EditDraft>({ title: "", content: "", password: "" });
  const [deleteDraft, setDeleteDraft] = useState<DeleteDraft>({ password: "" });
  const detailRequestSeq = useRef(0);

  const canManageSelectedTicket = useMemo(() => {
    if (!selectedTicket || !user?.id) {
      return false;
    }

    return selectedTicket.userId === user.id || isAdminUser(user);
  }, [selectedTicket, user]);

  const actionRequiresPassword = !isAdminUser(user);

  const clearTicketDetail = useCallback(() => {
    detailRequestSeq.current += 1;
    setSelectedTicketId(null);
    setSelectedTicket(null);
    setDetailLoading(false);
    setDetailError(null);
    setDetailAction(null);
    setDetailActionError(null);
    setDetailActionBusy(false);
    setEditDraft({ title: "", content: "", password: "" });
    setDeleteDraft({ password: "" });
  }, []);

  const closeDetailAction = useCallback(() => {
    setDetailAction(null);
    setDetailActionError(null);
    setDetailActionBusy(false);
    setEditDraft({ title: selectedTicket?.title ?? "", content: selectedTicket?.content ?? "", password: "" });
    setDeleteDraft({ password: "" });
  }, [selectedTicket]);

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
      setLoadError(error instanceof Error ? error.message : "문의 내역을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
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

  useEffect(() => {
    if (!selectedTicket) {
      return;
    }

    setEditDraft({
      title: selectedTicket.title ?? "",
      content: selectedTicket.content ?? "",
      password: "",
    });
    setDeleteDraft({ password: "" });
    setDetailActionError(null);
  }, [selectedTicket]);

  const handleChatbotClick = () => {
    alert("문의 상담 연결은 아직 준비 중입니다. 잠시만 기다려 주세요.");
  };

  const handleInquirySelect = useCallback(async (inquiry: InquiryRecord) => {
    const requestId = ++detailRequestSeq.current;
    setSelectedTicketId(inquiry.id);
    setSelectedTicket(null);
    setDetailError(null);
    setDetailLoading(true);
    setDetailAction(null);
    setDetailActionError(null);

    try {
      const response = await getTicketDetail(inquiry.id);

      if (requestId !== detailRequestSeq.current) return;
      if (!response.ok) throw response.error;
      if (!response.data) throw new Error("상세 정보를 찾지 못했습니다.");

      setSelectedTicket(response.data);
    } catch (error) {
      if (requestId !== detailRequestSeq.current) return;

      setSelectedTicket(null);
      setDetailError(error instanceof Error ? error.message : "상세 정보를 불러오지 못했습니다.");
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

  const handleWriteClick = () => {
    if (!isAuthenticated) {
      window.location.assign(getLoginUrl());
      return;
    }

    setView("write");
  };

  const openEditModal = () => {
    if (!selectedTicket) return;
    setDetailAction("edit");
    setDetailActionError(null);
    setEditDraft({
      title: selectedTicket.title ?? "",
      content: selectedTicket.content ?? "",
      password: actionRequiresPassword ? "" : "",
    });
    setDeleteDraft({ password: "" });
  };

  const openDeleteModal = () => {
    if (!selectedTicket) return;
    setDetailAction("delete");
    setDetailActionError(null);
    setDeleteDraft({ password: actionRequiresPassword ? "" : "" });
    setEditDraft({
      title: selectedTicket.title ?? "",
      content: selectedTicket.content ?? "",
      password: "",
    });
  };

  const submitEdit = async () => {
    if (!selectedTicket || selectedTicketId === null) {
      return;
    }

    const password = actionRequiresPassword ? editDraft.password.trim() : "";
    const title = editDraft.title.trim();
    const content = editDraft.content.trim();

    if (actionRequiresPassword && !password) {
      setDetailActionError("비밀번호를 입력해 주세요.");
      return;
    }
    if (!title || !content) {
      setDetailActionError("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    setDetailActionBusy(true);
    setDetailActionError(null);

    try {
      const serviceType = toServiceType(selectedTicket.serviceType ?? selectedTicket.service) as TicketUpdateRequest["serviceType"];
      const status = (selectedTicket.status ?? "pending") as TicketUpdateRequest["status"];
      const priority = (selectedTicket.priority ?? "normal") as TicketUpdateRequest["priority"];

      const response = await updateTicket(selectedTicketId, {
        serviceType,
        inquiryType: selectedTicket.inquiryType ?? selectedTicket.inquiryTypeCode ?? "",
        inquiryTypeCode: selectedTicket.inquiryTypeCode ?? selectedTicket.inquiryType ?? "",
        requesterName: selectedTicket.requesterName ?? "",
        requesterEmail: selectedTicket.requesterEmail ?? "",
        requesterPhone: selectedTicket.requesterPhone ?? "",
        title,
        content,
        status,
        priority,
        name: selectedTicket.requesterName ?? "",
        email: selectedTicket.requesterEmail ?? "",
        phone: selectedTicket.requesterPhone ?? "",
        password,
      });

      if (!response.ok) {
        throw response.error;
      }

      if (response.data) {
        setSelectedTicket(response.data);
      }
      await refreshInquiries();
      closeDetailAction();
      setDetailError(null);
    } catch (error) {
      setDetailActionError(error instanceof Error ? error.message : "문의를 수정하지 못했습니다.");
    } finally {
      setDetailActionBusy(false);
    }
  };

  const submitDelete = async () => {
    if (!selectedTicketId) {
      return;
    }

    const password = actionRequiresPassword ? deleteDraft.password.trim() : "";
    if (actionRequiresPassword && !password) {
      setDetailActionError("비밀번호를 입력해 주세요.");
      return;
    }

    setDetailActionBusy(true);
    setDetailActionError(null);

    try {
      const response = await deleteTicket(selectedTicketId, { password });
      if (!response.ok) {
        throw response.error;
      }

      closeDetailAction();
      clearTicketDetail();
      await refreshInquiries();
    } catch (error) {
      setDetailActionError(error instanceof Error ? error.message : "문의를 삭제하지 못했습니다.");
    } finally {
      setDetailActionBusy(false);
    }
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
          <div className="mb-8 flex items-center gap-4 font-bold text-gray-400">
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
                onWriteClick={handleWriteClick}
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
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-600">{getServiceLabel(detailService ?? "common")}</span>
                        {detailInquiryType ? <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{detailInquiryType}</span> : null}
                        <span
                          className={`rounded-full px-3 py-1 ${
                            detailStatus === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {detailStatus === "completed" ? "처리 완료" : "처리 대기"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canManageSelectedTicket ? (
                        <>
                          <button
                            type="button"
                            onClick={openEditModal}
                            className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-2 text-sm font-bold text-orange-600 transition-colors hover:bg-orange-50"
                          >
                            <Pencil size={16} />
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={openDeleteModal}
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            삭제
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={clearTicketDetail}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600"
                      >
                        닫기
                      </button>
                    </div>
                  </div>

                  {detailLoading ? (
                      <div className="py-10 text-sm font-medium text-slate-500">상세 정보를 불러오는 중입니다.</div>
                  ) : detailError ? (
                    <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{detailError}</div>
                  ) : detailTicket ? (
                    <div className="space-y-6">
                      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.75fr)]">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                          <div className="text-sm font-bold text-slate-500">문의 내용</div>
                          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{detailContent || "문의 내용이 없습니다."}</div>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-white p-5">
                          <div className="text-sm font-bold text-slate-500">답변</div>
                          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {detailReply || "아직 등록된 답변이 없습니다."}
                          </div>
                        </div>
                      </div>

                      {hasDetailTicketId ? (
                        <InquirySupportComments ticketId={detailTicketId} ticketOwnerId={detailTicketOwnerId} ticketTitle={detailTitle} />
                      ) : null}
                    </div>
                  ) : (
                    <div className="py-10 text-sm font-medium text-slate-500">상세 정보를 찾지 못했습니다.</div>
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

      {detailAction ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm" role="presentation" onClick={closeDetailAction}>
          <div
            className="w-full max-w-md rounded-3xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-detail-action-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-500">
                {detailAction === "edit" ? "문의 수정" : "문의 삭제"}
              </p>
              <h3 id="ticket-detail-action-title" className="mt-2 text-2xl font-extrabold text-slate-900">
                {detailAction === "edit" ? "내용을 수정해 주세요" : "삭제를 확인해 주세요"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                게시글을 작성한 사용자의 비밀번호를 입력해야 진행할 수 있습니다.
              </p>
            </div>

            <div className="space-y-4 px-6 py-5">
              {detailActionError ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{detailActionError}</div> : null}

              {detailAction === "edit" ? (
                <>
                  <label className="block text-sm font-bold text-slate-700">
                    제목
                    <input
                      value={editDraft.title}
                      onChange={(event) => setEditDraft((current) => ({ ...current, title: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    />
                  </label>
                  <label className="block text-sm font-bold text-slate-700">
                    내용
                    <textarea
                      value={editDraft.content}
                      onChange={(event) => setEditDraft((current) => ({ ...current, content: event.target.value }))}
                      className="mt-2 min-h-[180px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    />
                  </label>
                  {actionRequiresPassword ? (
                    <label className="block text-sm font-bold text-slate-700">
                      비밀번호
                      <input
                        type="password"
                        value={editDraft.password}
                        onChange={(event) => setEditDraft((current) => ({ ...current, password: event.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                        placeholder="작성자 비밀번호"
                      />
                    </label>
                  ) : null}
                </>
              ) : (
                actionRequiresPassword ? (
                  <label className="block text-sm font-bold text-slate-700">
                    비밀번호
                    <input
                      type="password"
                      value={deleteDraft.password}
                      onChange={(event) => setDeleteDraft({ password: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      placeholder="작성자 비밀번호"
                    />
                  </label>
                ) : null
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-5">
              <button
                type="button"
                onClick={closeDetailAction}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-slate-300"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={detailAction === "edit" ? submitEdit : submitDelete}
                disabled={detailActionBusy}
                className="flex-1 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {detailActionBusy ? "처리 중입니다" : detailAction === "edit" ? "수정" : "삭제"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ServiceCenterFooter />
    </div>
  );
}
