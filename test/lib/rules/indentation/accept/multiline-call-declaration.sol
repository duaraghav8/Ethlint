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

    // TODO: Uncomment below code once Issue #268 is resolved
    /*
    function abstractFunc1()
        payable
        returns(uint, string);

    function abstractFunc2(
        uint foo,
        string bar
    ) payable;

    function abstractFunc2(
        uint bax,
        uint bar
    )
        payable
        returns(string);
    */
}
