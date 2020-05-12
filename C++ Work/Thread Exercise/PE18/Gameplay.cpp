#include "Gameplay.h"

Gameplay::Gameplay(string _name)
{
	name = _name;
}

void Gameplay::Update()
{
	for (int i = 1; i < 11; i++)
		cout << name << ": " << i * 10 << "% Complete" << endl;
}
