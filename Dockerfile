# Build stage: Use JDK, not system gradle
FROM eclipse-temurin:21 AS build
WORKDIR /app

# Copy wrapper first for caching
COPY gradlew .
COPY gradle gradle
RUN chmod +x gradlew

# Copy project
COPY . .

# Use wrapper (pinned Gradle version) - CRITICAL FIX
RUN ./gradlew clean build -x test --no-daemon --refresh-dependencies

# Run stage
FROM amazoncorretto:21.0.3-alpine3.19
WORKDIR /app
COPY --from=build /app/build/libs/HumanResourcesApp-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
