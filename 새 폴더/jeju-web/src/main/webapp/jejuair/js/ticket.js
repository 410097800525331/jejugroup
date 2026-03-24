$(document).ready(function () {
  const ticketHTML = `
      <div class="ticket_panel">
      <button class="panel_toggle_btn" title="항공권 예매"><img src="assets/img/ico-airplane.png" alt="icon"></button>
    </div>
    <div class="ticket_wrap">
      <!-- tab -->
      <div class="tab_menu">
        <div class="ticket_tab_btn active" data-tab="tab_booking">항공권 예매</div>
        <div class="ticket_tab_btn" data-tab="tab_reserve">예약 조회</div>
        <div class="ticket_tab_btn" data-tab="tab_flight">운항 조회</div>
      </div>
      <!-- ticket tab1 -->
      <div id="tab_booking" class="ticket_tab_content active">
        <!-- tab sub -->
        <div class="tab_sub">
          <button class="ticket_sub_tab_btn active" data-tab="tab_round">왕복</button>
          <button class="ticket_sub_tab_btn" data-tab="tab_oneway">편도</button>
          <button class="ticket_sub_tab_btn"><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.AVAILABILITY">다구간</a></button>
        </div>
        <!-- ticket top -->
        <div class="ticket_top" data-tab="tab_round">
          <div class="ticketing_target">
            <div class="input_box">
              <label>출발지</label>
              <input type="text" placeholder="선택">
              <img src="assets/img/ico_loc.svg" alt="icon">
            </div>
            <div class="arrow_btn"><img src="assets/img/ico-arrow.svg" alt="icon"></div>
            <div class="input_box">
              <label>도착지</label>
              <input type="text" placeholder="선택">
              <img src="assets/img/ico_loc.svg" alt="icon">
            </div>
          </div>
        </div>
        <div class="ticket_top" data-tab="tab_oneway">
          <div class="ticketing_target">
            <div class="input_box">
              <label>출발지</label>
              <input type="text" placeholder="선택">
              <img src="assets/img/ico_loc.svg" alt="icon">
            </div>
            <div class="arrow_btn"><img src="assets/img/ico-arrowB.svg" alt="icon"></div>
            <div class="input_box">
              <label>도착지</label>
              <input type="text" placeholder="선택">
              <img src="assets/img/ico_loc.svg" alt="icon">
            </div>
          </div>
        </div>
        <!-- ticket cutline -->
        <div class="ticket_cutline"></div>
        <!-- ticket bottom -->
        <div class="ticket_bottom">
          <div class="ticketing_target">
            <div class="input_box">
              <label>탑승일</label>
              <input type="text" class="date_input" placeholder="선택" readonly>
              <span class="stay_info"></span>
              <img src="assets/img/ico_cal.svg" alt="icon">
            </div>
            <br>
            <div class="input_box">
              <label>탑승객</label>
              <input type="text" placeholder="성인1">
              <img src="assets/img/ico_person.svg" alt="icon">
            </div>
          </div>
          <div class="pay_method">
            <label>결제 방법</label>
            <div class="pay_options">
              <label><input type="radio" name="booking_pay" checked> 일반</label>
              <label><input type="radio" name="booking_pay"> 포인트</label>
              <label><input type="radio" name="booking_pay"> 기프티켓</label>
            </div>
          </div>
          <div class="discount_row">
            <label>할인 방법</label>
            <input class="discount_input" placeholder="프로모션 코드를 입력해주세요!">
            <button class="coupon_btn">운임 할인 쿠폰 ></button>
          </div>
          <div class="search">
            <button type="button" class="search_btn">항공권 검색</button>
          </div>
        </div>
      </div>
      <!-- ticket tab2 -->
      <div id="tab_reserve" class="ticket_tab_content">
        <div class="ticket_top">
          <div class="ticketing_target">
            <div class="input_box">
              <label>탑승객</label>
              <input type="text" placeholder="성 (Last Name)">
              <img src="assets/img/ico_person.svg" alt="icon">
            </div>
            <div class="arrow_btn"></div>
            <div class="input_box">
              <label>탑승객</label>
              <input type="text" placeholder="이름 (First Name)">
              <img src="assets/img/ico_person.svg" alt="icon">
            </div>
          </div>
        </div>
        <!-- ticket cutline -->
        <div class="ticket_cutline"></div>
        <!-- ticket bottom -->
        <div class="ticket_bottom">
          <div class="ticketing_target">
            <div class="input_box">
              <label>예약번호</label>
              <input type="text" placeholder="예약번호">
            </div>
            <br>
            <div class="input_box">
              <label>탑승일</label>
              <input type="text" class="date_input" placeholder="선택" readonly>
              <span class="stay_info"></span>
              <img src="assets/img/ico_cal.svg" alt="icon">
            </div>
          </div>
          <ul class="reserve_msg">
            <li>- 여행사, 공항, 고객센터, 비회원 예약 고객님도 조회 가능합니다.</li>
            <li>- 예약시 입력한 탑승객명을 입력해주세요.</li>
            <li>- 국제선의 경우 영문명을 입력해주세요.</li>
            <li>- 2명 이상 예약 조회는 <a href="#">여기</a>를 클릭해주세요.</li>
          </ul>
          <div class="search">
            <button type="button" class="search_btn">예약 조회</button>
          </div>
        </div>
      </div>
      <!-- ticket tab3 -->
      <div id="tab_flight" class="ticket_tab_content">
        <!-- tab sub -->
        <div class="tab_sub">
          <button class="ticket_sub_tab_btn active" data-sub="schedule">운항스케줄</button>
          <button class="ticket_sub_tab_btn" data-sub="current">출도착현황</button>
        </div>
        <div class="ticket_top">
          <div class="ticketing_target">
            <div class="input_box">
              <label>출발지</label>
              <input type="text" placeholder="선택">
              <img src="assets/img/ico_loc.svg" alt="icon">
            </div>
            <div class="arrow_btn"></div>
            <div class="input_box">
              <label>도착지</label>
              <input type="text" placeholder="선택">
              <img src="assets/img/ico_loc.svg" alt="icon">
            </div>
          </div>
        </div>
        <!-- ticket cutline -->
        <div class="ticket_cutline"></div>
        <!-- ticket bottom -->
        <div class="ticket_bottom" data-sub="schedule">
          <div class="ticketing_target">
            <div class="input_box">
              <label>탑승일</label>
              <input type="text" class="date_input" placeholder="선택" readonly>
              <span class="stay_info"></span>
              <img src="assets/img/ico_cal.svg" alt="icon">
            </div>
          </div>
          <div class="pay_method">
            <div class="pay_options">
              <label><input type="radio" name="flight_type" checked> 왕복</label>
              <label><input type="radio" name="flight_type"> 편도</label>
            </div>
          </div>
          <div class="search">
            <button type="button" class="search_btn">조회</button>
          </div>
        </div>
        <div class="ticket_bottom" data-sub="current">
          <div class="ticketing_target">
            <div class="input_box">
              <label>탑승일</label>
              <input type="text" class="date_input" placeholder="선택" readonly>
              <span class="stay_info"></span>
              <img src="assets/img/ico_cal.svg" alt="icon">
            </div>
          <div class="pay_method">
            <div class="pay_options">
              <label><input type="radio" name="flight_search" checked> 구간 조회</label>
              <label><input type="radio" name="flight_search"> 편명 조회</label>
            </div>
          </div>
          <div class="search">
            <button type="button" class="search_btn">조회</button>
          </div>
        </div>
      </div>
    </div>
    
   <!-- 캘린더 -->
    <div class="calendar_layer ticket_calendar">
      <div class="calendar_box">
        <div class="calendar_head">
          <button class="cal_prev">‹</button>
          <span class="cal_title"></span>
          <button class="cal_next">›</button>
        </div>
        <div class="calendar_month"></div>
        <div class="calendar_footer">
          <button type="button" class="calendar_apply_btn">적용</button>
        </div>
      </div>
    </div>
  `;

  $(".ticket").append(ticketHTML);

  /* ===============================
     패널 상태 복원
  =============================== */
  const ticketEl = document.querySelector('.ticket');
  const panelBtn = document.querySelector('.panel_toggle_btn');
  const ticketPanel = document.querySelector('.ticket_panel');

  const panelState = localStorage.getItem('ticket_panel_state');

  if (panelState === 'closed') {
    ticketEl.classList.add('hidden');
    panelBtn.classList.add('active');
    ticketPanel.classList.add('active');
  }

  panelBtn.addEventListener('click', () => {
    ticketEl.classList.toggle('hidden');
    panelBtn.classList.toggle('active');
    ticketPanel.classList.toggle('active');

    const isHidden = ticketEl.classList.contains('hidden');
    localStorage.setItem('ticket_panel_state', isHidden ? 'closed' : 'open');
  });

  /* ===============================
     메인 탭 (항공권 / 예약 / 운항)
  =============================== */
  const mainTabs = document.querySelectorAll('.ticket_tab_btn');
  const mainContents = document.querySelectorAll('.ticket_tab_content');

  mainTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      mainTabs.forEach(b => b.classList.remove('active'));
      mainContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  /* ===============================
     항공권 예매 서브탭 (왕복 / 편도)
  =============================== */
  const bookingTab = document.querySelector('#tab_booking');

  if (bookingTab) {
    const subBtns = bookingTab.querySelectorAll('.ticket_sub_tab_btn[data-tab]');
    const ticketTops = bookingTab.querySelectorAll('.ticket_top[data-tab]');

    subBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        subBtns.forEach(b => b.classList.remove('active'));
        ticketTops.forEach(t => t.style.display = 'none');

        btn.classList.add('active');
        bookingTab.querySelector(`.ticket_top[data-tab="${target}"]`).style.display = 'block';
      });
    });

    ticketTops.forEach(t => {
      if (t.dataset.tab !== 'tab_round') t.style.display = 'none';
    });
  }

  /* ===============================
     운항 조회 서브탭
  =============================== */
  const flightTab = document.querySelector('#tab_flight');

  if (flightTab) {
    const subBtns = flightTab.querySelectorAll('.ticket_sub_tab_btn[data-sub]');
    const bottoms = flightTab.querySelectorAll('.ticket_bottom[data-sub]');

    // 초기 상태
    bottoms.forEach(b => b.style.display = 'none');
    flightTab.querySelector('.ticket_bottom[data-sub="schedule"]').style.display = 'block';

    subBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.sub;

        subBtns.forEach(b => b.classList.remove('active'));
        bottoms.forEach(c => c.style.display = 'none');

        btn.classList.add('active');
        flightTab.querySelector(`.ticket_bottom[data-sub="${target}"]`).style.display = 'block';
      });
    });
  }

  /* ================= 공통 유틸 ================= */
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach(d => d.remove());
  }

  /* ================= 출발지 / 도착지 ================= */
  const departureLocations = [
    '서울(인천)',
    '서울(김포)',
    '부산',
    '제주',
    '광주',
    '청주',
    '대구'
  ];

  const arrivalLocations = [
    '대한민국',
    '일본',
    '동북아시아',
    '베트남',
    '필리핀',
    '인도네시아',
    '싱가포르',
    '태국/라오스',
    '말레이시아',
    '사이판'
  ];

  document.querySelectorAll('.input_box').forEach(box => {
    const label = box.querySelector('label')?.innerText;
    const input = box.querySelector('input');

    if (!input) return;

    if (label === '출발지' || label === '도착지') {
      input.addEventListener('click', e => {
        e.stopPropagation();
        closeAllDropdowns();

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';

        const ul = document.createElement('ul');
        const list = label === '출발지'
          ? departureLocations
          : arrivalLocations;

        list.forEach(item => {
          const li = document.createElement('li');
          li.innerText = item;
          li.addEventListener('click', () => {
            input.value = item;
            closeAllDropdowns();
          });
          ul.appendChild(li);
        });

        dropdown.appendChild(ul);
        box.appendChild(dropdown);
      });
    }
  });
  /* ================= 출발지 ↔ 도착지 스왑 ================= */
  document.querySelectorAll('.arrow_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetWrap = btn.closest('.ticketing_target');
      if (!targetWrap) return;

      const inputs = targetWrap.querySelectorAll('.input_box input');
      if (inputs.length !== 2) return;

      const temp = inputs[0].value;
      inputs[0].value = inputs[1].value;
      inputs[1].value = temp;
    });
  });

  /* ================= 탑승객 (항공권 예매 전용) ================= */
  document.querySelectorAll('#tab_booking .input_box').forEach(box => {
    const label = box.querySelector('label')?.innerText;
    const input = box.querySelector('input');

    if (label !== '탑승객') return;

    input.addEventListener('click', e => {
      e.stopPropagation();
      closeAllDropdowns();

      const state = {
        adult: 1,
        child: 0,
        infant: 0
      };

      const dropdown = document.createElement('div');
      dropdown.className = 'dropdown passenger';

      dropdown.innerHTML = `
      <div class="row" data-type="adult">
        <span>성인</span>
        <div class="ctrl">
          <button type="button" class="minus">-</button>
          <em>1</em>
          <button type="button" class="plus">+</button>
        </div>
      </div>
      <div class="row" data-type="child">
        <span>소아</span>
        <div class="ctrl">
          <button type="button" class="minus">-</button>
          <em>0</em>
          <button type="button" class="plus">+</button>
        </div>
      </div>
      <div class="row" data-type="infant">
        <span>유아</span>
        <div class="ctrl">
          <button type="button" class="minus">-</button>
          <em>0</em>
          <button type="button" class="plus">+</button>
        </div>
      </div>
      <button type="button" class="apply_btn">적용</button>
    `;

      box.appendChild(dropdown);

      // 🔒 내부 클릭 시 닫히지 않게
      dropdown.addEventListener('click', e => e.stopPropagation());

      dropdown.querySelectorAll('.row').forEach(row => {
        const type = row.dataset.type;
        const minus = row.querySelector('.minus');
        const plus = row.querySelector('.plus');
        const num = row.querySelector('em');

        minus.addEventListener('click', e => {
          e.stopPropagation();
          if (type === 'adult' && state.adult === 1) return;
          if (state[type] > 0) {
            state[type]--;
            num.innerText = state[type];
          }
        });

        plus.addEventListener('click', e => {
          e.stopPropagation();
          state[type]++;
          num.innerText = state[type];
        });
      });

      dropdown.querySelector('.apply_btn').addEventListener('click', e => {
        e.stopPropagation();

        let text = `성인 ${state.adult}`;
        if (state.child > 0) text += `, 소아 ${state.child}`;
        if (state.infant > 0) text += `, 유아 ${state.infant}`;

        input.value = text;
        closeAllDropdowns();
      });
    });
  });

  /* ================= 외부 클릭 시 닫기 ================= */
  document.addEventListener('click', closeAllDropdowns);

  /* ================= 공통 캘린더 ================= */
  /* ================= 공통 캘린더 ================= */
  let startDate = null;
  let endDate = null;
  let activeInputs = [];
  let baseDate = new Date();

  /* 오늘 기준 (시간 제거) */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarLayer = document.querySelector('.calendar_layer.ticket_calendar');
  document.body.appendChild(calendarLayer);

  const monthEl = calendarLayer.querySelector('.calendar_month');
  const titleEl = calendarLayer.querySelector('.cal_title');
  const prevBtn = calendarLayer.querySelector('.cal_prev');
  const nextBtn = calendarLayer.querySelector('.cal_next');

  /* 날짜 비교 */
  function isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  /* 탑승일 input 클릭 시 달력 열기 */
  document.querySelectorAll('.date_input').forEach(input => {
    input.addEventListener('click', e => {
      e.stopPropagation();

      activeInputs = [input];

      // 왕복일 경우 두 개 input 잡기
      if (input.closest('[data-tab="tab_round"]')) {
        const inputs = input
          .closest('.ticket_bottom')
          .querySelectorAll('input.date_input');
        activeInputs = Array.from(inputs);
      }

      const rect = input.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      calendarLayer.style.top = `${rect.bottom + scrollTop + 6}px`;
      calendarLayer.style.left = `${rect.left + scrollLeft - 40}px`;
      calendarLayer.classList.add('active');

      renderCalendar();
    });
  });

  /* 박수 계산 */
  function getStayInfo(start, end) {
    if (!start || !end) return '';
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return `${diff}박 ${diff + 1}일`;
  }

  /* 캘린더 렌더 */
  function renderCalendar() {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    titleEl.textContent = `${year}.${month + 1}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    let html = `<table>
    <thead>
      <tr>
        <th>일</th><th>월</th><th>화</th>
        <th>수</th><th>목</th><th>금</th><th>토</th>
      </tr>
    </thead>
    <tbody>
      <tr>`;

    for (let i = 0; i < firstDay; i++) html += `<td></td>`;

    for (let d = 1; d <= lastDate; d++) {
      const cur = new Date(year, month, d);
      cur.setHours(0, 0, 0, 0);

      let cls = '';

      /* ⛔ 과거 날짜 */
      if (cur < today) cls = 'disabled';

      /* 선택 상태 */
      if (startDate && isSameDay(cur, startDate)) cls = 'start';
      else if (endDate && isSameDay(cur, endDate)) cls = 'end';
      else if (startDate && endDate && cur > startDate && cur < endDate) cls = 'range';

      html += `<td class="${cls}" data-date="${year}-${month + 1}-${d}">${d}</td>`;

      if ((firstDay + d) % 7 === 0) html += `</tr><tr>`;
    }

    html += `</tr></tbody></table>`;
    monthEl.innerHTML = html;

    /* 날짜 클릭 */
    monthEl.querySelectorAll('td[data-date]').forEach(td => {
      td.addEventListener('click', e => {
        e.stopPropagation();

        /* ⛔ 과거 날짜 클릭 차단 */
        if (td.classList.contains('disabled')) return;

        const [y, m, d] = td.dataset.date.split('-');
        const clicked = new Date(y, m - 1, d);
        clicked.setHours(0, 0, 0, 0);

        if (!startDate || endDate) {
          startDate = clicked;
          endDate = null;
        } else if (clicked < startDate) {
          endDate = startDate;
          startDate = clicked;
        } else {
          endDate = clicked;
        }

        renderCalendar();
      });
    });

    updateDateInputs();
  }

  /* input 값 업데이트 */
  function updateDateInputs() {
    if (!activeInputs.length) return;

    const format = d =>
      `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;

    /* input이 1개인 경우 (실제 항공사 스타일) */
    if (activeInputs.length === 1) {
      if (startDate && endDate) {
        activeInputs[0].value = `${format(startDate)} ~ ${format(endDate)}`;
      } else if (startDate) {
        activeInputs[0].value = format(startDate);
      } else {
        activeInputs[0].value = '';
      }

      const stayEl = document.querySelector('.ticket_bottom .stay_info');
      if (stayEl && startDate && endDate) {
        stayEl.textContent = getStayInfo(startDate, endDate);
      }
      return;
    }

    /* input이 2개인 경우 */
    activeInputs[0].value = startDate ? format(startDate) : '';
    activeInputs[1].value = endDate ? format(endDate) : '';
  }

  /* 이전 / 다음 달 */
  prevBtn.onclick = e => {
    e.stopPropagation();
    baseDate.setMonth(baseDate.getMonth() - 1);
    renderCalendar();
  };

  nextBtn.onclick = e => {
    e.stopPropagation();
    baseDate.setMonth(baseDate.getMonth() + 1);
    renderCalendar();
  };

  // 적용 버튼
  const applyBtn = calendarLayer.querySelector('.calendar_apply_btn');

  applyBtn.addEventListener('click', e => {
    e.stopPropagation();

    /* 왕복인데 날짜 하나만 찍은 경우 방지 */
    if (activeInputs.length === 1) {
      if (!startDate) return;
    }

    if (activeInputs.length >= 1 && !startDate) return;

    /* 날짜 확정 */
    updateDateInputs();

    /* 달력 닫기 */
    calendarLayer.classList.remove('active');
  });

  /* 외부 클릭 시 닫기 */
  document.addEventListener('click', e => {
    if (!calendarLayer.contains(e.target)) {
      calendarLayer.classList.remove('active');
    }
  });

  /* 결제 페이지 이동 */
  const bookingSearchBtn = document.querySelector('#tab_booking .search_btn');
  if (bookingSearchBtn) {
    bookingSearchBtn.addEventListener('click', () => {
      window.jejuAirRoute?.navigate("SERVICES.AIR.BOOKING.PAYMENT");
    });
  }
});
