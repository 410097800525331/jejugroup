import { useEffect, useMemo, useState } from "react";
import {
  BadgeInfo,
  Car,
  ChevronLeft,
  Home as HomeIcon,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from "@/components/serviceCenter/SearchBar";
import SectionHeader from "@/components/serviceCenter/SectionHeader";
import FAQItem from "@/components/serviceCenter/FAQItem";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
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

export default function FAQs() {
  const [activeService, setActiveService] = useState<ServiceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FaqRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

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

  const visibleFaqs = useMemo(() => faqs.filter((faq) => faq.active !== false), [faqs]);

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
              description="서비스별 자주 묻는 질문을 여기서 바로 확인할 수 있어."
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
