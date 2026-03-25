# Front Parity Census 2026-03-25

## Scope

- Canonical census: every current front-backed host-only route from `FrontMirrorHostController`, including `/` and `/index.html`, but excluding dedicated non-front pages like `/migration`.
- `pages/cs/customer_center.html` was included in the canonical census and matched.
- Alias census: `/auth/login`, `/auth/signup`, `/auth/pass`, `/mypage/dashboard`, `/deals`, `/deals/member`, `/deals/partner`, `/stay/hotel-list`, `/travel/activities`, `/travel/esim`, `/travel/guide`, `/travel/tips`.

## Method

- Browser-level comparison between `front:3001` and `spring:8080`.
- Exact-match signal required same final URL, title hash, normalized body-text hash, body class, and counts of headings/links/buttons/images.
- Alias checks only verified spring redirect final URL.

## Results

- Canonical exact matches: `29 / 47`
- Canonical mismatches: `18`
- Alias redirect outcomes matched: `9 / 12`
- Alias redirect outcomes differed: `3`, all explained auth alias redirects that intentionally append `?shell=main`

## Canonical Mismatch Groups

### 1. Wrapper Route Divergence

- `/`
- Spring `/` remains a thin wrapper (`Jeju Group Landing`, visible text effectively `SCROLL DOWN`) instead of the same rendered landing body as front `/`.

### 2. Text-Only / Cosmetic Runtime Drift

- `/index.html`
- `/pages/mypage/dashboard.html`
- Primary observed diff is footer text casing (`FAMILY SITES` vs `Family Sites`) while route, title, structure counts, and body class otherwise align.

### 3. Auth Runtime Divergence

- `/pages/auth/login.html`
- `/pages/auth/signup.html`
- `/pages/auth/login.html` shows a materially different spring-side header/navigation payload than front.
- `/pages/auth/signup.html` differs at the very start with an extra `관리자 페이지` utility link on spring.

### 4. JEJU STAY Shell / Header Utility Divergence

- `/jejustay/pages/deals/deals.html`
- `/jejustay/pages/deals/deals_member.html`
- `/jejustay/pages/deals/deals_partner.html`
- `/jejustay/pages/hotel/hotel-list.html`
- `/jejustay/pages/travel/activities.html`
- `/jejustay/pages/travel/esim.html`
- `/jejustay/pages/travel/travel_guide.html`
- `/jejustay/pages/travel/travel_tips.html`
- `/jejustay/pages/hotel/jejuhotel.html`
- `/jejustay/pages/stay/jejustay_life.html`
- `/jejustay/pages/stay/private_stay.html`
- `/jejustay/pages/travel/travel_checklist.html`
- Shared first diff appears near the top utility area where spring injects `관리자 페이지` but front does not.

### 5. Admin Dashboard Divergence

- `/admin/pages/dashboard.html`
- Title and rendered dashboard body differ materially between front and spring; other admin pages matched.

## Alias Notes

- `/auth/login` -> `/pages/auth/login.html?shell=main`
- `/auth/signup` -> `/pages/auth/signup.html?shell=main`
- `/auth/pass` -> `/pages/auth/pass_auth.html?shell=main`
- Treat those 3 as explained redirect-contract differences, not blocking parity failures.

## Conclusion

- The repo is not at 100% parity.
- Customer center is closed and most jejuair/admin canonical pages match, but auth, JEJU STAY utility/header injection, root `/`, and admin dashboard still leave real parity gaps.

## Next Close-Out Order

1. Fix JEJU STAY/header utility divergence.
2. Fix auth canonical header parity.
3. Decide whether `/` stays wrapper-only or must match `/index.html`.
4. Fix admin dashboard divergence.
5. Optionally normalize cosmetic footer text casing.

