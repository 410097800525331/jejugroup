current_task: bootstrap jeju-spring Spring Boot + Thymeleaf module complete
next_tasks:
  - migrate first real front page into Thymeleaf template
  - move legacy servlet endpoints into Spring MVC controller/service slices
  - connect spring war artifact to alwaysdata deploy pipeline
blocked_tasks:
  - none
writer_slot: main
contract_freeze:
  - jeju-spring stays isolated from jeju-web for now
  - deployment env source remains jeju-web/.env
  - target runtime is Spring Boot WAR + Thymeleaf
