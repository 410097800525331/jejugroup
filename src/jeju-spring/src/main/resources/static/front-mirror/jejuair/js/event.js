$(document).ready(function () {
  const today = new Date();

  eventDatas.forEach(data => {
    const endDate = new Date(data.endDate);
    const diffTime = endDate - today;
    const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isEnded = diffDay < 0;

    const cardHTML = `
      <div class="event_card ${isEnded ? 'ended' : ''}">
        <div class="event_thumb" style="background-image:url('assets/img/${data.img}')"></div>
        <div class="event_content">
          <h2 class="color">${isEnded ? '종료' : `D-${diffDay}`}</h2>
          <h3>${data.head}</h3>
          <p>${data.txt}</p>
          <p>${data.startDate} ~ ${data.endDate}</p>
          <a href="#" class="basic_btn">${isEnded ? '종료됨' : '자세히 보기'}</a>
        </div>
      </div>
    `;

    if (isEnded) {
      $('.event_grid.ended').append(cardHTML);
    } else {
      $('.event_grid.ongoing').append(cardHTML);
    }
  });

  // 탭 전환
  $('.tab_btn').on('click', function () {
    $('.tab_btn').removeClass('active');
    $(this).addClass('active');

    $('.event_grid').hide();
    $('.event_grid.' + $(this).data('tab')).css('display', 'grid');
  });
});
