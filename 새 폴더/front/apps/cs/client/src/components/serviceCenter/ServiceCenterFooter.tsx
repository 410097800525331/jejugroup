import { Building2, Car, Home, Plane } from "lucide-react";
import FamilyRadialMenu from "@front-layout/FamilyRadialMenu";

const RADIAL_LINKS = [
  {
    href: "/index.html",
    icon: Home,
    key: "main",
    title: "제주그룹 메인",
  },
  {
    href: "/jejuair/index.html",
    icon: Plane,
    key: "air",
    title: "제주에어",
  },
  {
    href: "/jejustay/pages/hotel/jejuhotel.html",
    icon: Building2,
    key: "stay",
    title: "제주스테이",
  },
  {
    href: "https://jejurentcar.netlify.app/",
    icon: Car,
    key: "rentcar",
    rel: "noreferrer",
    target: "_blank",
    title: "제주렌터카",
  },
];

export default function ServiceCenterFooter() {
  return (
    <footer className="customer-footer">
      <div className="customer-footer__inner">
        <div className="customer-footer__info">
          <p className="customer-footer__eyebrow">Integrated Support</p>
          <h2 className="customer-footer__title">JEJU GROUP SERVICE CENTER</h2>
          <p className="customer-footer__description">
            제주항공, 제주스테이, 제주렌터카를 한 번에 연결하는 통합 고객 지원 허브
          </p>
          <p className="customer-footer__copyright">
            © 2026 JEJU GROUP INTEGRATED SERVICE CENTER. ALL RIGHTS RESERVED.
          </p>
        </div>

        <div className="customer-footer__menu">
          <FamilyRadialMenu items={RADIAL_LINKS} originX="center" />
        </div>
      </div>
    </footer>
  );
}
