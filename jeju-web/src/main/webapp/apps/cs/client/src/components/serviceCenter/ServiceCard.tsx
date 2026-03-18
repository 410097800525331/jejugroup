import { LucideIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

/**
 * 서비스 소개 카드 컴포넌트
 * 마우스 호버 시 역동적인 그라데이션 보더 효과 제공
 */
export default function ServiceCard({ title, description, icon: Icon, color, onClick }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-30 transition duration-500`} />
      <div className="relative bg-white border border-gray-100 rounded-[2rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] hover:border-orange-200 transition-all duration-500 h-full flex flex-col items-start overflow-hidden">
        {/* 내부 광택 효과 */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent opacity-50 pointer-events-none" />
        
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-500/20`}>
          <Icon className="text-white" size={32} />
        </div>
        <h4 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-500 transition-all">
          {title}
        </h4>
        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
          {description}
        </p>
        <div className={`mt-auto flex items-center gap-2 font-bold text-lg group-hover:gap-4 transition-all duration-300`}>
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            자세히 보기
          </span>
          <ChevronRight size={22} className="text-gray-400 group-hover:translate-x-1 group-hover:text-gray-900 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}
