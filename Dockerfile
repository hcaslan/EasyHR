# Build stage: Use official Gradle image with exact versions
FROM gradle:8.8-jdk21 AS build
WORKDIR /app

# Copy project files
COPY . .

# Build using the container's gradle
RUN gradle clean build -x test --no-daemon --refresh-dependencies

# Run stage
FROM amazoncorretto:21.0.3-alpine3.19
WORKDIR /app
COPY --from=build /app/build/libs/HumanResourcesApp-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
