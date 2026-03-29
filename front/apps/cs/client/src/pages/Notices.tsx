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

import NoticeList from "@/components/serviceCenter/NoticeList";
import SearchBar from "@/components/serviceCenter/SearchBar";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
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

function mapNoticeItem(item: NoticeApiItem): NoticeRecord {
  const service = normalizeServiceType(item.serviceType ?? item.service);
  const theme = getServiceTheme(service);

  return {
    id: Number(item.id),
    service,
    noticeType: item.noticeType === "event" ? "event" : "notice",
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

export default function Notices() {
  const [activeService, setActiveService] = useState<ServiceType | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

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

  const visibleNotices = useMemo(() => notices.filter((notice) => notice.active !== false), [notices]);

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

  const retry = () => {
    setReloadToken((value) => value + 1);
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

          <NoticeList
            currentPage={currentPage}
            notices={pagedNotices}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            emptyMessage="검색 조건에 맞는 공지가 없어."
            noticeHref={(notice) => `/notices/${notice.id}`}
          />
        </div>
      </main>

      <ServiceCenterFooter />
    </div>
  );
}
