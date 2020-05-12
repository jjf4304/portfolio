/**
Main.cpp
Author: Joshua Fredrickson

The main cpp file for the project. Sets up the Box2D world,
walls, and the snake physics objects. Also contains the game
loop, calling methods from snake.cpp to affect the world.

*/
#include <iostream>
#define SFML_STATIC
#include <SFML/Window.hpp>
#include <SFML/Graphics.hpp>
#include <Box2D/Box2D.h>
#include <conio.h>
#include "snake.h"

#define _CRTDBG_MAP_ALLOC
#include <cstdlib>
#include <crtdbg.h>

using namespace std;

void wrapper() {
    float32 width = 5.0f;
    float32 height = 5.0f;

    //World creation
    b2Vec2 gravity(0.0f, -2.0f);

    b2World world(gravity);

    //Creation of Walls
    //Make bodydef, set up body, set up shape, then set up fixture
    b2BodyDef groundDef, leftWallDef, rightWallDef, ceilingDef;
    groundDef.position.Set(0.0f, -height - 1.0f);
    leftWallDef.position.Set(-width - 1.0f, 0.0f);
    rightWallDef.position.Set(width + 1.0f, 0.0f);
    ceilingDef.position.Set(0.0f, height + 1.0f);

    b2Body* theGround = world.CreateBody(&groundDef);
    b2Body* theLeftWall = world.CreateBody(&leftWallDef);
    b2Body* theRightWall = world.CreateBody(&rightWallDef);
    b2Body* theCeiling = world.CreateBody(&ceilingDef);

    b2PolygonShape groundBox, leftBox, rightBox, ceilingBox;
    groundBox.SetAsBox(width, 0.5f);
    leftBox.SetAsBox(.5f, height);
    rightBox.SetAsBox(.5f, height);
    ceilingBox.SetAsBox(width, .5f);

    theGround->CreateFixture(&groundBox, 0.0f);
    theLeftWall->CreateFixture(&leftBox, 0.0f);
    theRightWall->CreateFixture(&rightBox, 0.0f);
    theCeiling->CreateFixture(&ceilingBox, 0.0f);

    //Simulation Variables
    float timestep = 1.0f / 60.0f;
    int32 velocityIterations = 6;
    int32 positionIterationc = 2;

    //Snake creation
    //Make bodyDef, set up type so it can be dynamic, create body,
    //create shape, create fixture
    b2BodyDef snakeDef;
    snakeDef.type = b2_dynamicBody;
    snakeDef.position.Set(0.0f, 0.0f);
    b2Body* snakeBody = world.CreateBody(&snakeDef);

    b2PolygonShape snakeBox;
    snakeBox.SetAsBox(.5f, .5f);

    b2FixtureDef snakeFixtureDef;
    snakeFixtureDef.shape = &snakeBox;
    snakeFixtureDef.density = 1.0f;
    snakeFixtureDef.friction = .3f;

    snakeBody->CreateFixture(&snakeFixtureDef);

    //create target
    b2Vec2 target;
    srand(time(NULL));
    moveTarget(&target, width, height);

    //Variables for use in game loop
    bool gameEnd = false, endedWithESC = false;
    char input;
    int numTargetsGotten = 0, countKeyPresses = 0;
    float minDistance = .1f;
    float32 sideForce = 10.0f, upForce = 50.0f;

    //Display the intro. Wait for any input before starting
    cout << "Welcome to the game Gravity Snake! Console Version!" << endl <<
        "hissssssss.... *cough* ahem, yes" << endl;
    cout << "To play, you will use the A and D key to move left and right." <<
        " Press Space to jump." << endl;
    cout << "Try to get your snake to the target position twice! After the" <<
        " first time, the target will move. Press ESC to end early" << endl;

    system("pause");


    //Main game loop. 
    //If there is any input, check to see if it is a ESC press, otherwise
    //go into applyForces. After, check if the snake is close enough to the 
    //target to collide. If so, move the target to somewhere else. Finally, 
    //the Box2d world and display the position of the target and the snake.
    //Once two targets are hit or the ESC key is pressed, the game loop ends,
    //showing the end statements.

    while (!gameEnd) {
        if (_kbhit()) {
            input = _getch();
            //Escape is put to 
            if (input == 27) {
                gameEnd = true;
                endedWithESC = true;
            }
            else
                countKeyPresses += applyForces(snakeBody, input, upForce, sideForce);
        }
        if (checkDistance(minDistance, target, snakeBody->GetPosition())) {
            numTargetsGotten++;
            if (numTargetsGotten >= 2)
                gameEnd = true;
            else
                moveTarget(&target, width, height);
        }
        update(&world, timestep, velocityIterations, positionIterationc);
        display(snakeBody->GetPosition(), target, numTargetsGotten);

    }

    //End game output, showing the amount of keypresses if the game ended by 
    //hitting the targets.
    if (!endedWithESC)
        cout << endl << "Congratulations! You won with " << countKeyPresses <<
        " key presses. See if you can win with less next time!";
    cout << endl << "Thanks for playing!" << endl;

    //Set pointers to null in case of issue
    theGround = nullptr;
    theLeftWall = nullptr;
    theRightWall = nullptr;
    theCeiling = nullptr;
}

int main()
{

    wrapper();

    //check for memory leaks, only ones I can see are false
    //positives that using a temp wrapper in testing showed not
    //to be there.
    _CrtDumpMemoryLeaks();
}

