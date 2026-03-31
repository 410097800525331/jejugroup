import { motion } from "framer-motion";
import { ChevronRight, type LucideIcon } from "lucide-react";

import type { ServiceType } from "@/types/service-center";

const SERVICE_LABELS: Record<ServiceType, string> = {
  "jeju-air": "제주항공",
  "jeju-stay": "제주스테이",
  "jeju-rental": "제주렌터카",
  common: "공통",
};

interface NoticeCardProps {
  id: number;
  service: ServiceType;
  title: string;
  date: string;
  excerpt: string;
  color: string;
  icon: LucideIcon;
  onClick?: () => void;
  active?: boolean;
  isAdmin?: boolean;
}

export default function NoticeCard({
  title,
  date,
  excerpt,
  service,
  color,
  icon: Icon,
  onClick,
  active = true,
  isAdmin = false,
}: NoticeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10, boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15)" }}
      className={`group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-200/50 transition-all duration-500 cursor-pointer h-full flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.05)] ${
        active ? "" : "opacity-75"
      }`}
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
              {SERVICE_LABELS[service]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-widest uppercase border ${
                  active ? "border-orange-100 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-100 text-gray-400"
                }`}
              >
                {active ? "활성" : "비활성"}
              </span>
            ) : null}
            <span className="text-sm text-gray-400 font-bold tracking-tight">{date}</span>
          </div>
        </div>
        <h4 className="text-xl font-black text-gray-900 mb-2 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-gray-900 group-hover:to-gray-400 transition-all font-sans">
          {title}
        </h4>
        <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center text-sm font-black text-orange-500 hover:gap-3 transition-all duration-300">
          공지사항 자세히 보기
          <ChevronRight size={18} />
        </div>
      </div>
    </motion.div>
  );
}
