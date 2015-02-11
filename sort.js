#!/usr/bin/env node

"use strict";

/*!
 * Sorting User-Agents
 */

/**
 * Dependencies
 */
var fs = require('fs'),
	cli = require('cli'),
	path = require('path'),
	through = require('streamss').Through,
	split = require('streamss').Split,
	sorter = require('./lib/util/sorter');

var sorterOptions = {
	sorter: [
		/^Mozilla\/\d\.0 .*(?:AppleWebKit|Chrome|Gecko)/,
		/^Mozilla\/\d/,
		/^Mozilla/,
		/Mozilla/
	]
};

/**
 * command line interface
 */
cli.parse({
	ua:   [ 'u', 'Read user-agent strings from file', 'path' ],
	out:  [ 'o', 'Write output file', 'path' ],
});

cli.main(function(args, options) {
	var sIn  = process.stdin,
			sOut = process.stdout;

	if (options.ua) {
		sIn = fs.createReadStream(options.ua);
	}
	if (options.out) {
		sOut = fs.createWriteStream(path.resolve(__dirname, options.out));
		options.log = cli.info;
	}

	sIn
		.pipe(split())
		.pipe(sorter.sort(sorterOptions))
		.pipe(sOut)
		.on('close', function(){
			cli.ok('writing output to "'+ options.out +'"');
		});
});

