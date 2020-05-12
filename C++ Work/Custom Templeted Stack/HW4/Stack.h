/*
Author: Joshua Fredrickson

The header file for the templated Stack class. A template class,
it is designed to function like the std::stack object. Contains functionality
for FILO ordering with pushing new data onto the stack, popping the most
recent object from the stack, printing the elements of the stack,
getting data about the stack, and the creation/destruction of a Stack
object.
*/



#pragma once
#include <iostream>

using namespace std;


template <class Item>
class Stack
{
public:
	//Base constructor, creates a array of size 1 and sets numElements to 0 
	Stack() {
		maxSize = 1;
		numElements = 0;
		stackData = new Item[maxSize];
	};

	//Copy Constructor for a Stack. 
	Stack(const Stack& other) {
		maxSize = other.maxSize;
		numElements = other.numElements;
		stackData = new Item[maxSize];

		for (int i = 0; i < numElements; i++) {
			stackData[i] = other.stackData[i];
		}
	};

	//Assignment operator of a stack
	Stack& operator=(const Stack& other) {

		//Assigning to itself check.
		if (this == &other) {
			return *this;
		}

		if (stackData != nullptr) {
			delete[] stackData;
			stackData = nullptr;
			numElements = 0;
			maxSize = 0;
		}

		maxSize = other.maxSize;
		numElements = other.numElements;
		stackData = new Item[maxSize];
		for (int i = 0; i < numElements; i++) {
			stackData[i] = other.stackData[i];
		}

		return *this;

	};

	//Stack Desctuctor
	~Stack() {
		delete[] stackData;
		stackData = nullptr;
		maxSize = 0;
		numElements = 0;
	};

	//Pushes an item onto the stack in front of the stack. If the stack array is not
	//big enough to hold more data, create a new stack of twice the size, copy over the
	//elements, and assign that to the old stack pointer.
	void push(Item _item) {

		//resize array
		if (numElements + 1 >= maxSize) {
			maxSize *= 2;

			Item *temp = new Item[maxSize];
			for (int i = 0; i < numElements; i++) {
				temp[i] = stackData[i];
			}

			delete[] stackData;
			stackData = temp;
		}

		//add to end of array
		stackData[numElements] = _item;
		numElements++;
	};

	//Method to remove and return the most recent item from the stack. As long as the stack is not
	//empty, it will subtract one from the current numElements to represent the loss of a position
	//and return that item that was "removed". If pop is called on an empty stack an error is thrown
	Item pop() {
		if (!isEmpty()) {
			Item lastItem = stackData[numElements];
			numElements--;

			return lastItem;
		}
		else {
			//If the stack is empty, throw an exception. 
			throw -1;
		}
	};

	//Print the elements in the stack. As long as the stack is not empty, print the elements to the console.
	void print() {
		if (!isEmpty()) {
			cout << stackData[0];
			for (int i = 1; i < numElements; i++) {
				cout << ", " << stackData[i];
			}

			cout << endl;
		}
	};

	//return the current number of elements in the stack.
	int getSize() {
		return numElements;
	};

	//return true if the number of elements in the stack is zero, else return false.
	bool isEmpty() {
		return (numElements == 0 ? true : false);
	};


private:

	Item* stackData;
	int maxSize;
	int numElements;

};

