import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import type { InquiryRecord, ServiceType } from "@/types/service-center";
import "@/styles/bbs.css";
import InquiryListItem from "./InquiryListItem";

interface InquiryListProps {
  activeServiceFilter: "all" | ServiceType;
  currentPage: number;
  inquiries: InquiryRecord[];
  onInquirySelect: (inquiry: InquiryRecord) => void;
  onPageChange: (page: number) => void;
  onServiceFilterChange: (service: "all" | ServiceType) => void;
  onWriteClick: () => void;
  totalPages: number;
}

const SERVICE_FILTERS: Array<{ label: string; value: "all" | ServiceType }> = [
  { label: "전체", value: "all" },
  { label: "제주항공", value: "jeju-air" },
  { label: "제주스테이", value: "jeju-stay" },
  { label: "제주렌터카", value: "jeju-rental" },
];

export default function InquiryList({
  activeServiceFilter,
  currentPage,
  inquiries,
  onInquirySelect,
  onPageChange,
  onServiceFilterChange,
  onWriteClick,
  totalPages,
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
      <header className="bbs-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1>나의 문의 내역</h1>
          <p>서비스별로 문의 내역을 나눠 보고, 각 문의를 눌러 수정 또는 삭제할 수 있습니다.</p>
        </div>
        <button className="bbs-write-btn" onClick={handleWriteClick} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={20} />
          문의하기
        </button>
      </header>

      <div className="bbs-filter-bar">
        {SERVICE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`bbs-filter-btn ${activeServiceFilter === filter.value ? "active" : ""}`}
            onClick={() => onServiceFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="bbs-list">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <InquiryListItem key={inquiry.id} {...inquiry} onClick={() => onInquirySelect(inquiry)} />
          ))
        ) : (
          <div className="py-20 text-center text-gray-400">선택한 서비스에 등록된 문의 내역이 없습니다.</div>
        )}
      </div>

      <div className="bbs-pagination">
        <button className="bbs-page-btn" disabled={currentPage === 1} onClick={() => onPageChange(1)} type="button">
          <ChevronsLeft size={18} className="bbs-page-arrow" />
        </button>
        <button className="bbs-page-btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} type="button">
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
        <button className="bbs-page-btn" disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} type="button">
          <ChevronsRight size={18} className="bbs-page-arrow" />
        </button>
      </div>
    </div>
  );
}
