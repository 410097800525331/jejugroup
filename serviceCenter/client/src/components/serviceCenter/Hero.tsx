import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

/**
 * 고객센터 메인 히어로 섹션
 * Framer Motion으로 생동감 있는 애니메이션 구현
 */
export default function Hero() {
  return (
    <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
      {/* 배경 이미지 및 오버레이 */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663351390526/ab9gBBp63CBu4auHT7zPrZ/hero-jeju-sky-8kycW4SjW4tA3oPSYA99Ug.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </motion.div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/30 text-orange-400 text-sm font-bold mb-6">
            Jeju Group Integrated Service Center
          </span>
          <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
            제주 여행의 시작부터 끝까지 <br />
            <span className="text-orange-500">완벽하게</span> 지원합니다
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            항공, 숙박, 렌터카 서비스 이용에 궁금한 점이 있으신가요? <br />
            제주 그룹 고객센터가 신속하고 정확하게 도와드리겠습니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/notices">
              <Button className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-2xl transition-all shadow-xl shadow-black/20 border-none cursor-pointer">
                공지사항 확인
              </Button>
            </Link>
            <Link href="/faqs">
              <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-6 text-lg rounded-2xl transition-all shadow-xl shadow-orange-500/30 border-none cursor-pointer">
                자주 묻는 질문
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 하단 장식 요소 */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
