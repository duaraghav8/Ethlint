pragma solidity ^0.4.4;

library GetCode {
    function at(address _addr) public view returns (bytes memory o_code) {
        assembly { o_code := mload(0x40) }
    }
}