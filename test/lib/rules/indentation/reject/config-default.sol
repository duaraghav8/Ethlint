pragma solidity ^0.4.4;

contract Foo {
    uint public a;
    uint public b;
    uint public c;

    function singleLineWrong() {
      a = 1;

      other.call(
      'transferFrom',
      myAddress,
      this,
      bond
      );
    }

    function firstLineWrong() {
      a = 1;
        b = 2;
        c = 3;
    }

    function secondLineWrong() {
        a = 1;
      b = 2;
        c = 3;
    }

    function thirdLineWrong() {
        a = 1;
        b = 2;
      c = 3;
    }

    function allLinesWrong() {
      a = 1;
      b = 2;
      c = 3;
    }

    function chainedFunctions() {
        myObj
            .foo()
          .bar(100, "hello");

        myObj
            .foo()
              .bar(100, "hello");
    }

    function abstractFunc()
        payable
      returns (uint, bytes32);

    function abstractFunc()
        payable
          returns (uint, bytes32);
}
