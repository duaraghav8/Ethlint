pragma solidity ^0.4.4;

library GetCode {
    function at(address _addr) public view returns (bytes memory o_code) {
        assembly {
            let len := mload(_data)

            let data := add(_data, 0x20)

            for
                { let end := add(data, mul(len, 0x20)) }
                lt(data, end)
                { data := add(data, 0x20) }
            {
                sum := add(sum, mload(data))
            }
        }
    }
}