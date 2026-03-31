import { BadgeInfo, Car, ChevronRight, Home as HomeIcon, PencilLine, Plane, Trash2, type LucideIcon } from "lucide-react";
import { Link } from "wouter";

import { normalizeServiceType } from "@/lib/serviceCenterApi";
import type { Notice } from "@/types/service-center";
import type { NoticeType, ServiceType } from "@/types/service-center";
import "@/styles/bbs.css";

type NoticeWithMeta = Notice & {
  active: boolean;
};

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

interface NoticeListItemProps extends Notice {
  index: number;
  active?: boolean | null;
  isAdmin?: boolean;
  onEdit?: (notice: NoticeWithMeta) => void;
  onDelete?: (notice: NoticeWithMeta) => void;
  href?: string;
}

export default function NoticeListItem(props: NoticeListItemProps) {
  const { title, date, active, isAdmin = false, onEdit, onDelete, href, service, noticeType } = props;
  const isInactive = active === false;
  const { label: serviceLabel, icon: ServiceIcon } = getServiceTheme(service);
  const noticeTypeLabel = getNoticeTypeLabel(noticeType);
  const noticePayload = { ...props, active: active !== false };
  const content = (
    <>
      <div className="bbs-item-content">
        <div className="bbs-item-badges">
          <span className="bbs-item-badge bbs-item-service-badge">
            <ServiceIcon size={12} />
            {serviceLabel}
          </span>
          <span className="bbs-item-badge bbs-item-type-badge">{noticeTypeLabel}</span>
          {isAdmin ? (
            <span className={`bbs-item-badge bbs-item-status-badge ${isInactive ? "is-inactive" : "is-active"}`}>
              {isInactive ? "비활성" : "활성"}
            </span>
          ) : null}
        </div>
        <span className="bbs-item-title">{title}</span>
        <span className="bbs-item-date">{date}</span>
      </div>

      {isAdmin ? (
        <div className="ml-4 flex items-center gap-2">
          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(noticePayload)}
              className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 transition hover:border-orange-300 hover:bg-orange-100"
            >
              <PencilLine size={14} />
              수정
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(noticePayload)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-black text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
              삭제
            </button>
          ) : null}
        </div>
      ) : (
        <ChevronRight size={20} className="bbs-item-chevron" />
      )}
    </>
  );

  if (href && !isAdmin) {
    return (
      <Link href={href} className="bbs-item" aria-label={`${title} 공지 상세 보기`}>
        {content}
      </Link>
    );
  }

  return <div className="bbs-item">{content}</div>;
}
