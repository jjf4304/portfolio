/*
Author: Joshua Fredrickson

A class made to test whether or not my stack can handle custom objects. All functionality
works as long as the << operator is overriden for the class, which it is here. Also provides
a default and parameter constructor for a Character, a destructor, and an assignment operator 


*/

#pragma once
#include <string>
#include <iostream>

using namespace std;

class Character
{
public:
	Character(string _name, string _class, int _level);
	Character();
	
	friend ostream& operator<<(ostream& ostr, Character const& rightSide);

	Character& operator=(const Character& other);

private:

	string name;
	string charClass;
	int level;
};

