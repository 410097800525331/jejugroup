import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import InquiryForm from "@/components/serviceCenter/InquiryForm";
import InquiryList from "@/components/serviceCenter/InquiryList";
import SearchBar from "@/components/serviceCenter/SearchBar";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { createInquiry, fetchInquiries } from "@/services/inquiries";
import type { InquiryRecord, InquirySubmission } from "@/types/service-center";
import "@/styles/bbs.css";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"list" | "write">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const pageSize = 4;

  const handleChatbotClick = () => {
    alert("제주 그룹 AI 챗봇은 현재 준비 중입니다. 잠시만 기다려주세요.");
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

  useEffect(() => {
    let active = true;

    const loadInquiries = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const loadedInquiries = await fetchInquiries();
        if (!active) {
          return;
        }

        setInquiries(loadedInquiries);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "문의 목록을 불러오지 못했습니다.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadInquiries();

    return () => {
      active = false;
    };
  }, []);

  const handleInquirySubmitted = async (inquiry: InquirySubmission) => {
    await createInquiry(inquiry);

    const loadedInquiries = await fetchInquiries();
    setInquiries(loadedInquiries);
    setErrorMessage("");
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

          {errorMessage ? (
            <div
              style={{
                marginBottom: "20px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "#fff1f2",
                color: "#be123c",
                fontWeight: 700,
              }}
            >
              {errorMessage}
            </div>
          ) : null}

          {view === "list" ? (
            isLoading ? (
              <div className="bbs-container">
                <div className="py-20 text-center text-gray-400">문의 목록을 불러오는 중입니다.</div>
              </div>
            ) : (
              <InquiryList
                currentPage={currentPage}
                inquiries={pagedInquiries}
                onPageChange={setCurrentPage}
                onWriteClick={() => setView("write")}
                totalPages={totalPages}
              />
            )
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
