import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import InquiryForm from "@/components/serviceCenter/InquiryForm";
import InquiryList from "@/components/serviceCenter/InquiryList";
import SearchBar from "@/components/serviceCenter/SearchBar";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { MOCK_INQUIRIES } from "@/data/mockInquiries";
import type { InquiryRecord, InquirySubmission } from "@/types/service-center";
import "@/styles/bbs.css";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(MOCK_INQUIRIES);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"list" | "write">("list");
  const pageSize = 4;

  const handleChatbotClick = () => {
    alert("제주 그룹 스마트 챗봇이 준비 중입니다. 잠시만 기다려 주세요!");
  };

  const filteredInquiries = useMemo(() => {
    if (!searchQuery) {
      return inquiries;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    return inquiries.filter(
      (inquiry) =>
        inquiry.title.toLowerCase().includes(normalizedQuery) ||
        inquiry.content.toLowerCase().includes(normalizedQuery) ||
        inquiry.service.toLowerCase().includes(normalizedQuery) ||
        inquiry.status.toLowerCase().includes(normalizedQuery),
    );
  }, [inquiries, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / pageSize));
  const pagedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredInquiries.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredInquiries]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, view]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleInquirySubmitted = (inquiry: InquirySubmission) => {
    const nextInquiry: InquiryRecord = {
      ...inquiry,
      id: Date.now(),
      date: new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(new Date())
        .replace(/\.\s/g, ".")
        .replace(/\.$/, ""),
      status: "pending",
    };

    setInquiries((previous) => [nextInquiry, ...previous]);
    setSearchQuery("");
    setCurrentPage(1);
    setView("list");
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
            {view === "write" ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-200 select-none">/</span>
                <button
                  onClick={() => setView("list")}
                  className="hover:text-orange-500 transition-colors flex items-center p-0"
                  style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
                >
                  목록으로 돌아가기
                </button>
              </div>
            ) : null}
          </div>

          {view === "list" ? (
            <InquiryList
              currentPage={currentPage}
              inquiries={pagedInquiries}
              onPageChange={setCurrentPage}
              onWriteClick={() => setView("write")}
              totalPages={totalPages}
            />
          ) : (
            <div className="bbs-container">
              <InquiryForm onSubmitted={handleInquirySubmitted} />
            </div>
          )}
        </div>
      </main>

      <ServiceCenterFooter />
    </div>
  );
}
