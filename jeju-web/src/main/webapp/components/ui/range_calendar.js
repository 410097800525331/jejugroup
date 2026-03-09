(function (global) {
    'use strict';

    function ensureState(source) {
        const state = source || {};
        if (typeof state.checkIn === 'undefined') state.checkIn = null;
        if (typeof state.checkOut === 'undefined') state.checkOut = null;
        if (typeof state.tempCheckIn === 'undefined') state.tempCheckIn = null;
        if (typeof state.tempCheckOut === 'undefined') state.tempCheckOut = null;
        return state;
    }

    function createRangeCalendar(userConfig) {
        const config = Object.assign({
            fieldId: 'checkInField',
            popupId: 'calendarPopup',
            monthsContainerId: 'calendarMonths',
            dayPickerContainerId: 'dayPickerContainer',
            prevButtonId: 'prevMonth',
            nextButtonId: 'nextMonth',
            clearButtonId: 'btn-clear',
            confirmButtonId: 'btn-confirm',
            tabCalendarId: 'tab-calendar',
            tabFlexibleId: 'tab-flexible',
            panelCalendarId: 'panel-calendar',
            panelFlexibleId: 'panel-flexible',
            flexibleOptionSelector: '.Flexible-Option',
            weekStartsOn: 'monday',
            weekdayLabels: null,
            monthLabelFormatter: null,
            dayLabelFormatter: null,
            monthsToRender: 2,
            showHoverRange: true,
            enableTabs: true,
            enableFlexibleOptions: true,
            toggleMode: 'toggle', // toggle | open-only
            cancelOnToggleClose: false,
            toggleFieldActiveClass: false,
            openingClass: '',
            openingClassDurationMs: 0,
            closeAllPopups: null,
            onOpen: null,
            onClose: null,
            onCancel: null,
            onClear: null,
            onTempChange: null,
            onBeforeConfirm: null,
            onConfirm: null,
            state: null,
            initialMonth: null
        }, userConfig || {});

        const state = ensureState(config.state);
        let currentMonth = config.initialMonth ? new Date(config.initialMonth) : new Date();
        let hoverDate = null;
        let isInitialized = false;
        let openingTimer = null;

        let refs = null;
        function getRefs() {
            if (refs) return refs;
            refs = {
                field: document.getElementById(config.fieldId),
                popup: document.getElementById(config.popupId),
                monthsContainer: document.getElementById(config.monthsContainerId),
                dayPickerContainer: document.getElementById(config.dayPickerContainerId),
                prevButton: document.getElementById(config.prevButtonId),
                nextButton: document.getElementById(config.nextButtonId),
                clearButton: document.getElementById(config.clearButtonId),
                confirmButton: document.getElementById(config.confirmButtonId),
                tabCalendar: document.getElementById(config.tabCalendarId),
                tabFlexible: document.getElementById(config.tabFlexibleId),
                panelCalendar: document.getElementById(config.panelCalendarId),
                panelFlexible: document.getElementById(config.panelFlexibleId)
            };
            return refs;
        }

        function stopEvent(event) {
            if (event) event.stopPropagation();
        }

        function runCallback(name, extra) {
            const cb = config[name];
            if (typeof cb === 'function') {
                cb(state, api, extra);
            }
        }

        function notifyTempChange() {
            runCallback('onTempChange');
        }

        function getWeekdayLabels() {
            if (Array.isArray(config.weekdayLabels) && config.weekdayLabels.length === 7) {
                return config.weekdayLabels;
            }
            if (config.weekStartsOn === 'sunday') {
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            }
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        }

        function toDayStartTimestamp(dateLike) {
            const d = new Date(dateLike);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }

        function getMonthOffset(firstDayIndex) {
            // JS Date.getDay(): 0 (Sun) - 6 (Sat)
            return config.weekStartsOn === 'monday'
                ? (firstDayIndex === 0 ? 6 : firstDayIndex - 1)
                : firstDayIndex;
        }

        function getEffectiveCheckIn() {
            return state.tempCheckIn || state.checkIn;
        }

        function getEffectiveCheckOut() {
            return state.tempCheckOut || state.checkOut;
        }

        function formatMonthLabel(dateObj) {
            if (typeof config.monthLabelFormatter === 'function') {
                return config.monthLabelFormatter(dateObj, state, api);
            }
            return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        }

        function formatDayLabel(dayNumber, timestamp) {
            if (typeof config.dayLabelFormatter === 'function') {
                return config.dayLabelFormatter(dayNumber, timestamp, state, api);
            }
            return String(dayNumber);
        }

        function buildMonthDaysHTML(monthDate) {
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const startOffset = getMonthOffset(firstDay);
            const lastDate = new Date(year, month + 1, 0).getDate();
            const todayTs = toDayStartTimestamp(new Date());
            const checkIn = getEffectiveCheckIn();
            const checkOut = getEffectiveCheckOut();

            let html = '';
            for (let i = 0; i < startOffset; i++) {
                html += '<div class="DayPicker-Day DayPicker-Day--outside"></div>';
            }

            for (let day = 1; day <= lastDate; day++) {
                const ts = new Date(year, month, day).getTime();
                const classNames = ['DayPicker-Day'];

                if (ts < todayTs) classNames.push('DayPicker-Day--disabled');
                if (ts === todayTs) classNames.push('DayPicker-Day--today');

                if (checkIn && ts === checkIn) {
                    classNames.push('DayPicker-Day--selected', 'DayPicker-Day--checkIn', 'DayPicker-Day--hasRange');
                }
                if (checkOut && ts === checkOut) {
                    classNames.push('DayPicker-Day--selected', 'DayPicker-Day--checkOut', 'DayPicker-Day--hasRange');
                }
                if (checkIn && checkOut && ts > checkIn && ts < checkOut) {
                    classNames.push('DayPicker-Day--inRange');
                }
                if (config.showHoverRange && checkIn && !checkOut && hoverDate && ts > checkIn && ts <= hoverDate) {
                    classNames.push('DayPicker-Day--hoverRange');
                }

                html += [
                    `<div class="${classNames.join(' ')}" data-timestamp="${ts}" data-day="${day}">`,
                    formatDayLabel(day, ts),
                    '</div>'
                ].join('');
            }

            return html;
        }

        function renderCalendar() {
            const { monthsContainer } = getRefs();
            if (!monthsContainer) return;

            monthsContainer.innerHTML = '';
            const labels = getWeekdayLabels();

            for (let monthOffset = 0; monthOffset < config.monthsToRender; monthOffset++) {
                const monthDate = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + monthOffset,
                    1
                );

                const monthEl = document.createElement('div');
                monthEl.className = 'DayPicker-Month';

                const captionEl = document.createElement('div');
                captionEl.className = 'DayPicker-Caption';
                captionEl.textContent = formatMonthLabel(monthDate);
                monthEl.appendChild(captionEl);

                const weekdaysEl = document.createElement('div');
                weekdaysEl.className = 'DayPicker-Weekdays';
                labels.forEach((label) => {
                    const weekdayEl = document.createElement('div');
                    weekdayEl.className = 'DayPicker-Weekday';
                    weekdayEl.textContent = label;
                    weekdaysEl.appendChild(weekdayEl);
                });
                monthEl.appendChild(weekdaysEl);

                const bodyEl = document.createElement('div');
                bodyEl.className = 'DayPicker-Body';
                bodyEl.innerHTML = buildMonthDaysHTML(monthDate);
                monthEl.appendChild(bodyEl);

                monthsContainer.appendChild(monthEl);
            }

            attachDayListeners();
        }

        function updateHoverEffect() {
            const { popup } = getRefs();
            if (!popup) return;

            const days = popup.querySelectorAll('.DayPicker-Day');
            days.forEach((dayEl) => {
                dayEl.classList.remove('DayPicker-Day--hoverRange');
                if (!config.showHoverRange) return;

                const ts = parseInt(dayEl.dataset.timestamp, 10);
                if (!Number.isFinite(ts)) return;
                if (state.tempCheckIn && !state.tempCheckOut && hoverDate && ts > state.tempCheckIn && ts <= hoverDate) {
                    dayEl.classList.add('DayPicker-Day--hoverRange');
                }
            });
        }

        function handleDateClick(timestamp) {
            const tempCheckIn = state.tempCheckIn;
            const tempCheckOut = state.tempCheckOut;

            if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
                state.tempCheckIn = timestamp;
                state.tempCheckOut = null;
                hoverDate = null;
            } else if (timestamp < tempCheckIn) {
                state.tempCheckIn = timestamp;
                hoverDate = null;
            } else if (timestamp === tempCheckIn) {
                return;
            } else {
                state.tempCheckOut = timestamp;
                hoverDate = null;
            }

            notifyTempChange();
            renderCalendar();
        }

        function attachDayListeners() {
            const { popup, dayPickerContainer } = getRefs();
            if (!popup) return;

            const daySelector = '.DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)';
            popup.querySelectorAll(daySelector).forEach((dayEl) => {
                dayEl.addEventListener('click', (event) => {
                    stopEvent(event);
                    const ts = parseInt(dayEl.dataset.timestamp, 10);
                    if (Number.isFinite(ts)) {
                        handleDateClick(ts);
                    }
                });

                if (!config.showHoverRange) return;

                dayEl.addEventListener('mouseenter', () => {
                    const ts = parseInt(dayEl.dataset.timestamp, 10);
                    if (!Number.isFinite(ts)) return;
                    if (state.tempCheckIn && !state.tempCheckOut && ts > state.tempCheckIn) {
                        hoverDate = ts;
                        updateHoverEffect();
                    }
                });
            });

            if (dayPickerContainer && config.showHoverRange) {
                dayPickerContainer.onmouseleave = () => {
                    if (!hoverDate) return;
                    hoverDate = null;
                    updateHoverEffect();
                };
            }
        }

        function activateTab(targetTab) {
            const { tabCalendar, tabFlexible, panelCalendar, panelFlexible } = getRefs();

            [tabCalendar, tabFlexible].forEach((tab) => {
                if (!tab) return;
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });

            [panelCalendar, panelFlexible].forEach((panel) => {
                if (!panel) return;
                panel.classList.remove('active');
                panel.style.display = 'none';
            });

            if (!targetTab) return;
            targetTab.classList.add('active');
            targetTab.setAttribute('aria-selected', 'true');

            if (targetTab === tabCalendar && panelCalendar) {
                panelCalendar.classList.add('active');
                panelCalendar.style.display = 'block';
            }
            if (targetTab === tabFlexible && panelFlexible) {
                panelFlexible.classList.add('active');
                panelFlexible.style.display = 'block';
            }
        }

        function openCalendar() {
            const { field, popup } = getRefs();
            if (!field || !popup) return;

            if (typeof config.closeAllPopups === 'function') {
                config.closeAllPopups(config.popupId);
            }

            state.tempCheckIn = state.checkIn;
            state.tempCheckOut = state.checkOut;
            hoverDate = null;

            popup.classList.add('active');
            if (config.toggleFieldActiveClass) {
                field.classList.add('active');
            }

            if (config.openingClass) {
                popup.classList.add(config.openingClass);
                if (openingTimer) clearTimeout(openingTimer);
                if (config.openingClassDurationMs > 0) {
                    openingTimer = setTimeout(() => popup.classList.remove(config.openingClass), config.openingClassDurationMs);
                }
            }

            notifyTempChange();
            renderCalendar();
            runCallback('onOpen');
        }

        function closeCalendar(extra) {
            const { field, popup } = getRefs();
            if (!popup) return;

            popup.classList.remove('active');
            if (config.openingClass) {
                popup.classList.remove(config.openingClass);
            }
            if (config.toggleFieldActiveClass && field) {
                field.classList.remove('active');
            }
            runCallback('onClose', extra || null);
        }

        function cancelSelection(extra) {
            state.tempCheckIn = null;
            state.tempCheckOut = null;
            hoverDate = null;
            notifyTempChange();
            runCallback('onCancel', extra || null);
        }

        function handleTriggerClick(event) {
            stopEvent(event);
            const { popup } = getRefs();
            if (!popup) return;

            const isActive = popup.classList.contains('active');
            if (!isActive) {
                openCalendar();
                return;
            }

            if (config.toggleMode !== 'toggle') {
                return;
            }

            if (config.cancelOnToggleClose) {
                cancelSelection({ reason: 'toggle' });
            }
            closeCalendar({ reason: 'toggle' });
        }

        function handleConfirm(event) {
            stopEvent(event);
            const beforeConfirm = config.onBeforeConfirm;
            if (typeof beforeConfirm === 'function') {
                const result = beforeConfirm(state, api);
                if (result === false) return;
            }

            state.checkIn = state.tempCheckIn;
            state.checkOut = state.tempCheckOut;

            runCallback('onConfirm');

            if (typeof config.closeAllPopups === 'function') {
                config.closeAllPopups();
                const { field } = getRefs();
                if (config.toggleFieldActiveClass && field) {
                    field.classList.remove('active');
                }
            } else {
                closeCalendar({ reason: 'confirm' });
            }
        }

        function bindTabs() {
            if (!config.enableTabs) return;
            const { tabCalendar, tabFlexible } = getRefs();
            if (tabCalendar) {
                tabCalendar.addEventListener('click', (event) => {
                    stopEvent(event);
                    activateTab(tabCalendar);
                });
            }
            if (tabFlexible) {
                tabFlexible.addEventListener('click', (event) => {
                    stopEvent(event);
                    activateTab(tabFlexible);
                });
            }
        }

        function bindFlexibleOptions() {
            if (!config.enableFlexibleOptions) return;
            const { popup } = getRefs();
            if (!popup) return;

            popup.querySelectorAll(config.flexibleOptionSelector).forEach((optionEl) => {
                optionEl.addEventListener('click', (event) => {
                    stopEvent(event);
                    popup.querySelectorAll(config.flexibleOptionSelector).forEach((el) => el.classList.remove('active'));
                    optionEl.classList.add('active');
                });
            });
        }

        function init() {
            if (isInitialized) return api;
            const { field, popup, prevButton, nextButton, clearButton, confirmButton } = getRefs();
            if (!field || !popup) return api;

            field.addEventListener('click', handleTriggerClick);
            popup.addEventListener('click', stopEvent);

            if (prevButton) {
                prevButton.addEventListener('click', (event) => {
                    stopEvent(event);
                    currentMonth.setMonth(currentMonth.getMonth() - 1);
                    renderCalendar();
                });
            }

            if (nextButton) {
                nextButton.addEventListener('click', (event) => {
                    stopEvent(event);
                    currentMonth.setMonth(currentMonth.getMonth() + 1);
                    renderCalendar();
                });
            }

            if (clearButton) {
                clearButton.addEventListener('click', (event) => {
                    stopEvent(event);
                    state.checkIn = null;
                    state.checkOut = null;
                    state.tempCheckIn = null;
                    state.tempCheckOut = null;
                    hoverDate = null;

                    notifyTempChange();
                    renderCalendar();
                    runCallback('onClear');
                });
            }

            if (confirmButton) {
                confirmButton.addEventListener('click', handleConfirm);
            }

            bindTabs();
            bindFlexibleOptions();
            isInitialized = true;
            return api;
        }

        function setMonth(dateLike) {
            currentMonth = new Date(dateLike);
            renderCalendar();
        }

        function getMonth() {
            return new Date(currentMonth);
        }

        const api = {
            init,
            renderCalendar,
            openCalendar,
            closeCalendar,
            cancelSelection,
            getState: () => state,
            getMonth,
            setMonth
        };

        return api;
    }

    global.JJRangeCalendar = {
        createRangeCalendar
    };
})(window);
