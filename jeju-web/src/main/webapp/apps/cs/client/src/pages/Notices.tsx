import { useState, useMemo } from "react";
import { ChevronLeft, Calendar, Bell } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// 데이터 및 타입 임포트
import { NOTICES, getServiceLabel } from "@/data/serviceCenterData";
import { ServiceType } from "@/types/service-center";

// 공통 컴포넌트 임포트
import SearchBar from "@/components/serviceCenter/SearchBar";
import SectionHeader from "@/components/serviceCenter/SectionHeader";
import FAB from "@front-fab/FABContainer";

/**
 * 프리미엄 타임라인이 적용된 공지사항 페이지
 * 레이어드 애니메이션과 세련된 타이포그래피 적용
 */
export default function Notices() {
  const [activeService, setActiveService] = useState<ServiceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 챗봇 핸들러
  const handleChatbotClick = () => {
    alert("공지사항에 대해 궁금한 점이 있으시면 팻봇에게 물어보세요!");
  };

  // 필터링된 공지사항
  const filteredNotices = useMemo(() => {
    let result = activeService === "all" 
      ? NOTICES 
      : NOTICES.filter((n) => n.service === activeService);
    
    if (searchQuery) {
      result = result.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return result;
  }, [activeService, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* 프리미엄 FAB */}
      <FAB />

      {/* 검색바 */}
      <SearchBar 
        query={searchQuery} 
        setQuery={setSearchQuery} 
        onChatbotClick={handleChatbotClick} 
      />

      <main className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          {/* 헤더 섹션 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <Link href="/">
              <a className="inline-flex items-center gap-3 text-orange-600 hover:text-orange-700 font-black text-lg mb-10 group bg-orange-50 px-6 py-3 rounded-2xl transition-all hover:gap-6 shadow-sm">
                <ChevronLeft size={24} />
                메인 고객센터로 돌아가기
              </a>
            </Link>
            
            <SectionHeader 
              title="LATEST ANNOUNCEMENTS" 
              description="제주 그룹의 변화와 새로운 소식을 가장 입체적인 타임라인으로 확인하세요."
            />
          </motion.div>

          {/* 서비스 필터 탭 */}
          <div className="flex gap-4 mb-20 overflow-x-auto pb-4 no-scrollbar">
            {["all", "jeju-air", "jeju-stay", "jeju-rental"].map((service) => (
              <button
                key={service}
                onClick={() => setActiveService(service as ServiceType | "all")}
                className={`flex-shrink-0 px-8 py-3 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-md ${
                  activeService === service
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/20 scale-105"
                    : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100 hover:border-gray-200"
                }`}
              >
                {service === "all" ? "EXPLORE ALL" : getServiceLabel(service).toUpperCase()}
              </button>
            ))}
          </div>

          {/* 프리미엄 타임라인 리스트 */}
          <div className="relative">
            {/* 중앙 타임라인 선 */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/50 via-gray-100 to-transparent transform md:-translate-x-1/2 -z-10 bg-[length:100%_200%] animate-gradient-y" />

            <div className="space-y-24 md:space-y-32">
              <AnimatePresence mode="popLayout">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice, index) => {
                    const IconComponent = notice.icon;
                    const isEven = index % 2 === 0;

                    return (
                      <motion.div
                        key={notice.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`relative flex flex-col md:flex-row items-center gap-12 ${
                          isEven ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        {/* 타임라인 아이콘 센터 */}
                        <div className="absolute left-0 md:left-1/2 top-0 transform md:-translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-orange-500 z-10 shadow-xl shadow-orange-500/20" />

                        {/* 카드 영역 */}
                        <div className="w-full md:w-[calc(50%-3rem)] pl-12 md:pl-0">
                          <div className={`group relative bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-[3.5rem] border border-gray-100 hover:border-orange-200 transition-all shadow-2xl shadow-gray-200/50 hover:shadow-orange-500/10 cursor-pointer overflow-hidden`}>
                            {/* 데코 레이어 */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${notice.color} opacity-5 group-hover:opacity-10 transition-opacity rounded-bl-[5rem]`} />
                            
                            <div className="flex items-center gap-4 mb-8">
                              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${notice.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                <IconComponent className="text-white" size={28} />
                              </div>
                              <div className="space-y-1">
                                <span className={`text-xs font-black tracking-[0.2em] uppercase bg-gradient-to-r ${notice.color} bg-clip-text text-transparent`}>
                                  {getServiceLabel(notice.service)}
                                </span>
                                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                  <Calendar size={14} />
                                  {notice.date}
                                </div>
                              </div>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-6 leading-tight group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                              {notice.title}
                            </h3>
                            
                            <p className="text-gray-500 font-medium leading-relaxed mb-8">
                              {notice.content}
                            </p>

                            <button className="flex items-center gap-3 text-sm font-black text-orange-500 uppercase tracking-widest hover:gap-5 transition-all">
                              READ FULL ARTICLE
                              <Bell size={18} />
                            </button>
                          </div>
                        </div>

                        {/* 비어있는 반대편 영역 (데스크탑 좌우 배치를 위해) */}
                        <div className="hidden md:block w-[calc(50%-3rem)]" />
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-32 text-center"
                  >
                    <p className="text-gray-300 font-black text-2xl italic tracking-widest uppercase">
                      NO MATCHING NOTICE FOUND
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 안내 문구 */}
      <footer className="py-16 border-t border-gray-100 text-center bg-gray-50/10">
        <p className="text-gray-300 font-black tracking-[0.2em] text-xs uppercase">
          © 2026 JEJU GROUP INTEGRATED SERVICE CENTER. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
