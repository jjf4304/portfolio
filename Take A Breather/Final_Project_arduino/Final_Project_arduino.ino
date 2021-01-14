#include "ThingSpeak.h"
#include <WiFiNINA.h>
#include "secrets.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
WiFiClient client;

unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;
const char * myReadAPIKey = SECRET_READ_APIKEY;
unsigned int fieldNum = 1;

const int buttonPin = 2;   
const int potControllerPin = A0;

int buttonState = 0;       
int potControllerInput = 0;
int potControllerValue = 0;
int outsideHelpValue = 0;

unsigned long timer = 0;
unsigned long dTime = 0;

void setup() {
  pinMode(buttonPin, INPUT);
  Serial.begin(9600);

  Serial.println("ADADADA");

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  Serial.println("DADADADA");

  ThingSpeak.begin(client);  //Initialize ThingSpeak
}

void loop() {

    int statusCode = 0;
  
  // Connect or reconnect to WiFi
  if(WiFi.status() != WL_CONNECTED){
        Serial.print("Attempting to connect to SSID: ");
    while(WiFi.status() != WL_CONNECTED){
      WiFi.begin(ssid, pass); // Connect to WPA/WPA2 network. Change this line if using open or WEP network
            Serial.print(".");
      delay(5000);     
    } 
      Serial.println("\nConnected.");
     timer = millis();
  }

  if(millis() - timer >= 20000){ //if 20 seconds have passed since last read
    // Read in field 1 of the private channel which is a counter  
    long count = ThingSpeak.readLongField(myChannelNumber, fieldNum, myReadAPIKey);  
  
     // Check the status of the read operation to see if it was successful
    statusCode = ThingSpeak.getLastReadStatus();
    if(statusCode == 200){
        // enough presses to send message
        if(count >= 10){
          outsideHelpValue = 1;
          Serial.println("SEND HELP");
        }
    }
    else{
        Serial.println("Problem reading channel. HTTP error code " + String(statusCode)); 
    }
    
    timer = millis(); // save the time that the last write was made
  }

  delay(100);
  buttonState = digitalRead(buttonPin);
  potControllerInput = analogRead(potControllerPin);
  potControllerValue = map(potControllerInput, 0, 1023, 25, 775); 

  Serial.print(buttonState); 
  Serial.print(",");
  Serial.print(potControllerValue);
  Serial.print(",");
  Serial.println(outsideHelpValue);

  outsideHelpValue = 0;
}
