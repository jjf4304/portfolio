class Entity{
   int xPos;
   int yPos;
   int r;
   int b;
   int g;
   
   int entityWidth;
   
   boolean collided;
   
   Entity(int _xpos, int _ypos, int _width, int _r, int _g, int _b){
     this.xPos = _xpos;
     this.yPos = _ypos;
     this.entityWidth = _width;
     this.r = _r;
     this.g = _g;
     this.b = _b;
     
     collided = false;
   }
   
   int getXPos(){
     return this.xPos;
   }
   
   int getYPos(){
     return this.yPos; 
   }
   
   int getWidth(){
      return this.entityWidth; 
   }
   
   boolean dead(){
      return  collided;
   }
   
   void collide(){
     collided = true;
   }
   
   boolean checkCollision(Entity other){
     int collisionRadius = other.getWidth()/2 + getWidth()/2;
     collisionRadius *= collisionRadius;
     
     float distance = pow(other.getXPos() - xPos, 2) + pow(other.getYPos() - yPos, 2);
     
     if(collisionRadius >= distance)
        return true;
     else
       return false;
  }
}
     
