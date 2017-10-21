pragma solidity ^0.4.4;

contract Foo {
    uint public foo;

    struct FirstLineWrong {
      string baz;
        string qux;
        string quux;
    }

    struct SecondLineWrong {
        string baz;
      string qux;
        string quux;
    }

    struct ThirdLineWrong {
        string baz;
        string qux;
      string quux;
    }

    struct AllLinesWrong {
      string baz;
      string qux;
      string quux;
    }

  struct WholeDeclarationWrong {
    string baz;
    string qux;
    string quux;
  }

    function setFoo(uint _foo) {
        foo = _foo;
    }
}
