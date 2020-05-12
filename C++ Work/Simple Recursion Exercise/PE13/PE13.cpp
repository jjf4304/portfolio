#include <iostream>

//Iteration method. for loop from 1 to n, the number of seats. 
//If the current seat is even, add 4 to total hands, else add 3. 
int iteration(int n) {
    int totalHands = 0;
    for (int currentSeat = 1; currentSeat <=n; currentSeat++) {
        totalHands += (currentSeat % 2 == 0) ? 4 : 3;
    }
    return totalHands;
}

//recursive method. First run, send in the total number of seats, check if it's an
//even seat or an odd seat and assign number of hands accordingly.  Then if the seat number
//is greater than 1, recurse with current seat number minus 1. Else, just return the current seat's
//number of hands.
int recursive(int n) {
    int totalHands = (n % 2 ==0 ) ? 4 : 3;
    if (n > 1)
        return totalHands + recursive(n - 1);
    else
        return totalHands;
}

//Integer divide by 2 to get how many even numbered seats there are. Then subtract that
//from the total number of seats to get how many odd numbered seats there are. Multiply 
//the number of even seats by 4, the number of odd seats by 3, then add the two totals 
//together.
int formula(int n) {
    int totalHands = 0;
    int evenSeats = (int)n / 2;
    int oddseats = n - evenSeats;
    totalHands += evenSeats*4;
    totalHands += oddseats * 3;
    return totalHands;
}


int main()
{
    std::cout << "Iterative: " << iteration(3) << std::endl;
    std::cout << "Recursive: " << recursive(3) << std::endl;
    std::cout << "Formula: " << formula(3) << std::endl;
}
