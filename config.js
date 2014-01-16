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
  source: "https://raw.github.com/commenthol/ua-parser/master",
  input: {
    useragents: __dirname + '/useragents.txt'
  },
  output: {
    dir: __dirname + '/report'
  },
  ua_parser: {
    dir: __dirname + '/ua-parser',
    regexes: 'regexes.yaml',
    test_resources: {
      ua: 'test_user_agent_parser.yaml',
      os: 'test_user_agent_parser_os.yaml',
      device: 'test_device.yaml'
    }
  },
  ua_parser_caps: {
    dir: __dirname + '/ua-parser-caps',
  }
};

module.exports = config;
