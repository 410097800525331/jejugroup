const startHotelPage = async () => {
  try {
    const { initHotelPage } = await import("./modules/hotelPageApp.js");
    initHotelPage();
  } catch (error) {
    console.error("[HotelPage] init failed", error);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void startHotelPage();
  }, { once: true });
} else {
  void startHotelPage();
}
