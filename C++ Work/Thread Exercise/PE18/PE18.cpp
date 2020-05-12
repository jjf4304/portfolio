#include <thread>
#include <vector>
#include <iostream>
#include "NumberPrinter.h"
#include "Gameplay.h"

using namespace std;

int main()
{
	vector<thread*> list;

	//Creating 50 threads to print out from the NumberPrinter Class
	for (int i = 0; i < 50; i++) {
		NumberPrinter numPrint  = NumberPrinter(i);
		//numPrint.Print();
		thread* _thread = new thread(&NumberPrinter::Print, numPrint);
		//_thread->detach();
		list.push_back(_thread);
	}

	//Joining and deleting threads
	for (int i = 0; i < list.size(); i++) {
		list[i]->join();
		delete list[i];
	}

	Gameplay physics("Physics");
	Gameplay ai("AI");
	Gameplay spawner("Spawner");
	Gameplay controller("Controller");
	Gameplay scoretrack("Score Tracker");

	vector<thread*> threadlist;

	threadlist.push_back(new thread(&Gameplay::Update, physics));
	threadlist.push_back(new thread(&Gameplay::Update, ai));
	threadlist.push_back(new thread(&Gameplay::Update, spawner));
	threadlist.push_back(new thread(&Gameplay::Update, controller));
	threadlist.push_back(new thread(&Gameplay::Update, scoretrack));

	for (int i = 0; i < threadlist.size(); i++){
		threadlist[i]->join();
		delete threadlist[i];
	}

	cout << "Update complete! time to draw" << endl;

}

