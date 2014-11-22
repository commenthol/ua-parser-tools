"use strict";

/**
 * Configuration file for ua-parser-tools
 * 
 * @property {String} config.source - uri for downloading the requisites
 * @property {String} config.input.useragents - default input file containing raw user-agent strings
 * @property {String} config.output.dir - absolute path of output directory
 * @property {String} config.ua_parser.dir - absolute directory to ua-parser
 * @property {String} config.ua_parser.regexes - filename of regexes.yaml
 * @property {String} config.ua_parser.test_resources.ua - name of user-agent testcases file
 * @property {String} config.ua_parser.test_resources.os - name of os testcases file
 * @property {String} config.ua_parser.test_resources.device - name of device testcases file
 */
var config = {
  source: "https://raw.github.com/ua-parser/uap-core/master",
  input: {
    useragents: __dirname + '/useragents.txt'
  },
  output: {
    dir: __dirname + '/report'
  },
  ua_parser: {
    dir: __dirname + '/uap-core',
    regexes: 'regexes.yaml',
    test_resources: {
      ua:     'tests/test_ua.yaml',
      //~ ua:     'test_resources/firefox_user_agent_strings.yaml', 
      //~ ua:     'test_resources/pgts_browser_list.yaml',
      os:     'tests/test_os.yaml',
      //~ os:     'test_resources/additional_os_tests.yaml',
      device: 'tests/test_device.yaml',
      //~ device: 'tests/test_device_brandmodel.yaml',
    }
  }
};

module.exports = config;
