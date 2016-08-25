import "filename" as symbolName;

contract Halo {
	function foo () {
		import {symbol1 as alias, symbol2} from "filename";

		if (true) {
			import "filename";
		}
	}
}

import * as symbolName from "filename";