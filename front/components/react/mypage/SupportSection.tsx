import { useState } from "react";

import { useDashboardState } from "./state";

const SUPPORT_ICON_SOURCES = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"],
} as const;

const detectFrontMirrorRuntime = () => {
  if (typeof document === "undefined") {
    return false;
  }

  return Array.from(document.querySelectorAll("link[href], script[src]")).some((element) => {
    const href = element.getAttribute("href") ?? element.getAttribute("src") ?? "";
    return href.includes("/front-mirror/");
  });
};

const resolveSupportIconSrc = (itemId: string, useMirrorAsset = false) => {
  const iconKey = itemId === "qna" ? "qna" : itemId === "notice" ? "notice" : "faq";
  const [primarySrc, mirrorSrc] = SUPPORT_ICON_SOURCES[iconKey];
  return useMirrorAsset ? mirrorSrc : primarySrc;
};

export const SupportSection = () => {
  const { state } = useDashboardState();
  const supportItems = state.supportItems ?? [];
  const [useMirrorAsset] = useState(detectFrontMirrorRuntime);
  const [fallbackIcons, setFallbackIcons] = useState<Record<string, boolean>>({});

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
                onError={(event) => {
                  if (fallbackIcons[item.id] || useMirrorAsset) {
                    return;
                  }

                  setFallbackIcons((current) => ({
                    ...current,
                    [item.id]: true,
                  }));

                  event.currentTarget.src = resolveSupportIconSrc(item.id, true);
                }}
                src={resolveSupportIconSrc(item.id, useMirrorAsset || fallbackIcons[item.id] === true)}
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
