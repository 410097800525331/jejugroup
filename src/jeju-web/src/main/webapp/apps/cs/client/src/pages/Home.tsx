import { useEffect, useMemo, useState } from "react";
import { BadgeInfo, Car, ChevronRight, Home as HomeIcon, Plane, type LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

import type { FAQ, Notice, ServiceType } from "@/types/service-center";
import SearchBar from "@/components/serviceCenter/SearchBar";
import Hero from "@/components/serviceCenter/Hero";
import SectionHeader from "@/components/serviceCenter/SectionHeader";
import ServiceCard from "@/components/serviceCenter/ServiceCard";
import NoticeCard from "@/components/serviceCenter/NoticeCard";
import FAQItem from "@/components/serviceCenter/FAQItem";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { Button } from "@/components/ui/button";
import ContactCard from "@/components/serviceCenter/ContactCard";

type NoticeApiItem = {
  id: number | string;
  serviceType: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  active?: boolean | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type FaqApiItem = {
  id: number | string;
  serviceType: string;
  category: string;
  question: string;
  answer: string;
  sortOrder?: number | null;
  active?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ServiceTheme = {
  label: string;
  color: string;
  icon: LucideIcon;
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

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidates = [record.data, record.items, record.notices, record.faqs];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate as T[];
      }
    }
  }

  return [];
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

function mapNoticeItem(item: NoticeApiItem): Notice {
  const service = normalizeServiceType(item.serviceType);
  const theme = getServiceTheme(service);

  return {
    id: Number(item.id),
    service,
    title: item.title,
    date: formatApiDate(item.publishedAt ?? item.createdAt ?? item.updatedAt),
    excerpt: item.excerpt?.trim() || item.content?.trim() || "",
    content: item.content ?? item.excerpt ?? "",
    color: theme.color,
    icon: theme.icon,
  };
}

function mapFaqItem(item: FaqApiItem): FAQ {
  const service = normalizeServiceType(item.serviceType);
  const theme = getServiceTheme(service);

  return {
    id: Number(item.id),
    service,
    category: item.category,
    question: item.question,
    answer: item.answer,
    color: theme.color,
    icon: theme.icon,
  };
}

async function fetchCustomerCenterList<T>(path: string, signal: AbortSignal) {
  const response = await fetch(path, {
    signal,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error("목록을 불러오지 못했어.");
  }

  return unwrapList<T>(payload);
}

export default function Home() {
  const [activeService, setActiveService] = useState<ServiceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isNoticesLoading, setIsNoticesLoading] = useState(true);
  const [isFaqsLoading, setIsFaqsLoading] = useState(true);
  const [noticesError, setNoticesError] = useState<string | null>(null);
  const [faqsError, setFaqsError] = useState<string | null>(null);
  const [noticeReloadToken, setNoticeReloadToken] = useState(0);
  const [faqReloadToken, setFaqReloadToken] = useState(0);

  const handleChatbotClick = () => {
    alert("지금은 읽기 전용이야. 문의가 필요하면 고객센터 1:1 문의를 써줘.");
  };

  const handleFaqToggle = (id: string) => {
    setExpandedFaqId((previous) => (previous === id ? null : id));
  };

  useEffect(() => {
    const controller = new AbortController();

    setIsNoticesLoading(true);
    setNoticesError(null);

    void fetchCustomerCenterList<NoticeApiItem>("/api/customer-center/notices", controller.signal)
      .then((items) => {
        setNotices(items.filter((item) => item.active !== false).map(mapNoticeItem));
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setNoticesError(error instanceof Error ? error.message : "공지 목록을 불러오지 못했어.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsNoticesLoading(false);
        }
      });

    return () => controller.abort();
  }, [noticeReloadToken]);

  useEffect(() => {
    const controller = new AbortController();

    setIsFaqsLoading(true);
    setFaqsError(null);

    void fetchCustomerCenterList<FaqApiItem>("/api/customer-center/faqs", controller.signal)
      .then((items) => {
        setFaqs(items.filter((item) => item.active !== false).map(mapFaqItem));
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setFaqsError(error instanceof Error ? error.message : "FAQ 목록을 불러오지 못했어.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsFaqsLoading(false);
        }
      });

    return () => controller.abort();
  }, [faqReloadToken]);

  const filteredNotices = useMemo(() => {
    let result = activeService === "all" ? notices : notices.filter((notice) => notice.service === activeService);

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
  }, [activeService, notices, searchQuery]);

  const filteredFaqs = useMemo(() => {
    let result = activeService === "all" ? faqs : faqs.filter((faq) => faq.service === activeService);

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(normalizedQuery) ||
          faq.answer.toLowerCase().includes(normalizedQuery) ||
          faq.category.toLowerCase().includes(normalizedQuery),
      );
    }

    return result.slice(0, 4);
  }, [activeService, faqs, searchQuery]);

  const retryNotices = () => {
    setNoticeReloadToken((value) => value + 1);
  };

  const retryFaqs = () => {
    setFaqReloadToken((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-orange-100 selection:text-orange-600 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 -z-10" />

      <SearchBar query={searchQuery} setQuery={setSearchQuery} onChatbotClick={handleChatbotClick} />
      <Hero />

      <section className="py-32 px-4 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto">
          <SectionHeader
            centered
            title="세 가지 서비스, 한 화면에서"
            description="제주항공, 제주스테이, 제주렌터카 공지와 FAQ를 API 결과 기준으로 바로 보여줘."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <ServiceCard
              title="제주항공"
              description="운항, 예약, 수하물 관련 공지를 빠르게 확인할 수 있어."
              icon={Plane}
              color="from-orange-400 to-orange-600"
              onClick={() => setActiveService("jeju-air")}
            />
            <ServiceCard
              title="제주스테이"
              description="숙소, 체크인, 편의시설 관련 질문을 한 번에 볼 수 있어."
              icon={HomeIcon}
              color="from-cyan-400 to-cyan-600"
              onClick={() => setActiveService("jeju-stay")}
            />
            <ServiceCard
              title="제주렌터카"
              description="대여, 보험, 반납 관련 공지와 자주 묻는 내용을 모아둬."
              icon={Car}
              color="from-emerald-400 to-emerald-600"
              onClick={() => setActiveService("jeju-rental")}
            />
          </div>
        </div>
      </section>

      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="최신 공지"
            description="API에서 읽어온 공지사항만 보여줘. 서비스와 검색으로 바로 좁힐 수 있어."
            action={
              <Link href="/notices">
                <a className="group flex items-center gap-2 text-orange-600 font-black text-lg hover:gap-4 transition-all">
                  공지 전체 보기
                  <ChevronRight size={24} />
                </a>
              </Link>
            }
          />

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
              >
                {service === "all" ? "EXPLORE ALL" : getServiceLabel(service).toUpperCase()}
              </button>
            ))}
          </div>

          {isNoticesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[2.5rem] border border-gray-200/50 bg-white p-8 shadow-[0_15px_35px_rgba(0,0,0,0.05)]"
                >
                  <div className="h-1.5 w-24 rounded-full bg-gray-100 mb-8 animate-pulse" />
                  <div className="space-y-4 animate-pulse">
                    <div className="h-12 rounded-2xl bg-gray-100" />
                    <div className="h-6 rounded-full bg-gray-100 w-2/3" />
                    <div className="h-4 rounded-full bg-gray-100" />
                    <div className="h-4 rounded-full bg-gray-100 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : noticesError ? (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-black text-xl">공지 목록을 불러오지 못했어.</p>
              <p className="mt-3 text-gray-400">잠깐 뒤에 다시 시도해줘.</p>
              <button
                type="button"
                onClick={retryNotices}
                className="mt-8 inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20"
              >
                다시 불러오기
              </button>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-black text-xl italic uppercase tracking-widest">검색 결과가 없어</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredNotices.map((notice) => (
                  <motion.div
                    key={notice.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <NoticeCard {...notice} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-32 px-4 bg-gray-50/80 backdrop-blur-sm border-y border-gray-100/50">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            centered
            title="자주 묻는 질문"
            description="검색과 서비스 필터로 궁금한 항목만 빠르게 좁혀봐."
            action={
              <Link href="/faqs">
                <Button className="mt-6 bg-gray-900 hover:bg-black text-white px-10 py-7 rounded-2xl text-lg font-black transition-all shadow-xl shadow-gray-900/10">
                  FAQ 전체 보기
                </Button>
              </Link>
            }
          />

          <div className="space-y-6 mt-12">
            {isFaqsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-[2.5rem] border border-gray-200/60 bg-white p-8 animate-pulse">
                    <div className="flex items-start gap-6">
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
            ) : faqsError ? (
              <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-black text-xl">FAQ를 불러오지 못했어.</p>
                <p className="mt-3 text-gray-400">잠깐 뒤에 다시 시도해줘.</p>
                <button
                  type="button"
                  onClick={retryFaqs}
                  className="mt-8 inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20"
                >
                  다시 불러오기
                </button>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="py-20 text-center text-gray-300 font-medium">검색 결과가 없어</div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredFaqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    {...faq}
                    isExpanded={expandedFaqId === `faq-${faq.id}`}
                    onToggle={handleFaqToggle}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-white -z-10" />
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            centered
            title="지금 바로 필요한가요?"
            description="각 서비스 고객센터로 바로 연결되도록 안내만 유지했어."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 text-left">
            {[
              {
                name: "제주항공",
                phone: "1661-1114",
                hours: "24시간",
                color: "from-orange-400 to-orange-600",
                icon: Plane,
              },
              {
                name: "제주스테이",
                phone: "1661-2222",
                hours: "09:00 ~ 22:00",
                color: "from-cyan-400 to-cyan-600",
                icon: HomeIcon,
              },
              {
                name: "제주렌터카",
                phone: "1661-3333",
                hours: "08:00 ~ 20:00",
                color: "from-emerald-400 to-emerald-600",
                icon: Car,
              },
            ].map((contact) => (
              <ContactCard key={contact.name} {...contact} />
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/inquiries">
              <a className="inline-flex items-center gap-4 bg-white hover:bg-orange-50 text-orange-600 border-2 border-orange-100 hover:border-orange-500 px-12 py-5 rounded-3xl font-black text-xl transition-all shadow-xl hover:shadow-orange-500/20 group">
                고객센터 1:1 문의하기
                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <ServiceCenterFooter />
    </div>
  );
}
