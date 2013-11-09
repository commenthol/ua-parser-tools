"use strict";

/*!
 * debug os_parser regular expressions
 *
 * Note: The yamlparser stops parsing strings which contain unicode
 *       characters. To parse and dump the testcases js-yaml is used 
 *       instead.
 */

/**
 * Dependencies
 */
var 
  config    = require('./config'),
  fs        = require('fs'),
  path      = require('path'),
  run       = require('./util/arguments').run,
  fileSync  = require('./util/filesync'),
  makeLists = require('./util/makelists'),
  extend    = require('./util/extend').extend;

var
  osParser = require(config.ua_parser + '/os'),
  regexesfile  = __dirname + '/' + config.regexes_yaml.dir + '/' + config.regexes_yaml.file;

/**
 * Option variables
 *
 * @property {String}  options.file      - filename of file continaing raw user-agent-strings
 * @property {String}  options.testcasesin  - input file for test cases
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
 */
var options = {
  file: "useragents.txt",
  testcasesin:  __dirname + '/' + config.test_resources.dir + '/' + config.test_resources.os,
  testcasesout: __dirname + '/' + config.output.dir + '/' + config.test_resources.os,
  listfile: "os.csv",
  logfile:  "os.log",
  console: false,
  family: true,
  debug: true,
  swapdebug: false,
  testcases: false,
  appenduas: true
};

// add dirname to all output files - may be overwritten on cli
(['listfile', 'logfile']).map(function(p){
  options[p] = __dirname + '/' + config.output.dir + '/' + options[p];
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

  console.log('... reading ' + regexesfile);    
  regexes = fileSync.readYamlSync(regexesfile);
  parser = osParser.makeParser(regexes.os_parsers);

  makeLists({ 
    attr  : ['family', 'major', 'minor', 'patch', 'patch_minor'],
    parser: parser,
    testcasesfile : opts.testcasesin
  }, opts);
}

/**
 * command line interface
 */
if (require.main === module) {
  var errmsg = 'Usage: (e.g.)\n' + 
    '  node os.js file:uas.txt testcases:true';
  
  run(main, errmsg);
}
