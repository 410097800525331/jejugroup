# JejuAir Front Parity Census

## Scope

제주에어 canonical host-only 22개 페이지는 아래다.

| Page |
| --- |
| `/jejuair/index.html` |
| `/jejuair/pages/about/about.html` |
| `/jejuair/pages/about/career.html` |
| `/jejuair/pages/about/ccm.html` |
| `/jejuair/pages/baggage/cabinBaggage.html` |
| `/jejuair/pages/baggage/liability.html` |
| `/jejuair/pages/baggage/preorderedBaggage.html` |
| `/jejuair/pages/baggage/transportLimitation.html` |
| `/jejuair/pages/boarding/eDocument.html` |
| `/jejuair/pages/boarding/fastProcedure.html` |
| `/jejuair/pages/boarding/viewCheckin.html` |
| `/jejuair/pages/booking/Availability.html` |
| `/jejuair/pages/booking/payment.html` |
| `/jejuair/pages/booking/route.html` |
| `/jejuair/pages/booking/viewOnOffReservationList.html` |
| `/jejuair/pages/event/event.html` |
| `/jejuair/pages/jmembers/jmembersAirplane.html` |
| `/jejuair/pages/jmembers/jmembersGolf.html` |
| `/jejuair/pages/jmembers/jmembersInsurance.html` |
| `/jejuair/pages/jmembers/jmembersSightseeing.html` |
| `/jejuair/pages/pet/petPass.html` |
| `/jejuair/pages/pet/petService.html` |

## Contract Check

`front/jejuair/**/*.html` 22개, `FrontMirrorHostController`의 제주에어 host-only 매핑 22개, `jeju-spring/src/main/resources/templates/front-mirror/jejuair/**` 22개는 1:1로 맞는다. dedicated Spring-only JejuAir template 잔재는 없다.

## Method

브라우저 기준 `front:3001` vs `spring:8080` 비교로 봤다. raw exact comparison과 normalized substantive comparison을 분리했다.

정규화 규칙은 이렇다.
- `/@vite/client`는 제외
- local asset URL은 host origin 제거
- `/front-mirror` prefix 제거
- query string 제거
- body text, heading, `h1-h3`/link/button/image counts, stylesheet/script/image logical path hash를 비교

## Census Result

### Raw Exact

`22/22` exact mismatch.

이건 substantive divergence가 아니라 주로 호스트 차이에서 온다.
- `front:3001` Vite dev host가 `/@vite/client`를 주입해서 script count가 1 늘어난다
- spring mirror는 `mirror-front-to-thymeleaf.cjs`가 `<base href>`와 asset refs를 `/front-mirror/jejuair/**` + `th:*`로 rewrite해서 raw asset path/hash가 달라진다

### Normalized Substantive

`22/22` matched.

body text, heading, structural counts, logical stylesheet/script/image paths 기준으로는 차이가 없다.

## Classification

- `runtime divergence`: `0`
- `asset/path/base-href issue`: raw exact mismatch 22건 전부. dev-host injection과 mirror rewrite가 같이 걸린다
- `dynamic/cosmetic noise`: `/jejuair/index.html`의 YouTube embed telemetry abort request 차이 1건. DOM/body/hash에는 영향 없다

## Representative Evidence

- `front/jejuair/index.html`는 `<base href="./">`, `css/main.css`, `js/header.js` 같은 상대 경로를 쓴다
- `front/jejuair/pages/about/about.html`는 `<base href="../../">`, `css/main.css`, `css/about.css`, `js/header.js`를 쓴다
- spring mirror 대응본은 `<base th:href="@{/front-mirror/jejuair/}" href="/front-mirror/jejuair/">`와 `/front-mirror/jejuair/...` asset refs로 바뀐다
- `scripts/spring/mirror-front-to-thymeleaf.cjs`는 `resolveDocumentBasePath`, `buildMirrorBaseHref`, `rewriteUrlAttributes`로 이 변환을 담당한다

## Fixes

이번 스레드에서 추가 수정은 없다. no substantive parity gap이 남아 있지 않았고, canonical이 아닌 변경을 만들 이유도 없었다.

## Remaining Exceptions

raw exact mismatch는 host distinction 때문에 예상된 결과다. open substantive exception은 없다.

## Conclusion

JejuAir is substantively parity-complete.
