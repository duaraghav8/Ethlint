pragma solidity ^0.4.4;

contract Foo {
    uint public a;
    uint public b;
    uint public c;

    function singleLineWrong() {
      a = 1;
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
}
