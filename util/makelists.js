"use strict";

var
  fs         = require('fs'),
  path       = require('path'),
  extend     = require('./extend').extend,
  fileSync   = require('./filesync'),
  reportData = require('./report').reportData;

/**
 * parse user agents and generate reports, testcases
 * @param    {Object} config
 * @property {Array}  config.attr - attributes contained in parsed object
 * @property {Object} config.parser - parser used to extract attributes from user-agent-string
 * @property {String} config.testcasesfile - filename of testcases file to load
 *
 * @param    {Object}  options
 * @property {Boolean} options.console   - true: print out information while calling add()
 * @property {Boolean} options.family    - false: do not add family field
 * @property {Boolean} options.debug     - false: do not add debug field
 * @property {Boolean} options.swapdebug - if debug == true then debug info is printed in the swapdebug field
 * @property {Boolean} options.other     - true: add also unmatched user-agents to testcases
 * @property {Boolean} options.appenduas - true: append user-agents from test-cases to check for broken tests
 * @property {Array}   options.fields    - fields used to add data 
 */
function makeLists(config, options) {
  var
    user_agents,
    new_tests    = [],
    broken_tests = [],
    broken_log   = [],
    testcase_map = {},
    testcases    = { test_cases: [] },
    attr         = config.attr || [],
    report       = reportData(options);

  if (/^[^\.\/]/.test(options.file)) {
    options.file = path.normalize(path.join( __dirname, '..', options.file));
  }
  console.log('... reading ' + options.file);
  user_agents = fileSync.readUserAgentsListSync(options.file);

  if (options.testcases && config.testcasesfile !== '#') {
    console.log('... reading ' + config.testcasesfile);
    testcases = fileSync.readSync(config.testcasesfile);

    if (options.appenduas) {
      console.log('... appending user-agents from test cases');
    }

    // convert testcases into a hash for faster lookup
    testcases.test_cases.forEach(function(p, index) {
      if (options.appenduas) {
        user_agents.push(p.user_agent_string);
      }
      testcase_map[p.user_agent_string] = { index: index };
      attr.map(function(pp){
        testcase_map[p.user_agent_string][pp] = p[pp];
      });
    });
  }

  console.log('... parsing user-agents');
  // loop over all strings given in the user-agents file
  user_agents.forEach(function(ua_string) {
    var
      str,
      tmp,
      isBroken,
      ua = config.parser(ua_string);

    // adjust camel cases..
    ua.patch_minor = ua.patchMinor || null;

    if (options.testcases) {
      // check if testcase is broken
      tmp = testcase_map[ua_string];
      if (tmp) {
        isBroken = false;
        attr.map(function(p){
          if (ua[p] !== tmp[p]) {
            isBroken = true;
          }
        });
        if (isBroken) {
          console.log('Error: broken testcase ' + ua_string);

          str =
            'user-agent: ' + ua_string  + '\n' +
            '   matcher: ' + ( ua.debug || 'add debug info' ) + '\n';

          attr.map(function(p){
            if (ua[p] != tmp[p]) {
              str +=
                p + '\n' +
                '       got: ' + ua[p] + '\n' +
                '  expected: ' + tmp[p] + '\n';
            }
          });
          broken_log.push(str);

          // memorize broken user-agent
          broken_tests.push(extend(ua, { index: tmp.index }));
        }
      }
      else {
        ua.user_agent_string = ua_string;
        // add new test case
        new_tests.push(ua);
      }
    }
    report.add(ua_string, ua);
  });

  // change broken test cases
  broken_tests.forEach(function(p){
    var obj = testcases.test_cases[p.index];
    attr.map(function(pp){
      obj[pp] = p[pp];
    });
    testcases.test_cases[p.index] = obj;
  });

  // add new test cases
  new_tests.forEach(function(p){

    // create the right object structure (user_agent_string needs to be first)
    var obj = { user_agent_string: p.user_agent_string };
    attr.map(function(pp){
      obj[pp] = p[pp];
    });

    // control adding test cases without any match
    if (options.other || p.family !== 'Other') {
      testcases.test_cases.push(obj);
    }
  });

  console.log('... ' + report.length() + ' user-agents processed');
  // write reports
  console.log('... writing list ' + options.listfile);
  fileSync.createDirsSync(options.listfile);
  fs.writeFileSync(options.listfile, report.show(), 'utf8');

  if (options.testcases) {
    if (broken_log.length > 0) {
      console.log('... '+ broken_log.length +' number of broken testcases: ');
      console.log('... writing broken tests log file ' + options.logfile);
      fs.writeFileSync(options.logfile , broken_log.join('----\n'), 'utf8');
    }
    else {
      fs.exists(options.logfile, function(exists) {
        if (exists) {
          fs.unlinkSync(options.logfile);
        }
      });
    }
    // write test cases
    console.log('... '+ testcases.test_cases.length +' number of testcases' );
    console.log('... writing testcases file ' + options.testcasesout);
    fileSync.writeSync(options.testcasesout, testcases);
  }
}

module.exports = makeLists;
