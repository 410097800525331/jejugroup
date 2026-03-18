import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import type { InquiryRecord } from "@/types/service-center";
import "@/styles/bbs.css";
import InquiryListItem from "./InquiryListItem";

interface InquiryListProps {
  inquiries: InquiryRecord[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onWriteClick: () => void;
}

export default function InquiryList({
  inquiries,
  currentPage,
  totalPages,
  onPageChange,
  onWriteClick,
}: InquiryListProps) {
  const { isAuthenticated, login } = useAuth();
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleWriteClick = () => {
    if (!isAuthenticated) {
      if (confirm("1:1 문의는 로그인 후 이용 가능합니다. 로그인하시겠습니까? (Mock Login)")) {
        login({}).then(() => {
          onWriteClick();
        });
      }
      return;
    }

    onWriteClick();
  };

  return (
    <div className="bbs-container">
      <header className="bbs-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1>나의 문의 내역</h1>
          <p>회원님께서 남겨주신 1:1 문의 내역입니다</p>
        </div>
        <button className="bbs-write-btn" onClick={handleWriteClick} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={20} />
          문의하기
        </button>
      </header>

      <div className="bbs-list">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <InquiryListItem key={inquiry.id} {...inquiry} />
          ))
        ) : (
          <div className="py-20 text-center text-gray-400">
            등록된 문의 내역이 없습니다.
          </div>
        )}
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
