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
	through = require('./lib/util/through'),
	split = require('./lib/util/split'),
	sorter = require('./lib/util/sorter');

var sorterOptions = {
	sorter: [ 
		/^Mozilla\/\d\.0 .*(?:AppleWebKit|Chrome|Gecko)/, 
		/^Mozilla\/\d/, 
		/^Mozilla/,
		/Mozilla/ 
	],
	log: cli.info
};

/**
 * command line interface
 */
cli.parse({
	ua:   [ 'u', 'Read user-agent strings from file', 'path' ],
	out:  [ 'o', 'Write output file', 'path' ],
});

cli.main(function(args, options) {
	options.out = path.resolve(__dirname, ( options.out || 'report/sorted.txt'));

	if (! options.ua) {
		cli.error('need -u as option');
		return;
	}

	fs.createReadStream(options.ua)
		.pipe(split())
		.pipe(sorter.sort(sorterOptions))
		.pipe(fs.createWriteStream(options.out))
		.on('close', function(){
			cli.ok('writing output to "'+ options.out +'"');
		});
});

