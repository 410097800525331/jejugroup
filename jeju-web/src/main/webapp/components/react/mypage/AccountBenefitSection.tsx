import { PROFILE, STATS } from "./data";
import { SectionCard } from "./SectionCard";

export const AccountBenefitSection = () => {
  return (
    <section className="meta-section layer-account-benefits">
      <header className="section-header">
        <h2 className="section-title">회원 정보 및 혜택</h2>
        <p className="section-subtitle">개인정보 보호와 맞춤형 혜택 관리</p>
      </header>

      <div className="account-grid bento-grid">
        <SectionCard className="account-info-box meta-glass-theme">
          <div className="box-head flex-header">
            <h3>기본 정보</h3>
            <button className="edit-btn pill-shape" type="button">
              내 정보 수정
            </button>
          </div>
          <div className="box-body">
            <div className="info-row">
              <span className="label">이름</span>
              <strong className="value">{PROFILE.name}</strong>
            </div>
            <div className="info-row">
              <span className="label">이메일</span>
              <strong className="value">{PROFILE.email}</strong>
            </div>
            <div className="info-row">
              <span className="label">휴대전화</span>
              <strong className="value">{PROFILE.phone}</strong>
            </div>
          </div>
        </SectionCard>

        {PROFILE.passport ? (
          <SectionCard className="passport-info-box meta-glass-theme">
            <div className="box-head">
              <h3>패스포트 정보</h3>
            </div>
            <div className="box-body">
              <div className="passport-visual soft-radius">
                <i className="lucide-passport" />
                <div className="pass-meta">
                  <span className="pass-num">{PROFILE.passport.number}</span>
                  <span className="pass-country">{PROFILE.passport.issuingCountry}</span>
                </div>
              </div>
              <div className="info-row">
                <span className="label">여권 만료일</span>
                <strong className="value">{PROFILE.passport.expiryDate}</strong>
              </div>
            </div>
          </SectionCard>
        ) : null}

        <SectionCard className="benefit-history-box meta-glass-theme full-width-bento">
          <div className="box-head">
            <h3>나의 포인트 & 쿠폰 내역</h3>
          </div>
          <div className="benefit-tiles">
            {STATS.slice(0, 2).map((stat) => (
              <div className={`benefit-tile tone-${stat.tone} soft-radius`} key={stat.label}>
                <span className="benefit-label">{stat.label}</span>
                <strong className="benefit-value">{stat.value}</strong>
                <button className="history-link" type="button">
                  상세 내역 확인
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  );
};
