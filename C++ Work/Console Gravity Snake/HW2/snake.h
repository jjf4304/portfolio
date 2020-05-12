/**
snake.h header file
Author: Joshua Fredrickson

Header File for snake.cpp. Contains function declarations.

*/

#pragma once
#include <Box2D/Box2D.h>
#include <conio.h>

//Update the Box2D World based on the timestep and velocity/position iterations
void update(b2World* theWorld, float32 timeStep, int32 velIter, int32 posIter);

//display the target position and snake position to the console
void display(b2Vec2 snakePos, b2Vec2 targetPos, int numTargetsHit);

//Function to apply forces to the snake body when a user presses a 
//non-ESC key. Apply force depending on what input the user gives.
// A applies force to move to the left, D applies force to move to
//the right, and Space applies force upwards.
int applyForces(b2Body* snake, char input, float32 upForce, float32 sideForce);

//Function to move the target to a new location once the snake 
//has collided with the target. Assigns the x and y values to random numbers
void moveTarget(b2Vec2* target, float32 width, float32 height);

//Checks if the distance between the snake and the target is close enough to have collided.
bool checkDistance(float minDistBTW, b2Vec2 targetPos, b2Vec2 snakePos);