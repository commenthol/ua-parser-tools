#!/usr/bin/env node

"use strict";

/*!
 * get uniq set of matched user-agents
 * requires sorting your input data with `sort.js` first
 */

/**
 * Dependencies
 */
var cli = require('cli'),
	path = require('path'),
	filter = require('./lib/util/filter.js');

/**
 * command line interface
 */
cli.parse({
	ua:   [ 'u', 'Read user-agent strings from file', 'path' ],
	out:  [ 'o', 'Write output file', 'path' ],
	type: [ 't', 'Type of parser [ua|os|device]', 'string' ],
	tree: [ 'r', 'Write tree' ],
	short: [ 's', 'Print short output (user-agents only)' ],
	ignore: [ 'i', 'Ignore debug information from `regexes.yaml`' ],
});

cli.main(function(args, options) {
	options.out = path.resolve(__dirname, ( options.out || '/reports/uniq.txt'));

	if (! options.ua) {
		cli.error('need -u as option');
		return;
	}
	if (! options.type) {
		cli.error('need -t as option');
		return;
	}
	if ( ! /^(ua|os|device)$/.test(options.type) ) {
		cli.error('only -t [ua|os|device] allowed');
		return;
	}

	filter(options, 
		path.resolve(__dirname, options.ua),
		options.out,
		function(err, data){
			if (options.tree) {
				fs.writeFileSync(__dirname + '/report/tree.json', JSON.stringify(data, null, 2));
			}
			cli.ok('writing output to "'+ options.out +'"');
		});
});
