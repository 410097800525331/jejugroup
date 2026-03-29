import { useEffect, useState } from "react";
import { BadgeInfo, Car, ChevronLeft, Home as HomeIcon, Plane, RotateCcw, type LucideIcon } from "lucide-react";
import { Link, useRoute } from "wouter";

import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { getNoticeDetail, normalizeServiceType, type NoticeApi } from "@/lib/serviceCenterApi";
import type { NoticeType, ServiceType } from "@/types/service-center";

type ServiceTheme = {
  label: string;
  icon: LucideIcon;
};

const SERVICE_THEMES: Record<ServiceType, ServiceTheme> = {
  "jeju-air": {
    label: "제주항공",
    icon: Plane,
  },
  "jeju-stay": {
    label: "제주스테이",
    icon: HomeIcon,
  },
  "jeju-rental": {
    label: "제주렌터카",
    icon: Car,
  },
  common: {
    label: "공통",
    icon: BadgeInfo,
  },
};

const NOTICE_TYPE_LABELS: Record<NoticeType, string> = {
  notice: "공지",
  event: "이벤트",
};

function getServiceTheme(serviceType?: string | null) {
  return SERVICE_THEMES[normalizeServiceType(serviceType)];
}

function getNoticeTypeLabel(noticeType?: string | null) {
  return noticeType === "event" ? NOTICE_TYPE_LABELS.event : NOTICE_TYPE_LABELS.notice;
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

function getDisplayBody(notice: NoticeApi | null) {
  const body = notice?.content?.trim() || notice?.excerpt?.trim() || "";
  return body.length > 0 ? body : "본문이 없어.";
}

export default function NoticeDetail() {
  const [match, params] = useRoute("/notices/:id");
  const noticeId = params?.id;
  const [notice, setNotice] = useState<NoticeApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!noticeId) {
      setIsLoading(false);
      setError("공지 ID가 없어.");
      setNotice(null);
      return;
    }

    let active = true;

    setIsLoading(true);
    setError(null);

    void getNoticeDetail(noticeId)
      .then((result) => {
        if (!active) {
          return;
        }

        if (!result.ok) {
          throw result.error;
        }

        setNotice(result.data);
      })
      .catch((fetchError: unknown) => {
        if (!active) {
          return;
        }

        if (fetchError instanceof Error && "status" in fetchError && (fetchError as { status?: number }).status === 404) {
          setError("해당 공지를 찾지 못했어.");
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "공지 상세를 불러오지 못했어.");
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [noticeId, reloadToken]);

  if (!match) {
    return null;
  }

  const retry = () => {
    setReloadToken((value) => value + 1);
  };

  const serviceTheme = getServiceTheme(notice?.serviceType ?? notice?.service);
  const serviceLabel = serviceTheme.label;
  const noticeTypeLabel = getNoticeTypeLabel(notice?.noticeType);
  const publishedAt = formatApiDate(notice?.publishedAt ?? notice?.createdAt ?? notice?.updatedAt);
  const title = notice?.title?.trim() || "제목이 없어.";
  const ServiceIcon = serviceTheme.icon;

  return (
    <div className="min-h-screen bg-white notice-detail-page">
      <main className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8 flex items-center gap-4 text-gray-400 font-bold">
            <Link href="/notices" className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
              <ChevronLeft size={18} />
              <span>공지 목록으로</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="bbs-detail-skeleton rounded-[2rem] border border-gray-100 bg-white p-8">
              <div className="h-4 w-24 rounded-full bg-gray-100 animate-pulse" />
              <div className="mt-6 h-10 w-3/5 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="h-8 w-28 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-8 w-24 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-8 w-32 rounded-full bg-gray-100 animate-pulse" />
              </div>
              <div className="mt-10 space-y-3">
                <div className="h-4 w-full rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 w-11/12 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 w-10/12 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 w-8/12 rounded-full bg-gray-100 animate-pulse" />
              </div>
            </div>
          ) : error ? (
            <div className="bbs-detail-empty rounded-[2rem] border border-dashed border-gray-200 bg-gray-50 px-6 py-20 text-center">
              <p className="text-lg font-black text-gray-700">{error}</p>
              <p className="mt-3 text-sm text-gray-400">잠깐 뒤에 다시 시도해줘.</p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20"
                >
                  <RotateCcw size={16} />
                  다시 불러오기
                </button>
                <Link
                  href="/notices"
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 font-black text-gray-600 transition hover:border-orange-200 hover:text-orange-600"
                >
                  목록으로
                </Link>
              </div>
            </div>
          ) : notice ? (
            <article className="bbs-detail-card rounded-[2rem] border border-gray-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-gray-400">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-orange-600 tracking-normal uppercase">
                  <ServiceIcon size={14} />
                  {serviceLabel}
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 tracking-normal text-gray-500 uppercase">
                  {noticeTypeLabel}
                </span>
                {publishedAt ? <span className="tracking-normal normal-case text-gray-400">{publishedAt}</span> : null}
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight text-gray-900">{title}</h1>

              <dl className="bbs-detail-meta mt-8 grid grid-cols-1 gap-3 rounded-3xl bg-gray-50 px-5 py-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">서비스</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-700">{serviceLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">유형</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-700">{noticeTypeLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">날짜</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-700">{publishedAt || "-"}</dd>
                </div>
              </dl>

              <div className="bbs-detail-body mt-8 whitespace-pre-line rounded-3xl border border-gray-100 bg-white px-6 py-7 text-[1.05rem] leading-8 text-gray-700">
                {getDisplayBody(notice)}
              </div>
            </article>
          ) : (
            <div className="bbs-detail-empty rounded-[2rem] border border-dashed border-gray-200 bg-gray-50 px-6 py-20 text-center">
              <p className="text-lg font-black text-gray-700">공지 데이터가 없어.</p>
              <p className="mt-3 text-sm text-gray-400">목록으로 돌아가서 다른 공지를 골라봐.</p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Link href="/notices" className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20">
                  목록으로
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <ServiceCenterFooter />
    </div>
  );
}
