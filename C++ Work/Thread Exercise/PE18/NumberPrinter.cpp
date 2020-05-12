#include "NumberPrinter.h"

NumberPrinter::NumberPrinter(int _num)
{
	number = _num;
}

void NumberPrinter::Print()
{
	for(int i = 0; i< 50; i++)
		std::cout << number << " ";
}
