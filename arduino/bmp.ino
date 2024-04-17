#include <Wire.h>
#include <WiFi.h>
#include <Adafruit_BMP085.h>
#include "arduino_secrets.h"
#include <HTTPClient.h>

#define LED_TEMP 5
#define LED_PRESSURE 4
#define LED_BRIGHTNESS 2
#define BMP_SDA 21
#define BMP_SCL 22

Adafruit_BMP085 bmp;
WiFiServer server(80);

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int status = WL_IDLE_STATUS;

float pressureThreshold = 1013.25;
float tempThreshold = 25.0;
int brightness = 0;

unsigned long previousMillis = 0;
const long interval = 60000;

void setup() {
  pinMode(LED_TEMP, OUTPUT);
  pinMode(LED_PRESSURE, OUTPUT);
  pinMode(LED_BRIGHTNESS, OUTPUT);
  
  Serial.begin(9600);
  Serial.println("Inicializando...");

  Wire.begin(BMP_SDA, BMP_SCL);

  if (!bmp.begin()) {
    Serial.println(F("No se ha encontrado el sensor BMP180, verifica las conexiones!"));
    while (1);
  } else {
    Serial.println(F("Sensor BMP180 encontrado."));
  }

  Serial.println("Conectando a WiFi...");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Conectado a la red WiFi.");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());

  server.begin();
}

void loop() {
  WiFiClient client = server.available();
  float pressure = bmp.readPressure() / 100.0;
  float temperature = bmp.readTemperature(); 

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    sendSensorData(temperature, pressure);
    previousMillis = currentMillis;
  }

  if (client) {
    String currentLine = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();
            client.print("Click <a href=\"/setPressureThreshold?threshold=1013.25\">here</a> to set pressure threshold<br>");
            client.print("Click <a href=\"/setTemperatureThreshold?threshold=25\">here</a> to set temperature threshold<br>");
            client.print("Use <a href=\"/setBrightness?value=128\">here</a> to set LED brightness (0-255)<br>");
            client.println();
            break;
          }
          else {
            currentLine = "";
          }
        }
        else if (c != '\r') {
          currentLine += c;
        }
        if (currentLine.indexOf("GET /setPressureThreshold") != -1) {
          int thresholdIndex = currentLine.indexOf("threshold=") + 10;
          int thresholdLength = currentLine.length() - thresholdIndex;
          float threshold = currentLine.substring(thresholdIndex).toFloat();
          pressureThreshold = threshold;
          Serial.print("New pressure threshold set: ");
          Serial.println(pressureThreshold);
        }
        if (currentLine.indexOf("GET /setTemperatureThreshold") != -1) {
          int thresholdIndex = currentLine.indexOf("threshold=") + 10;
          int thresholdLength = currentLine.length() - thresholdIndex;
          float threshold = currentLine.substring(thresholdIndex).toFloat();
          tempThreshold = threshold;
          Serial.print("New temperature threshold set: ");
          Serial.println(tempThreshold);
        }
        if (currentLine.indexOf("GET /setBrightness") != -1) {
          int valIndex = currentLine.indexOf("value=") + 6;
          int valLength = currentLine.length() - valIndex;
          int val = currentLine.substring(valIndex).toInt();
          brightness = val;
          analogWrite(LED_BRIGHTNESS, brightness);
          Serial.print("New LED brightness set: ");
          Serial.println(brightness);
        }
      }
    }
  }
}

void sendSensorData(float temperature, float pressure) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    String serverAddress = "http://localhost";
    int serverPort = 3000;
    String url = "/bmp180";

    http.begin(serverAddress, serverPort, url);
    http.addHeader("Content-Type", "application/json");

    String postData = "{\"temperature\":" + String(temperature) + ",\"pressure\":" + String(pressure) + "}";
    int httpResponseCode = http.POST(postData); 
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("Error en la solicitud HTTP: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
}