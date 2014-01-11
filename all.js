#!/usr/bin/env node

"use strict";

/*!
 * debug regular expressions for
 * ua_parser
 * os_parser
 * device_parsers
 */

/**
 * Dependencies
 */
var
  cli       = require('cli'),
  cliconv   = require('./lib/util/cliconvert.js').convert,
  debuginfo = require('./debuginfo.js'),
  main_ua   = require('./lib/ua.js').main,
  main_os   = require('./lib/os.js').main,
  main_dev  = require('./lib/device.js').main;

/**
 * command line interface
 */
cli.parse({
  ua:        [ 'u', 'Read user-agent strings from file', 'path' ],
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
  var fileChanged;
  
  options = cliconv(options);
  fileChanged = debuginfo(true);
  main_ua(options);
  main_os(options);
  main_dev(options);
  if (fileChanged) {
    debuginfo(false);
  }
});
