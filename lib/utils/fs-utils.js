/**
 * @fileoverview Utility functions for working with files
 * @author Federico Bond <federicobond@gmail.com>
 */

"use strict";

let fs = require("fs");

module.exports = {

    isDirectory(path) {
        try  {
            return fs.statSync(path).isDirectory();
        } catch (e) {
            if (e.code === "ENOENT") {
                return false;
            }
            throw e;
        }
    },

    isFile(path) {
        try  {
            return fs.statSync(path).isFile();
        } catch (e) {
            if (e.code === "ENOENT") {
                return false;
            }
            throw e;
        }
    }
};
