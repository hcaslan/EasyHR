# Use a lightweight JDK image
FROM amazoncorretto:21.0.3-alpine3.19

# Set working directory inside the container
WORKDIR /app

# Copy the built application JAR file into the container
COPY build/libs/HumanResourcesApp-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your app will run on (default Spring Boot port is 8080)
EXPOSE 9090

# Set the default command to run the JAR file
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
