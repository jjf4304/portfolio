import processing.serial.*;

Serial port;

Player player;

ArrayList<Asteroid> asteroids;
ArrayList<Bullet> bullets;
ArrayList<Asteroid> fakeAsteroids;

int time = 0;
float deltaTime;

boolean negativeModsOn;
int numNegativeModsOn;

String negativeMessage = "YOU'RE FAILING";
int blockerXPos;
int blockerYPos;
int blockerWidth;

float shootTimer;
int timeBtwShots;

float fakeAsteroidSpawnTimer;
float timeBtwFakeSpawn;

float asteroidSpawnTimer;
float timeBtwAsteroidSpawn;

float durationSlow;
float slowTimer;

int positionX;
int lastPosition;
int shoot;
int help;

int[] modifiers;
boolean slowDown;
float speedMod;

boolean start;
float timeToStart;
float startTimer;

PFont f;


void setup(){
  
  size(800, 800);
  
   String portName = Serial.list()[0];
   port = new Serial(this, portName, 9600);
 
   port.clear();
   port.bufferUntil('\n');
   
   asteroids = new ArrayList<Asteroid>();
   fakeAsteroids = new ArrayList<Asteroid>();
   bullets = new ArrayList<Bullet>();
   
   negativeModsOn = false;
   
   modifiers = new int[4];
   for(int i = 0; i < modifiers.length; i++){
    modifiers[i] = 0; 
   }
   
   positionX = 400;
   shoot = 0;
   help = 0;
   
   player = new Player(positionX, 700);
   time = millis();
   
   //Set up all other variables
   timeBtwShots = 2;
   shootTimer = 0.0f;
   
   timeBtwAsteroidSpawn = 1.0f;
   asteroidSpawnTimer = 0.0f;
   
   timeBtwFakeSpawn = 4.0f;
   fakeAsteroidSpawnTimer = 0.0f;
   
   durationSlow = 5.0f;
   slowTimer = 0.0f;
   
   blockerXPos = 0;
   blockerYPos = 0;
   blockerWidth = 0;
   
   numNegativeModsOn = 0;
   
   slowDown = false;
   speedMod = 1.0f;
   
   start = false;
   timeToStart = 10.0f;
   startTimer= 0.0f;
   
   f = createFont("Arial", 16, true);
   
}

void draw(){
  //Get Delta Time;
  deltaTime = (float(millis() - time))/1000.0;
  time = millis();
  
  //Draw background;
  background(200);
  
  if(!start){
     startTimer += deltaTime;
     if(startTimer > timeToStart){
        start = true;      
     }
     else{
      //Draw Beginning Game 
      textFont(f, 36);
      fill(0,255,0);
      text("Beginning Game", width/2 - 50, height/2 - 50);
     }
     return;
  }
  
  //Add to timers
  incrementTimers(deltaTime);

  //Get arduino input
  String input = port.readString();
  
  //If input isn't null, trim and set the movement and shoot inputs
  if(input != null){
    input = trim(input);
    int inputs[] = int(split(input, ','));
    //This should be greater than 2 when thingspeak is working
    if(inputs.length > 2){
      shoot = inputs[0];
      //Help get rid of the problem of random input shifting;
      if(abs(inputs[1] - positionX) <= 100){
        positionX = inputs[1];
      }
      help = inputs[2];
    }
  }
  
  if(help == 1){
     turnOffModifier();
  }
  
  //If shoot is 1 and enough time between shots has passed, spawn a new bullet
  if(shoot == 1 && shootTimer >= timeBtwShots){
    shootTimer = 0.0f;
    shoot = 0;
    Bullet b = new Bullet(player.getXPos(), player.getYPos()- player.getWidth()/2);
    bullets.add(b);
  }
  
  //if enough time has passed since last spawn, spawn a new asteroid
  if(asteroidSpawnTimer >= timeBtwAsteroidSpawn){
    
   asteroidSpawnTimer = 0.0f;
   
   int xPos = int(random(30, 770));
   int asteroidWidth = int(random(40, 100));
   //brown rgb
   int red = 165;
   int green = 42;
   int blue = 42;
   
   Asteroid a = new Asteroid(xPos, 0, asteroidWidth, red, green, blue, true, speedMod);
   asteroids.add(a);
  }
  
  ////Check if reversed movement is on
  //if(modifiers[0] == 1){
  //  // positionX = reverseNumber(positionX, 25, 775); 
  //}
  
  if(slowDown){
      textFont(f, 36);
      fill(0,255,0);
      text("You've got this!", width/2 - 50, height/2 - 50);
    slowTimer += deltaTime;
    //draw here?
    if(slowTimer >= durationSlow){
      slowOnHelp(1.0f);
      slowDown = false;
    }
  }
  
  UpdateAllEntities();
  removeEntitiesFromLists();
  
  //Check if blocking rect is on
  if(modifiers[1] == 1){
      drawBlocker();
  }
  
  //Start drawing phantom asteroids
  if(modifiers[2]==1){
    fakeAsteroidSpawnTimer += deltaTime;
    //If timer is greater than spawn time, create a fake asteroid.
    if(fakeAsteroidSpawnTimer >= timeBtwFakeSpawn){
      fakeAsteroidSpawnTimer = 0.0f;
       int xPos = int(random(30, 770));
       int asteroidWidth = int(random(40, 100));
       //brown rgb
       int red = 165;
       int green = 42;
       int blue = 42;
 
     Asteroid a = new Asteroid(xPos, 0, asteroidWidth, red, green, blue, false, speedMod);
     fakeAsteroids.add(a);
    }
  }
}



//Call update on all entities
void UpdateAllEntities(){
    //Update player - Original
    player.Update(positionX);
    
    //////Update With Possible reverse
    //if(modifiers[0] == 1){
    //  player.Update(player.getXPos() - positionX);
    //}
    //else{
    //  player.Update(positionX - player.getXPos());
    //}
    
    //update bullets
    for(int i = 0; i < bullets.size(); i++){
     bullets.get(i).Update(deltaTime, asteroids); 
    }
    
    //update asteroids
    for(int i = 0; i < asteroids.size(); i++){
     if(asteroids.get(i).Update(deltaTime, player) == 1){
      setNegativeModifiers(); 
     } 
    }
    
    //update Fakes
    for(int i = 0; i < fakeAsteroids.size(); i++){
     fakeAsteroids.get(i).Update(deltaTime, player);
    }
}


//increment timers for actions
void incrementTimers(float dTime){
   shootTimer+=dTime; 
   asteroidSpawnTimer+=dTime;
}

//Remove dead entities from the array lists
void removeEntitiesFromLists(){
  //apparently need to reverse array lists to remove from, which makes sense I suppose
  //From processing's documentation: https://processing.org/reference/ArrayList.html
  for (int i = asteroids.size() - 1; i >= 0; i--) {
    if (asteroids.get(i).dead()) {
      asteroids.remove(i);
    }
  }
  
  for (int i = fakeAsteroids.size() - 1; i >= 0; i--) {
    if (fakeAsteroids.get(i).dead()) {
      fakeAsteroids.remove(i);
    }
  }
  
  for (int i = bullets.size() - 1; i >= 0; i--) {
    if (bullets.get(i).dead()) {
      bullets.remove(i);
    }
  }
}

//Set a negative modifier
void setNegativeModifiers(){
  negativeModsOn = true;
  numNegativeModsOn++;
  
  if(numNegativeModsOn >= modifiers.length){
    numNegativeModsOn = modifiers.length;
  }
  else{
    int modToTurnOn = int(random(0, modifiers.length));
    if(modToTurnOn == 0)
      modToTurnOn = 1;
    boolean assigned = false;
    //Assign a new modifier. If that mod is already on, find the next one that isnt
    for(int i =0; i < modifiers.length; i++){
      if(modifiers[modToTurnOn]== 0){
         modifiers[modToTurnOn] = 1; 
         //If Blocker drawing is now on, assign random width and pos.
         if(modToTurnOn == 1){
            blockerXPos = int(random(100, 700));
            blockerYPos = int(random(25, 600));
            blockerWidth = int(random(300, 500));
         }
         //Enemies speed up
         else if(modToTurnOn == 3){
             //Try threading to not hurt timing?
             thread("setSpeedUp");
             speedMod = 2.0f;
         }
         assigned = true;
      }
      else{
        modToTurnOn++;
        if(modToTurnOn >= modifiers.length)
          modToTurnOn = 0;
      }
      if(assigned){
        println("MOD ON: " + modToTurnOn);
        return;
      }
    }
  }
}

void turnOffModifier(){
  //slowOnHelp(0.25f);
 int modToTurnOff = int(random(0, numNegativeModsOn));
 
 for(int i = 0; i < modifiers.length; i++){
   if(modifiers[modToTurnOff] == 1){
     modifiers[modToTurnOff] = 0;
     
     if(modToTurnOff == 2){
         for (int j = fakeAsteroids.size() - 1; j >= 0; j--) {
          if (fakeAsteroids.get(j).dead()) {
            fakeAsteroids.remove(j);
          }
        }
     }
     else if(modToTurnOff == 3){
      thread("resetSpeed"); 
      speedMod = 1.0f;
     }
     
     return;
   }
   else{
    modToTurnOff++;
    if(modToTurnOff >= modifiers.length)
      modToTurnOff = 0;
  }
 }
   
  slowDown = true;
  slowTimer = 0.0f;
  if(numNegativeModsOn > 0){
      numNegativeModsOn--;
  }
}

//Speed Up all enemies
void setSpeedUp(){
  for (int i = asteroids.size() - 1; i >= 0; i--) {
    asteroids.get(i).setSpeedMod(2.0f);
  }
  
  for (int i = fakeAsteroids.size() - 1; i >= 0; i--) {
    fakeAsteroids.get(i).setSpeedMod(2.0f);
  }
}

//reset speed mod
void resetSpeed(){
    for (int i = asteroids.size() - 1; i >= 0; i--) {
    asteroids.get(i).setSpeedMod(1.0f);
  }
  
  for (int i = fakeAsteroids.size() - 1; i >= 0; i--) {
    fakeAsteroids.get(i).setSpeedMod(1.0f);
  }
}

//Slow Down Enemies, or when help ends pass in 1.0f to return speed
void slowOnHelp(float slowMod){
  for (int i = asteroids.size() - 1; i >= 0; i--) {
    asteroids.get(i).slowDown(slowMod);
  }
  
  for (int i = fakeAsteroids.size() - 1; i >= 0; i--) {
    fakeAsteroids.get(i).slowDown(slowMod);
  }
}

void drawBlocker(){
  fill(255,0,0);
  rect(blockerXPos, blockerYPos, blockerWidth/2, blockerWidth/2);
  noFill();
}
