/*
Author: Joshua Fredrickson
HW4.cpp

The file that contains the main method and wrapper function. Creates custom stacks of 
Ints, Strings, Floats and of a custom Character Class. Tests pushing, popping, and printing 
with these stacks, as well as creating stacks from constructors, copy constructors, and using
the assignment operator.



*/



#define _CRTDBG_MAP_ALLOC
#include <iostream>
#include <cstdlib>
#include <crtdbg.h>
#include <string>
#include "Stack.h"
#include "Character.h"

using namespace std;

void wrapper() {
	//Start integer stack testing.
	cout << "---------------Int Testing---------------" << endl << endl;
	//Create with base constructor
	Stack<int>* intStack1 = new Stack<int>();
	intStack1->push(13);
	intStack1->push(42);
	intStack1->push(20);
	cout << "Printing Int Stack 1:" << endl;
	intStack1->print();
	intStack1->pop();
	cout << "Printing Int Stack 1 after pop: " << endl;
	intStack1->print();

	//Create stack 2 with copy constructor
	Stack<int>* intStack2 = new Stack<int>(*intStack1);

	cout << endl << "Printing Int Stack 1 and 2 (copy constructor): " << endl;
	intStack1->print();
	intStack2->print();

	//Show that they are distinct, non shallow copies
	intStack1->push(2);
	intStack2->pop();
	cout << "Printing Int Stack 1 and 2(copy constructor) after pushing Stack 1 and popping Stack 2: " << endl;
	intStack1->print();
	intStack2->print();

	//Create stack 3 with assignment operator
	Stack<int> intStack3 = *intStack1;

	cout << endl << "Printing Int Stack 1 and 3 (assignment operator): " << endl;
	intStack1->print();
	intStack3.print();

	cout << "Pushing to Int Stack 3 to show they are different: " << endl;
	intStack3.push(300);
	intStack1->print();
	intStack3.print();

	cout << endl << "Assigning Int Stack 3 to Int Stack 2 then printing: " << endl;
	intStack3 = *intStack2;

	intStack2->print();
	intStack3.print();

	cout << endl << "Pushing 300 to Int Stack 3 and printing Int Stack 3 and 2: " << endl;

	intStack3.push(300);
	intStack2->print();
	intStack3.print();


	//Start String Stack Testing
	cout << endl << endl << "---------------String Testing---------------" << endl << endl;

	//Create String STack
	Stack<string>* stringStack = new Stack<string>();
	stringStack->push("Waaaaaagh");
	stringStack->push("sad racoon");
	cout << "Printing String Stack: " << endl;
	stringStack->print();
	stringStack->pop();
	cout << "Printing String Stack after pop: " << endl;
	stringStack->print();

	//Start Float Testing
	cout << endl << endl << "---------------Float Testing---------------" << endl << endl;
	
	//Create FLoat Stack
	Stack<float>* floatStack = new Stack<float>();
	floatStack->push(1.5);
	floatStack->push(12.99);
	floatStack->push(74.123);
	floatStack->push(789.123);
	floatStack->push(0.121);
	cout << "Printing float Stack: ";
	floatStack->print();
	floatStack->pop();
	cout << "Printing float Stack after pop: ";
	floatStack->print();
	
	//Start Character Class Stack Testing
	cout << endl << endl << "---------------Custom Character Class Testing---------------" << endl << endl;
	Stack<Character>* charStack = new Stack<Character>();
	charStack->push(Character("Jerryn", "Fighter", 5));
	charStack->push(Character("Rissa", "Warlock", 6));
	charStack->push(Character("Onne", "Battle Rager", 5));
	cout << "Printing Character Stack: " << endl;
	charStack->print();
	charStack->pop();
	charStack->pop();

	cout << "Printing Character Stack after pop: " << endl;
	charStack->print();

	cout << "Testing Copy Constructor for Character Stack: " << endl;
	Stack<Character>* charStack2 = new Stack<Character>(*charStack);

	charStack->print();
	charStack2->print();

	charStack2->push(Character("Xael", "Paladin", 7));

	cout << "Printing Character Stack 1 and 2 (copy constructor) to check that it's not shallow: " << endl;
	charStack->print();
	charStack2->print();

	cout << "Testing Assignment Operator Assigning Char Stack 3 to Stack 1: " << endl;

	Stack<Character> charStack3 = *charStack;
	charStack->print();
	charStack3.print();

	cout << "Pushing to Char Stack 3: " << endl;
	charStack3.push(Character("Murph", "Cleric", 6));

	charStack->print();
	charStack3.print();

	cout << "Setting Char Stack 3 to Stack 2: " << endl;
	charStack3 = *charStack2;
	charStack2->print();
	charStack3.print();

	cout << "Pushing to Char Stack 3: " << endl;
	charStack3.push(Character("Rila", "Black Mage", 30));
	charStack2->print();
	charStack3.print();


	//Deleting all pointers
	delete intStack1;
	delete intStack2;
	delete stringStack;
	delete floatStack;
	delete charStack;
	delete charStack2;

	intStack1 = nullptr;
	intStack2 = nullptr;
	stringStack = nullptr;
	floatStack = nullptr;
	charStack = nullptr;
	charStack2 = nullptr;
}

int main()
{
	wrapper();
	_CrtDumpMemoryLeaks();

}

