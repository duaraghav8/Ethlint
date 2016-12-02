contract A {
    function spam();
    function ham();
}


contract B is A {
	struct Chumma {
		uint x;
	}
	
    function spam() {

    }

    function ham() {

    }
}


contract Chumma {
    /// @notice this function returns something important
    /// @return description
    function someFunction() constant returns(uint256) {
        return 1;
    }

    /// @notice gets something else important
    function anotherFunction() constant returns(uint256)
    {
        return 2;
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