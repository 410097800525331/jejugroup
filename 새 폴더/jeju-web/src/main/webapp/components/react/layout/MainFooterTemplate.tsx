import { Building2, Car, Plane } from "lucide-react";
import FamilyRadialMenu from "./FamilyRadialMenu";

const STAY_FAMILY_RADIAL_ITEMS = [
  {
    href: "../../../jejuair/index.html",
    icon: Plane,
    key: "air",
    rel: "noreferrer",
    target: "_blank",
    title: "제주에어",
  },
  {
    href: "../../../jejustay/pages/hotel/jejuhotel.html",
    icon: Building2,
    key: "stay",
    rel: "noreferrer",
    target: "_blank",
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

export const MainFooterTemplate = () => {
  return (
    <footer className="footer section shell-footer" id="section-footer">
      <div className="footer-content">
        <div className="footer-info">
          <p>
            <strong data-lang="footerCompany">(주) 제주 그룹</strong>
          </p>
          <p data-lang="footerCEO">대표이사 김대표</p>
          <p data-lang="footerBizNum">사업자등록번호 616-81-50527</p>
          <p data-lang="footerSaleNum">통신판매신고 제주 2006-125</p>
          <p data-lang="footerHosting">호스팅 사업자 AWS</p>
          <br />
          <p data-lang="footerAddr">주소: 제주특별자치도 제주시 첨단로 64 (연동, 건설공제회관 3층)</p>
          <p data-lang="footerCs">고객센터: 1599-1500 (09:00 ~ 19:00)</p>
          <p data-lang="footerCsEmail">고객 문의: jejugroup.help@jejugroup.net</p>
          <p data-lang="footerPartnerEmail">제휴 문의: partnership@jejugroup.net</p>
        </div>

        <div className="footer-right-group">
          <FamilyRadialMenu items={STAY_FAMILY_RADIAL_ITEMS} radiusPx={72} />

          <div className="footer-social">
            <a href="#" className="social-icon" aria-label="YouTube">
              <i className="fab fa-youtube" />
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram" />
            </a>
            <a href="#" className="social-icon" aria-label="TikTok">
              <i className="fab fa-tiktok" />
            </a>
            <a href="#" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <p data-lang="footerCopyright">Copyright © Jeju Group. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
