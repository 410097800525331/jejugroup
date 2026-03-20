current_task: hotel-list page lazy loading, 50-per-page pagination, and Agoda-style sidebar expansion
next_tasks:
  - verify hybrid front shell render for hotel-list on desktop and mobile
  - sync front changes into jeju-web mirror after validation if needed
blocked_tasks:
  - none
writer_slot: main
contract_freeze:
  - source of truth remains front/jejustay and front/components/react hotel islands
  - jeju-spring stays isolated from jeju-web for now
  - deployment env source remains jeju-web/.env
  - target runtime is Spring Boot WAR + Thymeleaf
