class Bullet extends Entity{
  
  int speed;
  
  Bullet(int _xpos, int _ypos){
     super(_xpos, _ypos, 30, 255, 255, 0); 
     
     speed = 300;
  }
  
  void Update(float deltaTime, ArrayList<Asteroid> asteroids){
    yPos -= speed * deltaTime;
    fill(r,g,b);
    ellipse(xPos, yPos, entityWidth/2, entityWidth/2);
    noFill();
    
    for(int i = 0; i < asteroids.size(); i++){
       Asteroid asteroid = asteroids.get(i);
       
       if(checkCollision(asteroid)){
          asteroid.collide();
          collide();
          break;
       }
    }
  }
  
}
