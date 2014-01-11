#!/usr/bin/env node

"use strict";

/*!
 * debug device_parsers regular expressions
*/

/**
 * Dependencies
 */
var
  cli     = require('cli'),
  cliconv = require('./lib/util/cliconvert.js').convert,
  main    = require('./lib/device.js').main;

/**
 * command line interface
 */
cli.parse({
  ua:        [ 'u', 'Read user-agent strings from file', 'path' ],
  out:       [ 'o', 'Write output files .cvs, .log', 'path' ],
  tc:        [ 't', 'Process testcases.' ],
  tcin:      [ false, 'Read testcases from file', 'path' ],
  tcout:     [ false, 'Write testcases to file', 'path' ],
  console:   [ 'c', 'Output to console' ],
  other:     [ false, 'Add unmatched user-agents to testcases output file' ],
  swapdebug: [ 's', 'Swap debug field in .csv output' ],
  nodebug:   [ 'd', 'Do not show debug field in .cvs output' ],
  nofamily:  [ 'f', 'Do not show family field in .csv output' ],
  noappend:  [ 'a', 'Do not append user-agent strings from -u' ], 
});

cli.main(function(args, options) {
  options = cliconv(options);
  main(options);
});
