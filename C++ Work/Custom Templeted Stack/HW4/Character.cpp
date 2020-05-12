/*
Author: Joshua Fredrickson

A class made to test whether or not my stack can handle custom objects. All functionality
works as long as the << operator is overriden for the class, which it is here. Also provides
a default and parameter constructor for a Character, a destructor, and an assignment operator


*/

#include "Character.h"

//Character constructor
Character::Character(string _name, string _class, int _level)
{
	name = _name;
	charClass = _class;
	level = _level;
}

//Character Default constructor
Character::Character()
{
	name = "Jeff";
	charClass = "NPC";
	level = 0;
}

//Character assignment operator override
//At time of writing I realize this was likely not needed, but if so, it was extra practice I suppose.
Character& Character::operator=(const Character& other)
{
	if (this == &other) {
		return *this;
	}

	name = other.name;
	level = other.level;
	charClass = other.charClass;

	return *this;
}

//Overriding << operator with a friend function. Allows cout to print the data about the character.
ostream& operator<<(ostream& ostr, Character const& rightSide)
{
	//// TODO: insert return statement here
	string out = rightSide.name + " is a level " + std::to_string(rightSide.level) + " " + rightSide.charClass;
	ostr << out;
	return ostr;
}
