import { ChevronRight } from "lucide-react";
import { Notice } from "@/types/service-center";
import "@/styles/bbs.css";

interface NoticeListItemProps extends Notice {
  index: number;
}

export default function NoticeListItem(props: NoticeListItemProps) {
  const { title, date } = props;

  return (
    <div className="bbs-item">
      <div className="bbs-item-content">
        <span className="bbs-item-title">{title}</span>
        <span className="bbs-item-date">{date}</span>
      </div>
      <ChevronRight size={20} className="bbs-item-chevron" />
    </div>
  );
}
