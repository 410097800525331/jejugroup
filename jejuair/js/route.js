const routes = {
  domestic: [
    {
      from: "서울/김포 GMP",
      to: "제주 CJU",
      price: "43,400",
      img: "https://ozimg.flyasiana.com/image_fixed/instant_search/instant_search_KR.jpg",
    },
    {
      from: "광주 KWJ",
      to: "제주 CJU",
      price: "47,400",
      img: "https://images.unsplash.com/photo-1612977423916-8e4bb45b5233?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8JUVDJUEwJTlDJUVDJUEzJUJDJUVCJThGJTg0fGVufDB8fDB8fHww",
    },
    {
      from: "서울/김포 GMP",
      to: "여수 RSU",
      price: "83,400",
      img: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA4MTJfNTgg%2FMDAxNzIzNDI5NTY3OTkw.JBwnHl5F3TcwLK6CWYtyRS0q9r-9-5fk1yRqTNLaOokg.lJYap6I7qThj9k0dXfh2o10wPhKRcvY2poYp_HXLKSUg.JPEG%2FDSC07502.jpg&type=a340",
    }
  ],
  asia_se: [
    {
      from: "인천 ICN",
      to: "방콕 BKK",
      price: "398,100",
      img: "https://res.klook.com/image/upload/fl_lossy.progressive,q_60/Mobile/City/bswpxlc7f9ooxoanlu6h.jpg",
    },
    {
      from: "인천 ICN",
      to: "다낭 DAD",
      price: "413,600",
      img: "https://res.klook.com/image/upload/activities/e7waraff45cbnn5j959r.jpg",
    }
  ],
  asia_ne: [
    {
      from: "서울 / 인천 / SEL",
      to: "오사카 / 간사이",
      price: "256,800",
      img: "/assets/img/main/des_M_KIX_01.jpg",
    },
    {
      from: "서울 / 인천 / SEL",
      to: "상하이[上海] / 푸동",
      price: "329,800",
      img: "/assets/img/main/des_M_PVG_02.jpg",
    },
    {
      from: "인천 ICN",
      to: "오사카 KIX",
      price: "295,900",
      img: "https://media.triple.guide/triple-cms/c_limit,f_auto,h_1024,w_1024/72364f49-249e-4b7a-9740-6f131fb3d2b1.jpeg",
    },
    {
      from: "인천 ICN",
      to: "타이베이 TPE",
      price: "356,000",
      img: "https://www.agoda.com/wp-content/uploads/2018/07/Destinations_Taipei_8-incredible-things-to-do_Taipei-101_skyline.jpg",
    }
  ],
  europe: [
    {
      from: "서울 / 인천 / SEL",
      to: "파리 / 샤를 드 골",
      price: "976,100",
      img: "/assets/img/main/des_M_CDG_02.jpg",
    },
    {
      from: "서울 / 인천 / SEL",
      to: "런던 / 히드로",
      price: "351,700",
      img: "/assets/img/main/des_M_LHR_01.jpg",
    },
    {
      from: "인천 ICN",
      to: "파리 CDG",
      price: "974,900",
      img: "https://i.namu.wiki/i/04Ka6t5vfcSOYlnIQTAB6BEJUNFHxlMOHayVm7YRHjEL_MA5HISe7cb1jnstCTmDqtHLQOt-y7-5xMabPUZEkQ.webp",
    },
    {
      from: "인천 ICN",
      to: "프랑크푸르트 FRA",
      price: "1,025,500",
      img: "https://i.namu.wiki/i/jBaDwodKFiijSVn1UgzW1mGL-xmLeO_zM_P9mAOGNERI8a40JNNAAjrmZKbTkbXK0-YeuXpgf_rAhscwcQgVPw.webp",
    }
  ],
  america: [
    {
      from: "인천 ICN",
      to: "로스앤젤레스 LAX",
      price: "955,900",
      img: "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/471000/471562-Los-Angeles.jpg",
    },
    {
      from: "인천 ICN",
      to: "뉴욕 JFK",
      price: "1,015,900",
      img: "https://blog-static.kkday.com/ko/blog/wp-content/uploads/Empire-State-Building_AShutterstock_421599727.jpg",
    }
  ],
  oceania: [
    {
      from: "인천 ICN",
      to: "시드니 SYD",
      price: "912,300",
      img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/cf/69/07/sydney-harbour.jpg?w=1200&h=-1&s=1",
    }
  ]
};

const grid = document.getElementById("route_grid");
const tabs = document.querySelectorAll(".region_tabs li");

function renderRoutes(region) {
  grid.innerHTML = "";

  routes[region].forEach(route => {
    const card = `
      <a href="#" class="route_card">
        <div class="route_img">
          <img src="${route.img}" alt="${route.to}">
        </div>

        <div class="route_text">
          <p class="route_info">이코노미 · 왕복</p>
          <h4 class="route_city">${route.from} → ${route.to}</h4>

          <div class="route_price">
            <strong>${route.price}</strong>원~
          </div>
        </div>
      </a>

    `;
    grid.insertAdjacentHTML("beforeend", card);
  });
}


tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderRoutes(tab.dataset.region);
  });
});

renderRoutes("domestic");
