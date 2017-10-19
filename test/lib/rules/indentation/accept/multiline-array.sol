pragma solidity ^0.4.4;

contract Counter {
    uint public count;
    uint[] public array;

    function Counter() {
        count = 0;
        array = [
            1,
            2,
            3
        ];
    }

    function inc() {
        count++;
    }
}
