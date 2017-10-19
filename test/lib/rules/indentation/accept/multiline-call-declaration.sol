pragma solidity ^0.4.4;

contract Counter {
    uint public count;

    function Counter() {
        count = 0;
    }

    function inc() {
        count++;
    }

    function incBy(
        uint n
    ) {
        count = count + n;
    }

    function incByTwo() {
        incBy(
            2
        );
    }
}
