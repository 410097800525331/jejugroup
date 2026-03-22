import { PROFILE, STATS } from "./data";
import { SectionCard } from "./SectionCard";

export const SummarySection = () => {
  return (
    <section className="meta-section layer-hero dashboard-summary-grid">
      <SectionCard className="hero-glass-container profile-main-card">
        <div className="profile-avatar-wrap">
          <img
            alt="profile"
            className="profile-avatar"
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${PROFILE.name}&backgroundColor=f8f9fa`}
          />
        </div>
        <div className="profile-core-wrap">
          <div className="profile-info">
            <h1 className="profile-name">
              안녕하세요, <strong className="highlight">{PROFILE.name}</strong> 님
            </h1>
            <p className="profile-welcome-msg">오늘도 제주와 함께 설레는 여행을 계획해보세요.</p>
            <div className="membership-list">
              {PROFILE.memberships.map((membership: string) => (
                <div className="mem-badge soft-radius" key={membership}>
                  <i className="lucide-award" />
                  <span>{membership}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="summary-stats-column">
        {STATS.map((stat) => (
          <SectionCard className={`stat-card meta-glass-theme tone-${stat.tone}`} key={stat.label}>
            <div className="stat-icon-box">
              <i
                className={
                  stat.tone === "point"
                    ? "lucide-coins"
                    : stat.tone === "coupon"
                      ? "lucide-ticket"
                      : "lucide-plane-takeoff"
                }
              />
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
            </div>
          </SectionCard>
        ))}
      </div>
    </section>
  );
};
