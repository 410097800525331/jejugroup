import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BadgeInfo,
  Car,
  ChevronLeft,
  Home as HomeIcon,
  PencilLine,
  Plane,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";

import NoticeList from "@/components/serviceCenter/NoticeList";
import SearchBar from "@/components/serviceCenter/SearchBar";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { useAuth } from "@/contexts/AuthContext";
import { listNotices, type NoticeApi } from "@/lib/serviceCenterApi";
import type { Notice, ServiceType } from "@/types/service-center";

type ServiceTheme = {
  label: string;
  color: string;
  icon: LucideIcon;
};

type NoticeApiItem = NoticeApi & {
  active?: boolean | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type NoticeRecord = Notice & {
  active: boolean;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type NoticeDraft = {
  serviceType: ServiceType;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  active: boolean;
};

const SERVICE_THEMES: Record<ServiceType, ServiceTheme> = {
  "jeju-air": {
    label: "제주항공",
    color: "from-orange-400 to-orange-600",
    icon: Plane,
  },
  "jeju-stay": {
    label: "제주스테이",
    color: "from-cyan-400 to-cyan-600",
    icon: HomeIcon,
  },
  "jeju-rental": {
    label: "제주렌터카",
    color: "from-emerald-400 to-emerald-600",
    icon: Car,
  },
  common: {
    label: "공통",
    color: "from-stone-400 to-stone-600",
    icon: BadgeInfo,
  },
};

const SERVICE_FILTERS: Array<ServiceType | "all"> = ["all", "jeju-air", "jeju-stay", "jeju-rental"];

const emptyNoticeDraft = (): NoticeDraft => ({
  serviceType: "common",
  title: "",
  excerpt: "",
  content: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  active: true,
});

function normalizeServiceType(value: string | null | undefined): ServiceType {
  if (value === "jeju-air" || value === "jeju-stay" || value === "jeju-rental" || value === "common") {
    return value;
  }

  return "common";
}

function getServiceLabel(service: ServiceType) {
  return SERVICE_THEMES[service].label;
}

function getServiceTheme(service: ServiceType) {
  return SERVICE_THEMES[service];
}

function formatApiDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const normalizedValue = value.includes(" ") && !value.includes("T") ? value.replace(" ", "T") : value;
  const parsedDate = new Date(normalizedValue);

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
}

function toDateInputValue(value?: string | null) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const normalizedValue = value.includes(" ") && !value.includes("T") ? value.replace(" ", "T") : value;
  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsedDate.toISOString().slice(0, 10);
}

function mapNoticeItem(item: NoticeApiItem): NoticeRecord {
  const service = normalizeServiceType(item.serviceType ?? item.service);
  const theme = getServiceTheme(service);

  return {
    id: Number(item.id),
    service,
    title: String(item.title ?? ""),
    date: formatApiDate(item.publishedAt ?? item.createdAt ?? item.updatedAt),
    excerpt: String(item.excerpt?.trim() || item.content?.trim() || ""),
    content: String(item.content ?? item.excerpt ?? ""),
    color: theme.color,
    icon: theme.icon,
    active: item.active !== false,
    publishedAt: item.publishedAt ?? item.createdAt ?? item.updatedAt ?? null,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

async function requestNoticeMutation(path: string, init: RequestInit) {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload = await response.text().then((raw) => {
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return raw;
    }
  });

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && !Array.isArray(payload) && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : payload && typeof payload === "object" && !Array.isArray(payload) && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "공지사항 저장에 실패했어.";
    throw new Error(message);
  }

  return payload;
}

async function createOrUpdateNotice(id: number | null, draft: NoticeDraft) {
  const path = id === null ? "/api/customer-center/notices" : `/api/customer-center/notices/${encodeURIComponent(String(id))}`;
  const method = id === null ? "POST" : "PUT";

  await requestNoticeMutation(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id ?? undefined,
      serviceType: draft.serviceType,
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      content: draft.content.trim(),
      publishedAt: draft.publishedAt || null,
      active: draft.active,
    }),
  });
}

async function deleteNotice(id: number) {
  await requestNoticeMutation(`/api/customer-center/notices/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  });
}

export default function Notices() {
  const { isAdmin: isAdminSession } = useAuth();

  const [activeService, setActiveService] = useState<ServiceType | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
  const [draft, setDraft] = useState<NoticeDraft>(() => emptyNoticeDraft());
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 5;

  const handleChatbotClick = () => {
    alert("지금은 챗봇 연결이 준비 중이야. 공지 목록에서 먼저 확인해줘.");
  };

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError(null);

    void listNotices()
      .then((result) => {
        if (!active) {
          return;
        }

        if (!result.ok) {
          throw result.error;
        }

        setNotices(result.data.map((item) => mapNoticeItem(item as NoticeApiItem)));
      })
      .catch((fetchError: unknown) => {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : "공지 목록을 불러오지 못했어.");
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [reloadToken]);

  useEffect(() => {
    if (!isAdminSession) {
      setEditorMode("create");
      setEditingNoticeId(null);
      setDraft(emptyNoticeDraft());
      setFormError(null);
    }
  }, [isAdminSession]);

  const visibleNotices = useMemo(
    () => (isAdminSession ? notices : notices.filter((notice) => notice.active !== false)),
    [isAdminSession, notices],
  );

  const filteredNotices = useMemo(() => {
    let result = activeService === "all" ? visibleNotices : visibleNotices.filter((notice) => notice.service === activeService);

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (notice) =>
          notice.title.toLowerCase().includes(normalizedQuery) ||
          notice.excerpt.toLowerCase().includes(normalizedQuery) ||
          (notice.content ?? "").toLowerCase().includes(normalizedQuery),
      );
    }

    return result;
  }, [activeService, searchQuery, visibleNotices]);

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / pageSize));
  const pagedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredNotices.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredNotices]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeService, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!isAdminSession) {
      return;
    }

    if (editorMode === "create") {
      setDraft(emptyNoticeDraft());
      setEditingNoticeId(null);
    }
  }, [editorMode, isAdminSession]);

  const retry = () => {
    setReloadToken((value) => value + 1);
  };

  const beginCreate = () => {
    setEditorMode("create");
    setEditingNoticeId(null);
    setDraft(emptyNoticeDraft());
    setFormError(null);
  };

  const beginEdit = (notice: NoticeRecord) => {
    setEditorMode("edit");
    setEditingNoticeId(notice.id);
    setDraft({
      serviceType: notice.service,
      title: notice.title,
      excerpt: notice.excerpt,
      content: notice.content ?? "",
      publishedAt: toDateInputValue(notice.publishedAt ?? notice.createdAt ?? notice.updatedAt),
      active: notice.active !== false,
    });
    setFormError(null);
  };

  const refreshAfterWrite = async () => {
    setReloadToken((value) => value + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!isAdminSession) {
      setFormError("관리자 세션에서만 공지사항을 수정할 수 있어.");
      return;
    }

    if (!draft.title.trim() || !draft.content.trim()) {
      setFormError("제목과 본문은 비워둘 수 없어.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrUpdateNotice(editorMode === "edit" ? editingNoticeId : null, draft);
      beginCreate();
      await refreshAfterWrite();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "공지사항 저장에 실패했어.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (notice: NoticeRecord) => {
    if (!isAdminSession) {
      return;
    }

    if (!window.confirm(`"${notice.title}" 공지를 삭제할까?`)) {
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await deleteNotice(notice.id);
      if (editingNoticeId === notice.id) {
        beginCreate();
      }
      await refreshAfterWrite();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "공지사항 삭제에 실패했어.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SearchBar query={searchQuery} setQuery={setSearchQuery} onChatbotClick={handleChatbotClick} />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8 text-gray-400 font-bold">
            <Link href="/">
              <a className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                <ChevronLeft size={18} />
                <span>메인 고객센터</span>
              </a>
            </Link>
          </div>

          <div className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {SERVICE_FILTERS.map((service) => (
              <button
                key={service}
                onClick={() => setActiveService(service as ServiceType | "all")}
                className={`flex-shrink-0 px-8 py-3 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-md ${
                  activeService === service
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/20 scale-105"
                    : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100 hover:border-gray-200"
                }`}
                type="button"
              >
                {service === "all" ? "EXPLORE ALL" : getServiceLabel(service).toUpperCase()}
              </button>
            ))}
          </div>

          {isAdminSession ? (
            <section className="mb-10 rounded-[2.5rem] border border-orange-100 bg-orange-50/60 p-6 md:p-8 shadow-[0_18px_50px_rgba(255,96,0,0.08)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-black tracking-[0.2em] text-orange-500 uppercase">CMS 관리</p>
                  <h2 className="text-2xl font-black text-gray-900">
                    {editorMode === "edit" ? "공지 수정" : "공지 등록"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    공지의 서비스 타입, 노출 여부, 기본 필드를 여기서 바로 다룰 수 있어.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={beginCreate}
                  className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-black text-orange-600 transition-colors hover:border-orange-300 hover:bg-orange-50"
                >
                  <Plus size={16} />
                  새 공지
                </button>
              </div>

              {formError ? (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {formError}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">서비스 타입</span>
                    <select
                      value={draft.serviceType}
                      onChange={(event) => setDraft((current) => ({ ...current, serviceType: event.target.value as ServiceType }))}
                      className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    >
                      <option value="common">공통</option>
                      <option value="jeju-air">제주항공</option>
                      <option value="jeju-stay">제주스테이</option>
                      <option value="jeju-rental">제주렌터카</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">게시일</span>
                    <input
                      type="date"
                      value={draft.publishedAt}
                      onChange={(event) => setDraft((current) => ({ ...current, publishedAt: event.target.value }))}
                      className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="text-sm font-bold text-gray-700">제목</span>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                    placeholder="공지 제목"
                    className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>

                <label className="space-y-2 block">
                  <span className="text-sm font-bold text-gray-700">요약</span>
                  <input
                    type="text"
                    value={draft.excerpt}
                    onChange={(event) => setDraft((current) => ({ ...current, excerpt: event.target.value }))}
                    placeholder="목록에서 보여줄 짧은 설명"
                    className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>

                <label className="space-y-2 block">
                  <span className="text-sm font-bold text-gray-700">본문</span>
                  <textarea
                    value={draft.content}
                    onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
                    placeholder="공지 본문"
                    rows={7}
                    className="w-full rounded-3xl border border-orange-100 bg-white px-4 py-3 text-sm leading-7 text-gray-800 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>

                <div className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white/80 px-4 py-4 md:flex-row md:items-center md:justify-between">
                  <label className="inline-flex items-center gap-3 text-sm font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={draft.active}
                      onChange={(event) => setDraft((current) => ({ ...current, active: event.target.checked }))}
                      className="h-4 w-4 rounded border-orange-200 text-orange-500 focus:ring-orange-500"
                    />
                    활성 공지로 노출
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={16} />
                      {isSubmitting ? "저장 중" : editorMode === "edit" ? "수정 저장" : "공지 등록"}
                    </button>

                    {editorMode === "edit" ? (
                      <button
                        type="button"
                        onClick={beginCreate}
                        className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
                      >
                        <RotateCcw size={16} />
                        편집 취소
                      </button>
                    ) : null}
                  </div>
                </div>
              </form>
            </section>
          ) : null}

          <NoticeList
            currentPage={currentPage}
            notices={pagedNotices}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            emptyMessage="검색 조건에 맞는 공지가 없어."
            isAdmin={isAdminSession}
            onEditNotice={beginEdit}
            onDeleteNotice={handleDelete}
            showInactive={isAdminSession}
          />
        </div>
      </main>

      <ServiceCenterFooter />
    </div>
  );
}
