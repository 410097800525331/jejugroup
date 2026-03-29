import { AnimatePresence, motion } from "framer-motion";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, RotateCcw } from "lucide-react";

import type { Notice } from "@/types/service-center";
import "@/styles/bbs.css";
import NoticeListItem from "./NoticeListItem";

type NoticeWithMeta = Notice & {
  active: boolean;
};

interface NoticeListProps {
  notices: NoticeWithMeta[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  isAdmin?: boolean;
  showInactive?: boolean;
  onEditNotice?: (notice: NoticeWithMeta) => void;
  onDeleteNotice?: (notice: NoticeWithMeta) => void;
  noticeHref?: (notice: NoticeWithMeta) => string;
}

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 animate-pulse">
          <div className="flex-1 space-y-3">
            <div className="h-4 w-4/5 rounded-full bg-gray-200" />
            <div className="h-3 w-1/4 rounded-full bg-gray-200" />
          </div>
          <div className="ml-4 h-5 w-5 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function NoticeList({
  notices,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = "검색 조건에 맞는 공지사항이 없어.",
  isAdmin = false,
  onEditNotice,
  onDeleteNotice,
  noticeHref,
}: NoticeListProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const isBusy = isLoading || Boolean(error);

  return (
    <div className="bbs-container">
      <header className="bbs-header">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1>공지사항</h1>
            <p>서비스 소식과 운영 안내를 빠르게 확인해.</p>
          </div>
          {isAdmin ? (
            <div className="hidden md:inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">
              관리자 편집 가능
            </div>
          ) : null}
        </div>
      </header>

      <div className="bbs-list" aria-busy={isLoading}>
        {isLoading ? (
          <SkeletonRows />
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-lg font-black text-gray-600">공지 목록을 불러오지 못했어.</p>
            <p className="mt-3 text-sm text-gray-400">{error}</p>
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20"
              >
                <RotateCcw size={16} />
                다시 불러오기
              </button>
            ) : null}
          </div>
        ) : notices.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NoticeListItem
                  {...notice}
                  index={index}
                  isAdmin={isAdmin}
                  onEdit={onEditNotice}
                  onDelete={onDeleteNotice}
                  href={noticeHref?.(notice)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-20 text-center text-gray-400">{emptyMessage}</div>
        )}
      </div>

      <div className="bbs-pagination">
        <button
          className="bbs-page-btn"
          disabled={isBusy || currentPage === 1}
          onClick={() => onPageChange(1)}
          type="button"
        >
          <ChevronsLeft size={18} className="bbs-page-arrow" />
        </button>
        <button
          className="bbs-page-btn"
          disabled={isBusy || currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          <ChevronLeft size={18} className="bbs-page-arrow" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            className={`bbs-page-btn ${page === currentPage ? "active" : ""}`}
            disabled={isBusy}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}

        <button
          className="bbs-page-btn"
          disabled={isBusy || currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          <ChevronRight size={18} className="bbs-page-arrow" />
        </button>
        <button
          className="bbs-page-btn"
          disabled={isBusy || currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          type="button"
        >
          <ChevronsRight size={18} className="bbs-page-arrow" />
        </button>
      </div>
    </div>
  );
}
