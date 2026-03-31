import { JejuGroupFamilyRadialMenu } from "@front-layout/FamilyRadialMenu";

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
          <JejuGroupFamilyRadialMenu />
        </div>
      </div>
    </footer>
  );
}
