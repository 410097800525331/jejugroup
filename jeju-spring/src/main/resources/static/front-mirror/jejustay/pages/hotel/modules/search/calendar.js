const createCalendarState = () => ({
  checkIn: null,
  checkOut: null,
  tempCheckIn: null,
  tempCheckOut: null
});

const updateDateDisplay = (type, dateObject) => {
  const displayId = type === "checkIn" ? "checkInDisplay" : "checkOutDisplay";
  const displayElement = document.getElementById(displayId);
  if (!displayElement) {
    return;
  }

  if (!dateObject) {
    displayElement.textContent = type === "checkIn" ? "체크인" : "체크아웃";
    displayElement.style.color = "#999";
    return;
  }

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const date = String(dateObject.getDate()).padStart(2, "0");

  displayElement.textContent = `${year}-${month}-${date}`;
  displayElement.style.color = "#333";
};

const updateDateResults = (calendarState) => {
  updateDateDisplay("checkIn", calendarState.tempCheckIn ? new Date(calendarState.tempCheckIn) : null);
  updateDateDisplay("checkOut", calendarState.tempCheckOut ? new Date(calendarState.tempCheckOut) : null);
};

const createCalendarController = ({ calendarState, closeAllPopups }) => {
  if (!window.JJRangeCalendar) {
    return null;
  }

  return window.JJRangeCalendar.createRangeCalendar({
    state: calendarState,
    weekStartsOn: "monday",
    weekdayLabels: ["월", "화", "수", "목", "금", "토", "일"],
    monthLabelFormatter: (dateObject) => `${dateObject.getFullYear()}년 ${dateObject.getMonth() + 1}월`,
    showHoverRange: true,
    enableTabs: true,
    enableFlexibleOptions: true,
    toggleMode: "toggle",
    closeAllPopups: (exceptId) => closeAllPopups(exceptId),
    onTempChange: () => updateDateResults(calendarState)
  }).init();
};

export const createCalendarInitializer = ({ closeAllPopups }) => {
  const calendarState = createCalendarState();
  let calendarController = null;

  const initCalendar = (attempt = 0) => {
    if (calendarController) {
      return calendarController;
    }

    calendarController = createCalendarController({ calendarState, closeAllPopups });
    if (calendarController) {
      return calendarController;
    }

    if (attempt < 20) {
      window.setTimeout(() => {
        initCalendar(attempt + 1);
      }, 100);
    }

    return null;
  };

  return {
    initCalendar,
    calendarState
  };
};
