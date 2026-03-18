current_task: finalize jeju-spring module structure for page-by-page Thymeleaf migration
next_tasks:
  - migrate first real front page into Thymeleaf template
  - move legacy servlet endpoints into Spring MVC controller/service slices
  - connect spring war artifact to alwaysdata deploy pipeline
blocked_tasks:
  - local JDK is missing in the current environment, so spring:test and spring:package cannot be executed here yet
writer_slot: main
contract_freeze:
  - jeju-spring stays isolated from jeju-web for now
  - deployment env source remains jeju-web/.env
  - target runtime is Spring Boot WAR + Thymeleaf
