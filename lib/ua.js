"use strict";

/*!
 * debug ua_parser regular expressions
 *
 * Note: The yamlparser stops parsing strings which contain unicode
 *       characters. To parse and dump the testcases js-yaml is used 
 *       instead.
 */

/**
 * Dependencies
 */
var
  fs        = require('fs'),
  path      = require('path'),
  fileSync  = require('./util/filesync'),
  makeLists = require('./util/makelists'),
  extend    = require('./util/extend').extend,
  cliconv   = require('./util/cliconvert.js').convert,
  config    = require('../config');

var
  uaParser = require('./ua-parser/js/index')({async: true}),
  regexesfile  = path.normalize(config.ua_parser.dir + '/' + config.ua_parser.regexes);

/**
 * Option variables
 *
 * @property {String}  options.file      - filename of file continaing raw user-agent-strings
 * @property {String}  options.testcasesin  - input file for test cases; default is test resource from project; "#" does not select any input file.
 * @property {String}  options.testcasesout - output filename for test cases
 * @property {String}  options.listfile  - output file for generated csv list
 * @property {String}  options.logfile   - output logfile for broken test cases
 * @property {Boolean} options.console   - true: output parsing matches on console
 * @property {Boolean} options.family    - true: show family info in output; false: do not show
 * @property {Boolean} options.debug     - true: show debug info (Note: use debuginfo.js to 
 *                                         add them in regexes.yaml first)
 * @property {Boolean} options.swapdebug - true: show debug info after column brand model to 
 *                                         check matches for specific devices
 * @property {Boolean} options.testcases - true: process also input testcases.
 * @property {Boolean} options.swapdebug - true: show debug info after column brand model to 
 * @property {Boolean} options.appenduas - true: append user-agents from test-cases to check for broken tests
 * @property {Boolean} options.other     - true: add also unmatched user-agents to testcases
 */
var options = {
  file: path.normalize(config.input.useragents),
  testcasesin:  path.normalize(config.ua_parser.dir + '/' + config.ua_parser.test_resources.ua),
  testcasesout: path.normalize(config.output.dir + '/' + config.ua_parser.test_resources.ua),
  listfile: "ua.csv",
  logfile:  "ua.log.csv",
  console:   false,
  family:    true,
  debug:     true,
  swapdebug: false,
  testcases: false,
  appenduas: true,
  other: false
};

// add dirname to all output files - may be overwritten on cli
(['listfile', 'logfile']).forEach(function(p){
  options[p] = path.normalize(config.output.dir + '/' + options[p]);
});

/**
 * process files
 * @param {Object} opts; Same variables as with `options` can be used
 */
function main(opts) {
  var
    parser,
    regexes;

  opts = extend(options, opts);
  opts.fields = [ 'debug', 'family', 'version', 'swapdebug', 'user_agent_string' ];
  opts.fieldsBroken = ['debug', 'family_is', 'family_was', 'version_is', 'version_was', 'user_agent_string'];

  console.log('... reading ' + regexesfile);
  
  uaParser.loadSync(regexesfile);
  parser = uaParser.parseUA;

  makeLists({ 
    attr      : ['family', 'major', 'minor', 'patch'],
    parser: parser,
    testcasesfile : opts.testcasesin
  }, opts);
}

exports.main = main;
