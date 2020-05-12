/*
snake.cpp 
Author: Joshua Fredrickson

The implementation of the functions declared in snake.h. Functions to affect
the physics state of the world and bodies in it. Includes a update function,
function to display the game info, apply forces on input, move the target on 
collision, and check the distance between the snake and the target.

*/


#include <Box2D/Box2D.h>
#include <conio.h>

//Update the Box2D World based on the timestep and velocity/position iterations
void update(b2World* theWorld, float32 timeStep, int32 velIter, int32 posIter) {
	theWorld->Step(timeStep, velIter, posIter);
}

//display the target position and snake position to the console
void display(b2Vec2 snakePos, b2Vec2 targetPos, int numTargetsHit) {
	system("CLS");
	printf("Target: %4.2f, %4.2f --- Snake: %4.2f, %4.2f --- You have gotten %i of 2 Targets.", targetPos.x, targetPos.y, snakePos.x, snakePos.y, numTargetsHit);
}

//Function to apply forces to the snake body when a user presses a 
//non-ESC key. Apply force depending on what input the user gives.
// A applies force to move to the left, D applies force to move to
//the right, and Space applies force upwards.
int applyForces(b2Body* snake, char input, float32 upForce, float32 sideForce) {
	b2Vec2 force(0.0f, 0.0f);
	int keyPressResult = 0;
	switch (input) {
	case 'a':
		force.x = -sideForce;
		keyPressResult = 1;
		break;
	case 'd':
		force.x = sideForce;
		keyPressResult = 1;
		break;
	case ' ':
		force.y = upForce;
		keyPressResult = 1;
		break;
	default:
		break;
	}
	snake->ApplyForceToCenter(force, true);
	return keyPressResult;
}

//Function to move the target to a new location once the snake 
//has collided with the target. Assigns the x and y values to random numbers
//Help with the random algorithm comes from https://www.tutorialspoint.com/how-do-i-generate-random-floats-in-cplusplus
//by Samual Sam in order to get random floating point number between 0 and 1, the rest is me.
void moveTarget(b2Vec2* target, float32 width, float32 height) {
	float32 targetX = (float(rand()) / float((RAND_MAX)));
	if (rand() % 2 == 0)
		targetX *= width;
	else
		targetX *= -width;
	float32 targetY = (float(rand()) / float((RAND_MAX)));
	if (rand() % 2 == 0)
		targetY *= height;
	else
		targetY *= -height;
	target->x = targetX;
	target->y = targetY;
}

//Checks if the distance between the snake and the target is close enough to have collided.
bool checkDistance(float minDistBTW, b2Vec2 targetPos, b2Vec2 snakePos) {
	float32 distance = sqrt(pow(targetPos.x - snakePos.x, 2) + pow(targetPos.y - snakePos.y, 2));
	if (distance <= minDistBTW)
		return true;
	else
		return false;
}