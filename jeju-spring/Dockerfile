FROM gradle:8.14.4-jdk21-jammy AS build

WORKDIR /workspace

COPY . .

WORKDIR /workspace/jeju-spring

RUN gradle --no-daemon bootJar

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -Dfile.encoding=UTF-8 -Djava.security.egd=file:/dev/./urandom"
ENV MYPAGE_AVATAR_UPLOAD_ROOT=/uploads

COPY --from=build /workspace/jeju-spring/build/libs/jeju-spring.jar /app/app.jar

RUN mkdir -p /uploads && chown -R 1000:1000 /app /uploads

USER 1000:1000

VOLUME ["/uploads"]

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
