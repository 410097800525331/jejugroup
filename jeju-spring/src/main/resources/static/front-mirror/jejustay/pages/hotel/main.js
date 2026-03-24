// 랜딩 전용 스크립트 경로 호환용 위임 파일
import("../../../core/pages/landing/main.js").catch((error) => {
    console.error("[LandingLegacyMain] init failed", error);
});
