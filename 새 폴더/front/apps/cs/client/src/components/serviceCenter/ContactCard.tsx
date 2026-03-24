import { LucideIcon, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface ContactCardProps {
  name: string;
  phone: string;
  hours: string;
  color: string;
  icon: LucideIcon;
}

/**
 * 전용 고객센터 연락처 정보 카드 컴포넌트
 * 세련된 그라데이션과 폰 아이콘 포인트 적용
 */
export default function ContactCard({ name, phone, hours, color, icon: Icon }: ContactCardProps) {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative overflow-hidden rounded-[3rem] bg-gradient-to-br ${color} p-1 shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:shadow-[0_45px_90px_rgba(0,0,0,0.15)] cursor-pointer z-0 hover:z-10`}
    >
      <div className="absolute inset-0 bg-white group-hover:bg-white/95 transition-all duration-300 rounded-[2.9rem] m-0.5 border border-gray-100" />
      <div className="relative p-10 flex flex-col items-center text-center gap-6 group-hover:scale-105 transition-transform duration-500">
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl shadow-orange-500/20 group-hover:rotate-6 transition-all duration-500`}>
          <Icon className="text-white" size={40} strokeWidth={2.5} />
        </div>
        
        <div className="space-y-4 flex flex-col items-center">
          <h4 className={`text-2xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent uppercase tracking-wider`}>
            {name}
          </h4>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400 group-hover:text-orange-500 transition-colors" size={20} strokeWidth={3} />
              <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                {phone}
              </span>
            </div>
            <span className="text-sm text-gray-400 font-black tracking-widest uppercase bg-gray-100/50 px-4 py-1.5 rounded-full border border-gray-200/50">
              {hours} 운영
            </span>
          </div>
        </div>
        
        <div className={`mt-4 w-full h-1 bg-gradient-to-r ${color} rounded-full opacity-30 group-hover:opacity-100 transition-all duration-500`} />
      </div>
    </motion.div>
  );
}
