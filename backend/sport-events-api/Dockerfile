# Используем официальный образ OpenJDK
FROM eclipse-temurin:21-jdk

# Рабочая директория
WORKDIR /app

# Копируем JAR-файл
COPY target/sport-events-api-0.0.1-SNAPSHOT.jar app.jar

# Открываем порт
EXPOSE 8080

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "app.jar"]