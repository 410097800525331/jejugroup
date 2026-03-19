current_task: auth mypage and jejustay static pages migrated into jeju-spring
next_tasks:
  - start jejustay island page migration (jejuhotel, jejustay_life, private_stay, travel_checklist)
  - connect spring war artifact to alwaysdata deploy pipeline
blocked_tasks:
  - none
writer_slot: main
contract_freeze:
  - jeju-spring stays isolated from jeju-web for now
  - deployment env source remains jeju-web/.env
  - target runtime is Spring Boot WAR + Thymeleaf
