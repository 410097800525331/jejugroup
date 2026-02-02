
import os

file_path = r"d:\lsh\git\jejuTeam\sub\jejustay_life.html"
new_html = """                            <div class="global-search-bar" style="flex-direction: column; height: auto; padding: 20px 24px; gap: 12px; align-items: stretch;">
                                <!-- Row 1: Destination (Full Width) -->
                                <div class="search-row row-1" style="width: 100%; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 12px; position: relative;">
                                    <div class="search-item destination-item-new" id="destinationFieldLarge" style="width: 100%; padding: 0;">
                                        <div class="item-icon">
                                            <i data-lucide="map-pin"></i>
                                        </div>
                                        <div class="item-content">
                                            <label class="item-label" data-lang="lifeDestLabel">어디서 살아볼까요?</label>
                                            <input type="text" class="item-input" id="destinationInput"
                                                placeholder="국가 또는 도시 검색" autocomplete="off"
                                                data-lang-placeholder="lifeDestPlaceholder" style="width: 100%;">
                                        </div>

                                        <!-- 여행지 드롭다운 -->
                                        <div class="destination-dropdown" id="destinationDropdown" style="top: 100%; left: 0; margin-top: 16px;">
                                            <div class="dropdown-columns"
                                                style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
                                                <!-- Column 1: Japan / China -->
                                                <div class="dropdown-column">
                                                    <div class="dropdown-header" data-lang="lifeDestJapanChina">일본 / 중국
                                                    </div>
                                                    <ul class="destination-list">
                                                        <li class="destination-item" data-value="도쿄">
                                                            <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&h=100&fit=crop"
                                                                alt="도쿄">
                                                            <div class="destination-info">
                                                                <span class="destination-name">도쿄</span>
                                                                <span class="destination-count">일본</span>
                                                                <span class="destination-desc"
                                                                    data-lang="descShoppingDining">쇼핑, 미식</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="오사카">
                                                            <img src="https://images.unsplash.com/photo-1590559899731-a382839e5549?w=100&h=100&fit=crop"
                                                                alt="오사카">
                                                            <div class="destination-info">
                                                                <span class="destination-name">오사카</span>
                                                                <span class="destination-count">일본</span>
                                                                <span class="destination-desc"
                                                                    data-lang="descShoppingSightseeing">쇼핑, 관광</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="후쿠오카">
                                                            <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&h=100&fit=crop"
                                                                alt="후쿠오카">
                                                            <div class="destination-info">
                                                                <span class="destination-name">후쿠오카</span>
                                                                <span class="destination-count">일본</span>
                                                                <span class="destination-desc">온천, 힐링</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="삿포로">
                                                            <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&h=100&fit=crop"
                                                                alt="삿포로">
                                                            <div class="destination-info">
                                                                <span class="destination-name">삿포로</span>
                                                                <span class="destination-count">일본</span>
                                                                <span class="destination-desc">설경, 맥주</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="상하이">
                                                            <img src="https://images.unsplash.com/photo-1548013146-72479768bada?w=100&h=100&fit=crop"
                                                                alt="상하이">
                                                            <div class="destination-info">
                                                                <span class="destination-name">상하이</span>
                                                                <span class="destination-count">중국</span>
                                                                <span class="destination-desc">야경, 현대미</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="칭다오">
                                                            <img src="https://images.unsplash.com/photo-1548013146-72479768bada?w=100&h=100&fit=crop"
                                                                alt="칭다오">
                                                            <div class="destination-info">
                                                                <span class="destination-name">칭다오</span>
                                                                <span class="destination-count">중국</span>
                                                                <span class="destination-desc">유럽풍, 맥주</span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <!-- Column 2: Europe / America -->
                                                <div class="dropdown-column">
                                                    <div class="dropdown-header">유럽 / 아메리카</div>
                                                    <ul class="destination-list">
                                                        <li class="destination-item" data-value="파리">
                                                            <img src="https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=100&h=100&fit=crop"
                                                                alt="파리">
                                                            <div class="destination-info">
                                                                <span class="destination-name">파리</span>
                                                                <span class="destination-count">프랑스</span>
                                                                <span class="destination-desc">예술, 낭만</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="런던">
                                                            <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=100&h=100&fit=crop"
                                                                alt="런던">
                                                            <div class="destination-info">
                                                                <span class="destination-name">런던</span>
                                                                <span class="destination-count">영국</span>
                                                                <span class="destination-desc">역사, 문화</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="로마">
                                                            <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=100&h=100&fit=crop"
                                                                alt="로마">
                                                            <div class="destination-info">
                                                                <span class="destination-name">로마</span>
                                                                <span class="destination-count">이탈리아</span>
                                                                <span class="destination-desc">유적, 미식</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="바르셀로나">
                                                            <img src="https://images.unsplash.com/photo-1583422409516-2895a77efded?w=100&h=100&fit=crop"
                                                                alt="바르셀로나">
                                                            <div class="destination-info">
                                                                <span class="destination-name">바르셀로나</span>
                                                                <span class="destination-count">스페인</span>
                                                                <span class="destination-desc">건축, 열정</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="뉴욕">
                                                            <img src="https://images.unsplash.com/photo-1565967511849-76a60a516170?w=100&h=100&fit=crop"
                                                                alt="뉴욕">
                                                            <div class="destination-info">
                                                                <span class="destination-name">뉴욕</span>
                                                                <span class="destination-count">미국</span>
                                                                <span class="destination-desc">도시, 쇼핑</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="호놀룰루">
                                                            <img src="https://images.unsplash.com/photo-1542259681-dadcd23d2de2?w=100&h=100&fit=crop"
                                                                alt="호놀룰루">
                                                            <div class="destination-info">
                                                                <span class="destination-name">호놀룰루</span>
                                                                <span class="destination-count">하와이</span>
                                                                <span class="destination-desc">휴양, 서핑</span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <!-- Column 3: Southeast Asia -->
                                                <div class="dropdown-column">
                                                    <div class="dropdown-header">동남아시아</div>
                                                    <ul class="destination-list">
                                                        <li class="destination-item" data-value="방콕">
                                                            <img src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=100&h=100&fit=crop"
                                                                alt="방콕">
                                                            <div class="destination-info">
                                                                <span class="destination-name">방콕</span>
                                                                <span class="destination-count">태국</span>
                                                                <span class="destination-desc">나이트라이프</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="다낭">
                                                            <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=100&h=100&fit=crop"
                                                                alt="다낭">
                                                            <div class="destination-info">
                                                                <span class="destination-name">다낭</span>
                                                                <span class="destination-count">베트남</span>
                                                                <span class="destination-desc">가족 휴양</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="나트랑">
                                                            <img src="https://images.unsplash.com/photo-1532598380311-665a39779df5?w=100&h=100&fit=crop"
                                                                alt="나트랑">
                                                            <div class="destination-info">
                                                                <span class="destination-name">나트랑</span>
                                                                <span class="destination-count">베트남</span>
                                                                <span class="destination-desc">해변, 리조트</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="세부">
                                                            <img src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=100&h=100&fit=crop"
                                                                alt="세부">
                                                            <div class="destination-info">
                                                                <span class="destination-name">세부</span>
                                                                <span class="destination-count">필리핀</span>
                                                                <span class="destination-desc">다이빙, 바다</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="발리">
                                                            <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100&h=100&fit=crop"
                                                                alt="발리">
                                                            <div class="destination-info">
                                                                <span class="destination-name">발리</span>
                                                                <span class="destination-count">인도네시아</span>
                                                                <span class="destination-desc">요가, 자연</span>
                                                            </div>
                                                        </li>
                                                        <li class="destination-item" data-value="싱가포르">
                                                            <img src="https://images.unsplash.com/photo-1565967511849-76a60a516170?w=100&h=100&fit=crop"
                                                                alt="싱가포르">
                                                            <div class="destination-info">
                                                                <span class="destination-name">싱가포르</span>
                                                                <span class="destination-count">싱가포르</span>
                                                                <span class="destination-desc">도시, 럭셔리</span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Row 2: Date / Guests / Options (3 Cols) -->
                                <div class="search-row row-2" style="display: grid; grid-template-columns: 1fr 1fr 1fr; width: 100%; gap: 12px; position: relative; align-items: center;">
                                    
                                    <!-- 1. 일정 (Dates) -->
                                    <div class="search-item date-item-new" id="checkInField" style="padding: 0; flex: none;">
                                        <div class="item-icon">
                                            <i data-lucide="calendar"></i>
                                        </div>
                                        <div class="item-content">
                                            <label class="item-label" data-lang="dateLabel">체크인 - 체크아웃</label>
                                            <div class="date-display-text">
                                                <span id="checkInDisplay" data-lang="dateSelect">날짜 선택</span>
                                                <span class="date-separator"> - </span>
                                                <span id="checkOutDisplay" data-lang="dateSelect">날짜 선택</span>
                                            </div>
                                        </div>

                                        <!-- 캘린더 팝업 -->
                                        <div class="Popup RangePicker RangePicker--checkIn" id="calendarPopup" style="left: 0; top: 120%;">
                                            <div class="Popup__content">
                                                <div class="RangePicker-Header">
                                                    <div class="RangePicker-NavPrev"><button class="NavBtn"
                                                            id="prevMonth"><i data-lucide="chevron-left"></i></button></div>
                                                    <div class="RangePicker-Tabs">
                                                        <div class="RangePicker-Tab"><button
                                                                class="TabBtn active">캘린더</button>
                                                        </div>
                                                    </div>
                                                    <div class="RangePicker-NavNext"><button class="NavBtn"
                                                            id="nextMonth"><i data-lucide="chevron-right"></i></button>
                                                    </div>
                                                </div>
                                                <div class="RangePicker-Panel active">
                                                    <div class="DayPicker" id="dayPickerContainer">
                                                        <div class="DayPicker-wrapper">
                                                            <div class="DayPicker-Months" id="calendarMonths"></div>
                                                        </div>
                                                    </div>
                                                    <div class="RangePicker-Footer" style="justify-content: space-between;">
                                                        <span class="warning-text" id="stayWarning"
                                                            style="color: var(--error); font-size: 0.9rem; display: none;">*
                                                            최소 14박 이상 선택해주세요</span>
                                                        <div style="display: flex; gap: 8px;">
                                                            <button class="ActionBtn ActionBtn--clear" id="btn-clear"
                                                                data-lang="btnReset">초기화</button>
                                                            <button class="ActionBtn ActionBtn--confirm" id="btn-confirm"
                                                                data-lang="btnConfirm">확인</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Vertical Divider 1 -->
                                    <div class="search-divider" style="position: absolute; left: 33.33%; top: 50%; transform: translateY(-50%); height: 28px;"></div>

                                    <!-- 2. 여행자 (Guests) -->
                                    <div class="search-item guest-item-new" id="guestFieldLarge" style="padding: 0 0 0 24px; flex: none;">
                                        <div class="item-icon">
                                            <i data-lucide="users"></i>
                                        </div>
                                        <div class="item-content">
                                            <label class="item-label" data-lang="guestLabel">여행자</label>
                                            <div class="guest-display-text">
                                                <span id="guestSummary">성인 1명, 객실 1개</span>
                                            </div>
                                        </div>

                                        <!-- 인원 선택 팝업 -->
                                        <div class="guest-popup-new" id="guestPopupLarge" style="left: -20px; top: 120%;">
                                            <div class="guest-row-new">
                                                <div class="guest-info-new">
                                                    <span class="guest-type-new" data-lang="guestRooms">객실</span>
                                                </div>
                                                <div class="guest-counter-new">
                                                    <button class="counter-btn-new minus" data-target="rooms">
                                                        <i data-lucide="minus"></i>
                                                    </button>
                                                    <span class="counter-value-new" id="roomsCountLarge">1</span>
                                                    <button class="counter-btn-new plus" data-target="rooms">
                                                        <i data-lucide="plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="guest-row-new">
                                                <div class="guest-info-new">
                                                    <span class="guest-type-new" data-lang="guestAdults">성인</span>
                                                    <span class="guest-desc-new" data-lang="guestAdultsDesc">18세 이상</span>
                                                </div>
                                                <div class="guest-counter-new">
                                                    <button class="counter-btn-new minus" data-target="adults">
                                                        <i data-lucide="minus"></i>
                                                    </button>
                                                    <span class="counter-value-new" id="adultsCountLarge">1</span>
                                                    <button class="counter-btn-new plus" data-target="adults">
                                                        <i data-lucide="plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="guest-row-new">
                                                <div class="guest-info-new">
                                                    <span class="guest-type-new" data-lang="guestChildren">아동</span>
                                                    <span class="guest-desc-new" data-lang="guestChildrenDesc">0 -
                                                        17세</span>
                                                </div>
                                                <div class="guest-counter-new">
                                                    <button class="counter-btn-new minus" data-target="children">
                                                        <i data-lucide="minus"></i>
                                                    </button>
                                                    <span class="counter-value-new" id="childrenCountLarge">0</span>
                                                    <button class="counter-btn-new plus" data-target="children">
                                                        <i data-lucide="plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Vertical Divider 2 -->
                                    <div class="search-divider" style="position: absolute; left: 66.66%; top: 50%; transform: translateY(-50%); height: 28px;"></div>

                                    <!-- 3. 필수 옵션 (Options - NEW) -->
                                    <div class="search-item options-item-new" id="optionsFieldLarge" style="padding: 0 0 0 24px; flex: none; position: relative;">
                                        <div class="item-icon">
                                            <i data-lucide="sliders-horizontal"></i>
                                        </div>
                                        <div class="item-content">
                                            <label class="item-label">필수 옵션</label>
                                            <div class="options-display-text" id="optionsSummary" style="font-size: 0.95rem; font-weight: 700; color: var(--text-title); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 140px;">
                                                선택사항 없음
                                            </div>
                                        </div>

                                        <!-- 옵션 선택 팝업 (NEW) -->
                                        <div class="options-popup-new" id="optionsPopupLarge" style="display: none; position: absolute; top: 120%; right: 0; width: 320px; background: #fff; padding: 24px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); z-index: 100;">
                                            <div class="options-grid" style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                                                <label class="option-check-item" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                                    <span class="option-name">주방</span>
                                                    <input type="checkbox" class="option-checkbox" value="주방" style="width: 20px; height: 20px; accent-color: var(--primary);">
                                                </label>
                                                <label class="option-check-item" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                                    <span class="option-name">세탁기</span>
                                                    <input type="checkbox" class="option-checkbox" value="세탁기" style="width: 20px; height: 20px; accent-color: var(--primary);">
                                                </label>
                                                <label class="option-check-item" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                                    <span class="option-name">풀옵션 주방</span>
                                                    <input type="checkbox" class="option-checkbox" value="풀옵션 주방" style="width: 20px; height: 20px; accent-color: var(--primary);">
                                                </label>
                                                <label class="option-check-item" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                                    <span class="option-name">세탁기/건조기</span>
                                                    <input type="checkbox" class="option-checkbox" value="세탁기/건조기" style="width: 20px; height: 20px; accent-color: var(--primary);">
                                                </label>
                                                <label class="option-check-item" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                                    <span class="option-name">업무용 데스크</span>
                                                    <input type="checkbox" class="option-checkbox" value="업무용 데스크" style="width: 20px; height: 20px; accent-color: var(--primary);">
                                                </label>
                                                <label class="option-check-item" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                                    <span class="option-name">전용 주차장</span>
                                                    <input type="checkbox" class="option-checkbox" value="전용 주차장" style="width: 20px; height: 20px; accent-color: var(--primary);">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                     <!-- Search Button (Integrated, Floating) -->
                                    <button class="search-btn-text" id="searchBtn" style="position: absolute; right: -72px; top: 50%; transform: translateY(-50%); height: 56px; min-width: 56px; border-radius: 50%; padding: 0; width: 56px; box-shadow: 0 8px 20px rgba(255,80,0,0.3);">
                                         <i data-lucide="search" style="color: white; width: 24px; height: 24px;"></i>
                                    </button>
                                </div>
                            </div>"""

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Replace lines 179 to 515 (indices 178 to 515 exclusive, so 178:515)
lines[178:515] = [new_html + "\n"]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Successfully updated jejustay_life.html")
