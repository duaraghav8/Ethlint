/**
 * @fileoverview Function to explore the given directory and its sub-directories to discover all the .sol files
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var path = require ('path'),
	fs = require ('fs');

module.exports = function traverse (currentDir, allFiles) {

	var currentDirItems = fs.readdirSync (currentDir);
	var SOL_EXT = '.sol';

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