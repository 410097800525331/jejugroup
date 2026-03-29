import { PencilLine, Trash2, ChevronRight } from "lucide-react";
import { Link } from "wouter";

import type { Notice } from "@/types/service-center";
import "@/styles/bbs.css";

type NoticeWithMeta = Notice & {
  active: boolean;
};

interface NoticeListItemProps extends Notice {
  index: number;
  active?: boolean | null;
  isAdmin?: boolean;
  onEdit?: (notice: NoticeWithMeta) => void;
  onDelete?: (notice: NoticeWithMeta) => void;
  href?: string;
}

export default function NoticeListItem(props: NoticeListItemProps) {
  const { title, date, active, isAdmin = false, onEdit, onDelete, href } = props;
  const isInactive = active === false;
  const noticePayload = { ...props, active: active !== false };
  const content = (
    <>
      <div className="bbs-item-content">
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-widest uppercase border ${isInactive ? "border-gray-200 bg-gray-100 text-gray-400" : "border-orange-100 bg-orange-50 text-orange-600"}`}
            >
              {isInactive ? "비활성" : "활성"}
            </span>
          ) : null}
          <span className="bbs-item-title">{title}</span>
        </div>
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
