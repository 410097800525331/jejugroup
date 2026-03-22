import { SectionCard } from "./SectionCard";
import { useDashboardState } from "./state";

export const SupportSection = () => {
  const { state } = useDashboardState();
  const supportItems = state.supportItems ?? [];

  return (
    <section className="meta-section layer-support">
      <header className="section-header">
        <h2 className="section-title">고객지원</h2>
        <p className="section-subtitle">여행 중 궁금한 점을 전문가와 상담하세요.</p>
      </header>

      <div className="support-bento-grid bento-grid">
        {supportItems.map((item) => (
          <a className={`support-item-card bento-item meta-glass-theme soft-radius ${item.id}`} href={item.href} key={item.id}>
            <div className="sp-icon">
              <img
                alt={item.label}
                src={
                  item.id === "qna"
                    ? "/pages/mypage/assets/support_qna.png"
                    : item.id === "notice"
                      ? "/pages/mypage/assets/support_notice.png"
                      : "/pages/mypage/assets/support_faq.png"
                }
              />
            </div>

            <div className="sp-text">
              <strong className="sp-label">{item.label}</strong>
              {item.count !== null ? (
                <span className={`sp-badge pill-shape ${item.count > 0 ? "active" : ""}`}>
                  {item.count} 건
                </span>
              ) : (
                <span className="sp-link-text">상세 보기</span>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
