$(cardDatas).each((idx, data) => {
  const card = `
    <article class="polaroid_card">
      <a href="/jejuair/pages/booking/Availability.html"><img src="${data.mainImg}" alt="최저가 항공권"></a>
      <div class="card_info">
        <div class="price_row">
          <p>${data.airplane}</p>
          <p class="color">이코노미</p>
        </div>
        <h3>${data.destination}</h3>
        <div class="price_row">
          <p>왕복</p>
          <p>KRW <span>${data.price}</span></p>
        </div>
      </div>
      <a class="basic_btn" href="/jejuair/pages/booking/Availability.html"><span>지금예약</span></a>
    </article>
  `;

  $(".air_ticket").append(card);
});