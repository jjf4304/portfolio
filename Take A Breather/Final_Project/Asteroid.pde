
class Asteroid extends Entity{
  
  float speed;
  float speedMod;
  float slowMod;
  
  int windowHeight;
  boolean collidable;
  //static int gameWindowWidth;
  
  Asteroid(int _xpos, int _ypos, int _width, int _r, int _g, int _b, boolean _collidable, float _speedMod){
      super(_xpos, _ypos, _width, _r, _g, _b);
      
      speed = 100;
      slowMod = 1;
      speedMod = _speedMod;
      collidable = _collidable;
  }
  
  int Update(float deltaTime, Player player){
     yPos += (speed * speedMod * slowMod) * deltaTime; 
     fill(r,g,b);
     ellipse(xPos, yPos, entityWidth/2, entityWidth/2);
     noFill();
     
     if(yPos >= height + entityWidth/2){
         collide();
     }
     
     if(collidable && checkCollision(player)){
         collide();
         return 1;
     }
     
     //Change this later? For Collisions
     return -1;
  }
  
  void setSpeedMod(float _speedMod){
    speedMod = _speedMod;
  }
  
  void slowDown(float _slowMod){
    slowMod = _slowMod;
  }
  
}
