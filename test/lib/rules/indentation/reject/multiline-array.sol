pragma solidity ^0.4.4;

contract Counter {
    uint[] public array;

    function allItemsWrong() {
        array = [
          1,
          2,
          3
        ];
    }

    function firstItemWrong() {
        array = [
          1,
            2,
            3
        ];
    }

    function secondItemWrong() {
        array = [
            1,
          2,
            3
        ];
    }

    function thirdItemWrong() {
        array = [
            1,
            2,
          3
        ];
    }

    function wholeLineWrong() {
      array = [
          1,
          2,
          3
      ];
    }
}
