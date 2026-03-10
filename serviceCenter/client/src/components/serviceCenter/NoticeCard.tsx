import { LucideIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getServiceLabel } from "../../data/serviceCenterData";

interface NoticeCardProps {
  id: number;
  service: string;
  title: string;
  date: string;
  excerpt: string;
  color: string;
  icon: LucideIcon;
  onClick?: () => void;
}

/**
 * 필터링 가능한 공지사항 개별 카드 컴포넌트
 * 세련된 비주얼과 인터랙션 효과 적용
 */
export default function NoticeCard({ title, date, excerpt, service, color, icon: Icon, onClick }: NoticeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10, boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15)" }}
      className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-200/50 transition-all duration-500 cursor-pointer h-full flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.05)]"
      onClick={onClick}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />
      <div className="p-8 flex-1 flex flex-col items-start gap-4">
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-orange-500/10`}>
              <Icon className="text-white" size={24} />
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-gradient-to-r ${color} bg-clip-text text-transparent border border-gray-200/50 shadow-sm`}>
              {getServiceLabel(service)}
            </span>
          </div>
          <span className="text-sm text-gray-400 font-bold tracking-tight">
            {date}
          </span>
        </div>
        <h4 className="text-xl font-black text-gray-900 mb-2 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-gray-900 group-hover:to-gray-400 transition-all font-sans">
          {title}
        </h4>
        <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center text-sm font-black text-orange-500 hover:gap-3 transition-all duration-300">
          더 자세히 소식 읽기
          <ChevronRight size={18} />
        </div>
      </div>
    </motion.div>
  );
}
