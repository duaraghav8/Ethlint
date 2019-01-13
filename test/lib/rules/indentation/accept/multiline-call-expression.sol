pragma solidity ^0.4.4;

contract Counter {
    uint public count;

    function Counter() {
        count = 0;
    }

    function inc() {
        count++;
    }

    function incBy(uint n) {
        count = count + n;
    }

    function incByTwo() {
        incBy(
            2
        );
    }

    function pack(uint32 param1, uint16 param2, uint32 param3) public pure returns(bytes32) {
        return bytes32(
            (uint256(param1) << 128) |
            (uint256(param2) << 64) |
            (uint256(param3) << 32)
        );
    }
}
