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
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from "@/components/serviceCenter/SearchBar";
import SectionHeader from "@/components/serviceCenter/SectionHeader";
import FAQItem from "@/components/serviceCenter/FAQItem";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { useAuth } from "@/contexts/AuthContext";
import { listFaqs, type FaqApi } from "@/lib/serviceCenterApi";
import type { FAQ, ServiceType } from "@/types/service-center";

type ServiceTheme = {
  label: string;
  color: string;
  icon: LucideIcon;
};

type FaqApiItem = FaqApi & {
  active?: boolean | null;
  sortOrder?: number | null;
  order?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type FaqRecord = FAQ & {
  active: boolean;
  sortOrder: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type FaqAdminPayload = Pick<FaqRecord, "id" | "service" | "category" | "question" | "answer" | "active"> & {
  sortOrder?: number;
  color?: string;
  icon?: LucideIcon;
};

type FaqDraft = {
  serviceType: ServiceType;
  category: string;
  question: string;
  answer: string;
  sortOrder: string;
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

const emptyFaqDraft = (): FaqDraft => ({
  serviceType: "common",
  category: "",
  question: "",
  answer: "",
  sortOrder: "0",
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

function mapFaqItem(item: FaqApiItem): FaqRecord {
  const service = normalizeServiceType(item.serviceType ?? item.service);
  const theme = getServiceTheme(service);

  return {
    id: Number(item.id),
    service,
    category: String(item.category ?? ""),
    question: String(item.question ?? ""),
    answer: String(item.answer ?? ""),
    color: theme.color,
    icon: theme.icon,
    active: item.active !== false,
    sortOrder: Number(item.sortOrder ?? item.order ?? 0),
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

async function requestFaqMutation(path: string, init: RequestInit) {
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
          : "FAQ 저장에 실패했어.";
    throw new Error(message);
  }

  return payload;
}

async function createOrUpdateFaq(id: number | null, draft: FaqDraft) {
  const path = id === null ? "/api/customer-center/faqs" : `/api/customer-center/faqs/${encodeURIComponent(String(id))}`;
  const method = id === null ? "POST" : "PUT";

  await requestFaqMutation(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id ?? undefined,
      serviceType: draft.serviceType,
      category: draft.category.trim(),
      question: draft.question.trim(),
      answer: draft.answer.trim(),
      sortOrder: Number(draft.sortOrder) || 0,
      active: draft.active,
    }),
  });
}

async function deleteFaq(id: number) {
  await requestFaqMutation(`/api/customer-center/faqs/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  });
}

export default function FAQs() {
  const { isAdmin: isAdminSession } = useAuth();

  const [activeService, setActiveService] = useState<ServiceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FaqRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [draft, setDraft] = useState<FaqDraft>(() => emptyFaqDraft());
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChatbotClick = () => {
    alert("지금은 챗봇 연결이 준비 중이야. 필요한 FAQ부터 먼저 찾아봐.");
  };

  const handleFaqToggle = (id: string) => {
    setExpandedFaqId((previous) => (previous === id ? null : id));
  };

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError(null);

    void listFaqs()
      .then((result) => {
        if (!active) {
          return;
        }

        if (!result.ok) {
          throw result.error;
        }

        setFaqs(result.data.map((item) => mapFaqItem(item as FaqApiItem)));
      })
      .catch((fetchError: unknown) => {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : "FAQ 목록을 불러오지 못했어.");
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
      setEditingFaqId(null);
      setDraft(emptyFaqDraft());
      setFormError(null);
    }
  }, [isAdminSession]);

  const visibleFaqs = useMemo(
    () => (isAdminSession ? faqs : faqs.filter((faq) => faq.active !== false)),
    [isAdminSession, faqs],
  );

  const filteredFaqs = useMemo(() => {
    let result = activeService === "all" ? visibleFaqs : visibleFaqs.filter((faq) => faq.service === activeService);

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(normalizedQuery) ||
          faq.answer.toLowerCase().includes(normalizedQuery) ||
          faq.category.toLowerCase().includes(normalizedQuery),
      );
    }

    return result;
  }, [activeService, searchQuery, visibleFaqs]);

  const retry = () => {
    setReloadToken((value) => value + 1);
  };

  const beginCreate = () => {
    setEditorMode("create");
    setEditingFaqId(null);
    setDraft(emptyFaqDraft());
    setFormError(null);
  };

  const beginEdit = (faq: FaqAdminPayload) => {
    setEditorMode("edit");
    setEditingFaqId(faq.id);
    setDraft({
      serviceType: faq.service,
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      sortOrder: String(faq.sortOrder ?? 0),
      active: faq.active !== false,
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
      setFormError("관리자 세션에서만 FAQ를 수정할 수 있어.");
      return;
    }

    if (!draft.category.trim() || !draft.question.trim() || !draft.answer.trim()) {
      setFormError("카테고리, 질문, 답변은 비워둘 수 없어.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrUpdateFaq(editorMode === "edit" ? editingFaqId : null, draft);
      beginCreate();
      await refreshAfterWrite();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "FAQ 저장에 실패했어.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (faq: FaqAdminPayload) => {
    if (!isAdminSession) {
      return;
    }

    if (!window.confirm(`"${faq.question}" FAQ를 삭제할까?`)) {
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await deleteFaq(faq.id);
      if (editingFaqId === faq.id) {
        beginCreate();
      }
      await refreshAfterWrite();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "FAQ 삭제에 실패했어.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SearchBar query={searchQuery} setQuery={setSearchQuery} onChatbotClick={handleChatbotClick} />

      <main className="py-24 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-16">
            <Link href="/">
              <a className="inline-flex items-center gap-3 text-orange-600 hover:text-orange-700 font-black text-lg mb-10 group bg-orange-50 px-6 py-3 rounded-2xl transition-all hover:gap-6 shadow-sm">
                <ChevronLeft size={24} />
                메인 고객센터로 돌아가기
              </a>
            </Link>

            <SectionHeader
              title="FAQ Library"
              description="서비스별 자주 묻는 질문을 여기서 바로 확인하고, 관리자라면 바로 수정할 수 있어."
            />
          </motion.div>

          <div className="flex gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
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
                  <h2 className="text-2xl font-black text-gray-900">{editorMode === "edit" ? "FAQ 수정" : "FAQ 등록"}</h2>
                  <p className="text-sm text-gray-500">
                    질문, 답변, 서비스 타입, 정렬값과 노출 여부를 한 번에 다룰 수 있어.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={beginCreate}
                  className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-black text-orange-600 transition-colors hover:border-orange-300 hover:bg-orange-50"
                >
                  <Plus size={16} />
                  새 FAQ
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
                    <span className="text-sm font-bold text-gray-700">정렬값</span>
                    <input
                      type="number"
                      value={draft.sortOrder}
                      onChange={(event) => setDraft((current) => ({ ...current, sortOrder: event.target.value }))}
                      className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="text-sm font-bold text-gray-700">카테고리</span>
                  <input
                    type="text"
                    value={draft.category}
                    onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                    placeholder="예: 예약 / 결제 / 변경"
                    className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>

                <label className="space-y-2 block">
                  <span className="text-sm font-bold text-gray-700">질문</span>
                  <input
                    type="text"
                    value={draft.question}
                    onChange={(event) => setDraft((current) => ({ ...current, question: event.target.value }))}
                    placeholder="FAQ 질문"
                    className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>

                <label className="space-y-2 block">
                  <span className="text-sm font-bold text-gray-700">답변</span>
                  <textarea
                    value={draft.answer}
                    onChange={(event) => setDraft((current) => ({ ...current, answer: event.target.value }))}
                    placeholder="FAQ 답변"
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
                    활성 FAQ로 노출
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={16} />
                      {isSubmitting ? "저장 중" : editorMode === "edit" ? "수정 저장" : "FAQ 등록"}
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

          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-[2.5rem] border border-gray-200/60 bg-white p-8 animate-pulse">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-gray-100" />
                      <div className="flex-1 space-y-4">
                        <div className="flex gap-2">
                          <div className="h-6 w-24 rounded-full bg-gray-100" />
                          <div className="h-6 w-20 rounded-full bg-gray-100" />
                        </div>
                        <div className="h-7 w-4/5 rounded-full bg-gray-100" />
                      </div>
                      <div className="h-12 w-12 rounded-full bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-24 text-center rounded-[3rem] border-2 border-dashed border-gray-200 bg-gray-50">
                <p className="text-gray-500 font-black text-xl">FAQ를 불러오지 못했어.</p>
                <p className="mt-3 text-gray-400">{error}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-8 inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20"
                >
                  다시 불러오기
                </button>
              </div>
            ) : filteredFaqs.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredFaqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    {...faq}
                    isExpanded={expandedFaqId === `faq-${faq.id}`}
                    onToggle={handleFaqToggle}
                    isAdmin={isAdminSession}
                    onEdit={beginEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <div className="py-24 text-center rounded-[3rem] border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 font-medium">
                검색 조건에 맞는 FAQ가 없어.
              </div>
            )}
          </div>
        </div>
      </main>

      <ServiceCenterFooter />
    </div>
  );
}
