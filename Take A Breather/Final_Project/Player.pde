class Player extends Entity{
    
  Player(int _xpos, int _ypos){
   super(_xpos, _ypos, 50, 0, 255, 255); 
   
  }
  
  void Update(int input){
    //Actual
    xPos = input;
    
    ////Movement for possible reverse
    //  xPos += input;
    //   println(input);
    //  if(xPos >= width){
    //     xPos = width-10; 
    //  }
    //  else if(xPos < 0){
    //     xPos = 10; 
    //  }
      
      int leftCornerX = xPos - (entityWidth/2);
      int leftCornerY = yPos + (entityWidth/2);
      int topX = xPos;
      int topY = yPos - (entityWidth/2);
      int rightCornerX = xPos + (entityWidth/2);
      int rightCornerY = yPos + (entityWidth/2);
      fill(r,g,b);
      triangle(leftCornerX, leftCornerY, topX, topY, rightCornerX, rightCornerY);
      noFill();
  }
  
}
