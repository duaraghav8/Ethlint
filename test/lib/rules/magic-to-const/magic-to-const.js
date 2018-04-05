/**
 * @fileoverview Tests for magic numbers checking rule
 * @author Ivan Mushketyk <ivan.mushketik@gmail.com>
 */

"use strict";

let wrappers = require("../../../utils/wrappers");
let acceptanceCases = wrappers.acceptanceCases;
let rejectionCases = wrappers.rejectionCases;

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "magic-to-const": true
    }
};

acceptanceCases("magic-to-const", userConfig,
    [
        "uint constant x = 123;",
        "uint a = 1; uint b = 0; uint c = -1;",
        "string a = \"abc\";",
        "string a = \"1\";"
    ]
);

rejectionCases("magic-to-const", userConfig,
    [
        "uint a = 5;"
    ]
);