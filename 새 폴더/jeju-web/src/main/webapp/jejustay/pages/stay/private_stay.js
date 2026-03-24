const initSharedStayMotion = async () => {
    try {
        const [{ initPremiumAnimations }, { initScrollAnimations }] = await Promise.all([
            import("../hotel/modules/interactions/premiumAnimations.js"),
            import("../hotel/modules/interactions/commonInteractions.js")
        ]);

        initScrollAnimations();
        initPremiumAnimations();
    } catch (error) {
        console.error("[PrivateStayPage] shared motion init failed", error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide?.createIcons) {
        window.lucide.createIcons();
    }

    window.JejuWishlistButton?.init();
    void initSharedStayMotion();
});
