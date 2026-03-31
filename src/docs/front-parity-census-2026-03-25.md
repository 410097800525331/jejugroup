# Front Parity Census 2026-03-25

## Scope

- Canonical census: every current front-backed host-only route from `FrontMirrorHostController`, including `/` and `/index.html`, but excluding dedicated non-front pages like `/migration`.
- `pages/cs/customer_center.html` was included in the canonical census and matched.
- Alias census: `/auth/login`, `/auth/signup`, `/auth/pass`, `/mypage/dashboard`, `/deals`, `/deals/member`, `/deals/partner`, `/stay/hotel-list`, `/travel/activities`, `/travel/esim`, `/travel/guide`, `/travel/tips`.

## Method

- Browser-level comparison between `front:3001` and `spring:8080`.
- Exact-match signal required same final URL, title hash, normalized body-text hash, body class, and counts of headings/links/buttons/images.
- Alias checks verified spring redirect final URL only.

## Final Results

- Canonical exact matches: `44 / 47`
- Canonical exact mismatches: `3`
- Alias redirect outcomes matched: `12 / 12`
- Alias redirect outcomes differed: `0`

## Closed Runtime Gaps

- `/` and `/index.html` now resolve through the same front-mirror runtime instead of the old iframe wrapper split.
- `/admin/pages/dashboard.html` now matches again after the admin runtime script path fix.
- The earlier auth header divergence no longer reproduces as a stable runtime gap.
- The earlier JEJU STAY `관리자 페이지` utility mismatch no longer reproduces as a stable runtime gap.

## Remaining Exact-Only Drift

- Remaining exact mismatches are:
  - `/pages/auth/login.html`
  - `/jejustay/pages/deals/deals.html`
  - `/jejustay/pages/hotel/jejuhotel.html`
- `/jejustay/pages/deals/deals.html` is expected dynamic noise because the user-requested `HH:MM:SS` countdown changes while front and spring are measured sequentially.
- `/pages/auth/login.html` and `/jejustay/pages/hotel/jejuhotel.html` did not reproduce as stable substantive runtime divergence in follow-up spot checks and currently look closer to timing/render noise than to an ownership or routing mismatch.

## Conclusion

- The earlier substantive runtime divergences no longer reproduce as the main parity issue set.
- The current exact census is `44 / 47`, with alias redirect outcomes at `12 / 12`.
- What remains looks like small dynamic/timing noise rather than real front-vs-spring runtime divergence.
- Further work, if any, is optional polish or measurement-hardening rather than parity recovery.
