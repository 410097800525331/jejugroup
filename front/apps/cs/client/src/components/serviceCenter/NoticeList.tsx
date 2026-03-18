import { AnimatePresence, motion } from "framer-motion";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

import type { Notice } from "@/types/service-center";
import "@/styles/bbs.css";
import NoticeListItem from "./NoticeListItem";

interface NoticeListProps {
  notices: Notice[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function NoticeList({
  notices,
  currentPage,
  totalPages,
  onPageChange,
}: NoticeListProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="bbs-container">
      <header className="bbs-header">
        <h1>공지사항</h1>
        <p>새소식과 운임 공지를 확인해 보세요</p>
      </header>

      <div className="bbs-list">
        <AnimatePresence mode="popLayout">
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NoticeListItem {...notice} index={index} />
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-400">
              검색된 공지사항이 없습니다.
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="bbs-pagination">
        <button
          className="bbs-page-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          type="button"
        >
          <ChevronsLeft size={18} className="bbs-page-arrow" />
        </button>
        <button
          className="bbs-page-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          <ChevronLeft size={18} className="bbs-page-arrow" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            className={`bbs-page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}

        <button
          className="bbs-page-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          <ChevronRight size={18} className="bbs-page-arrow" />
        </button>
        <button
          className="bbs-page-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          type="button"
        >
          <ChevronsRight size={18} className="bbs-page-arrow" />
        </button>
      </div>
    </div>
  );
}
