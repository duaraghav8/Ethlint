/**
 * @fileoverview Function to explore the given directory and its sub-directories to discover all the .sol files
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var path = require ('path'),
	fs = require ('fs'),
	SOL_EXT = '.sol';

/**
 * Traverse the specified directory and its sub-directories to find all files with .sol extension
 * @param {String} currentDir The starting point for traversal
 * @param {Array} allFiles The List containing names of all explored .sol files during the traversal
 */
module.exports = function traverse (currentDir, allFiles) {

	var currentDirItems = fs.readdirSync (currentDir);

	currentDirItems.forEach (function (item) {
		var absoluteItemPath = path.join (currentDir, item);

		if (item === 'node_modules') {
			return;
		}

		if (fs.lstatSync (absoluteItemPath).isDirectory ()) {

			traverse (absoluteItemPath, allFiles);

		} else if (path.extname (absoluteItemPath) === SOL_EXT) {

			allFiles.push (absoluteItemPath);

		}
	});

};