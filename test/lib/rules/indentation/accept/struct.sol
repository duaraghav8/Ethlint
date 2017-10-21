pragma solidity ^0.4.4;

contract Foo {
    uint public foo;

    struct Bar {
        string baz;
        string qux;
    }

    function setFoo(uint _foo) {
        foo = _foo;
    }
}
