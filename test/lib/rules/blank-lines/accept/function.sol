contract A {
    function spam();
    function ham();
    constructor(uint x, string foobar){}
    function(){}
    function baba(){}
}


contract B is A {
	struct Chumma {
		uint x;
	}
	
    function spam() {

    }

    function ham() {

    }

    constructor(address baz) {

    }

    function(uint x) {

    }

    function lola() {

    }
}


contract Chumma {
    /// @notice this function returns something important
    /// @return description
    function someFunction() constant returns(uint256) {
        return 1;
    }

    function() {
        // just a fallback function :)
    }

    /// @notice gets something else important
    function anotherFunction() constant returns(uint256)
    {
        return 2;
    }

    constructor(address owner, uint age) public payable {
        if (true) { lol(); }
    }

    /**
     * @notice this function returns something important
     * @return description
     */
    function yetAnotherFunction() constant returns(uint256)
    {
        return 3;
    }
}