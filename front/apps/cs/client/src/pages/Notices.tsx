import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { NOTICES } from "@/data/serviceCenterData";
import SearchBar from "@/components/serviceCenter/SearchBar";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import NoticeList from "@/components/serviceCenter/NoticeList";
import type { ServiceType } from "@/types/service-center";

export default function Notices() {
  const [activeService, setActiveService] = useState<ServiceType | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 5;

  const handleChatbotClick = () => {
    alert("공지사항에 대해 궁금한 점이 있으시면 챗봇에게 물어보세요!");
  };

  const filteredNotices = useMemo(() => {
    let result = activeService === "all" ? NOTICES : NOTICES.filter((notice) => notice.service === activeService);

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (notice) =>
          notice.title.toLowerCase().includes(normalizedQuery) ||
          notice.excerpt.toLowerCase().includes(normalizedQuery) ||
          Boolean(notice.content && notice.content.toLowerCase().includes(normalizedQuery)),
      );
    }

    return result;
  }, [activeService, searchQuery]);

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

  return (
    <div className="min-h-screen bg-white">
      <SearchBar query={searchQuery} setQuery={setSearchQuery} onChatbotClick={handleChatbotClick} />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/">
            <a className="flex items-center gap-1.5 text-gray-400 hover:text-orange-500 font-bold mb-8 transition-colors">
              <ChevronLeft size={18} />
              <span>메인 고객센터</span>
            </a>
          </Link>

          <NoticeList
            currentPage={currentPage}
            notices={pagedNotices}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </main>

      <ServiceCenterFooter />
    </div>
  );
}
