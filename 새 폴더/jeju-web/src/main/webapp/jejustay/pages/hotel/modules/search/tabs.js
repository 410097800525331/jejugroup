export const initSearchTabs = () => {
  const tabs = document.querySelectorAll(".search-tab-large");
  const hotelForm = document.getElementById("searchFormHotel");
  const activityForm = document.getElementById("searchFormActivity");

  if (!tabs.length || !hotelForm) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((currentTab) => {
        currentTab.classList.remove("active");
      });

      tab.classList.add("active");

      if (tab.dataset.tab === "activity" && activityForm) {
        hotelForm.classList.add("hidden");
        activityForm.classList.remove("hidden");
        return;
      }

      hotelForm.classList.remove("hidden");
      if (activityForm) {
        activityForm.classList.add("hidden");
      }
    });
  });
};
