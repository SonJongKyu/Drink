FROM gradle:8.12.0-jdk21-alpine AS builder
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 9999
ENTRYPOINT ["java", "-jar", "app.jar"]