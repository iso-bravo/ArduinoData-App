#include <SPI.h>
#include <WiFi101.h>
#include <DHT.h>
#include "arduino_secrets.h"
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>
// #include <HTTPClient.h>



#define DHT_PIN 7
#define DHT_TYPE DHT11
#define LED_PIN 11

DHT dht(DHT_PIN, DHT_TYPE);

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int keyIndex = 0;
int status = WL_IDLE_STATUS;
WiFiServer server(80);
const char serverAddress[] = "192.168.74.6";
const int port = 3000;

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

float humThreshold = 50;
float tempThreshold = 25;
int brightness = 0;

unsigned long previousMillis = 0;
const long interval = 60000;

IPAddress ip = WiFi.localIP();

void printWiFiStatus();
void sendSensorData(float temperature, float humidity);

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(13, OUTPUT);
  pinMode(14, OUTPUT);
  Serial.begin(9600);
  dht.begin();
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    while (true);
  }
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(10000);
  }
  server.begin();
  printWiFiStatus();
  digitalWrite(14, HIGH);
  digitalWrite(13, HIGH);
  delay(2000);
  digitalWrite(14, LOW);
  digitalWrite(13, LOW);
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  unsigned long currentMillis = millis();

  Serial.println("Temperature: " + String(temperature) + "°C");
  Serial.println("Humidity: " + String(humidity) + "%");


  String contentType = "application/json";
  String postData = "{\"temperature\": " + String(temperature) + ", \"humidity\": " + String(humidity) + "}";
  
  Serial.print("Post data: ");
  Serial.println(postData);

  client.post("/dht11", contentType, postData);

  int statusCode = client.responseStatusCode();
  String response = client.responseBody();
    
    
  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);


  // Serial.print("IP Address: ");
  // Serial.println(ip);


   WiFiClient client = server.available();

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
            client.print("Click <a href=\"/H?temp=28\">here</a> to set temperature threshold<br>");
            client.print("Click <a href=\"/H?hum=50\">here</a> to set humidity threshold<br>");
            client.print("Use <a href=\"/B?val=128\">here</a> to set LED brightness (0-255)<br>");
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
        if (currentLine.indexOf("GET /H?temp=") != -1) {
          int tempIndex = currentLine.indexOf("temp=") + 5;
          int tempLength = currentLine.length() - tempIndex;
          int temp_client = currentLine.substring(tempIndex).toInt();
          tempThreshold = temp_client;
        }
        if (currentLine.indexOf("GET /H?hum=") != -1) {
          int humIndex = currentLine.indexOf("hum=") + 4;
          int humLength = currentLine.length() - humIndex;
          int hum_client = currentLine.substring(humIndex).toInt();
          humThreshold = hum_client;
        }
        if (currentLine.indexOf("GET /B?val=") != -1) {
          int valIndex = currentLine.indexOf("val=") + 4;
          int valLength = currentLine.length() - valIndex;
          int val_client = currentLine.substring(valIndex).toInt();
          brightness = val_client;
          analogWrite(LED_PIN, brightness);
        }
      }
    }
  }
  if (temperature >= tempThreshold) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
  if (humidity >= humThreshold) {
    digitalWrite(14, HIGH);
  } else {
    digitalWrite(14, LOW);
  }
  delay(10000);
}

void printWiFiStatus() {
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
}

void sendSensorData(float temperature, float humidity) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient wifiClient;
    const int serverPort = 3000;
    HttpClient client = HttpClient(wifiClient, "192.168.74.6", serverPort); 
    
    String postData = "{\"temperature\":" + String(temperature) + ",\"humidity\":" + String(humidity) + "}";
    Serial.print("postData");

    client.beginRequest();
    client.post("/dht11");
    client.sendHeader("Content-Type", "application/json");
    client.beginBody();
    client.print(postData);
    //client.endRequest();


    
    int statusCode = client.responseStatusCode();
    String response = client.responseBody();
    
    Serial.println(postData);

    Serial.print("Status code: ");
    Serial.println(statusCode);
    Serial.print("Response: ");
    Serial.println(response);
 }
}

