"use strict";

/**
 * Configuration file for ua-parser-tools
 * 
 * @property {String} config.source - uri for downloading the requisites
 * @property {String} config.regexes_yaml.file - filename of regexes.yaml
 * @property {String} config.regexes_yaml.dir - relative path to regexes.yaml file
 * @property {String} config.test_resources.dir - relative path to test_resources dir
 * @property {String} config.test_resources.ua - name of user-agent testcases file
 * @property {String} config.test_resources.os - name of os testcases file
 * @property {String} config.test_resources.device - name of device testcases file
 * @property {String} config.output.dir - relative path of output directory
 */
var config = {
  source: "https://raw.github.com/commenthol/ua-parser/master",
  ua_parser: {
    dir: __dirname + '/./ua-parser',
    regexes: 'regexes.yaml',
    test_resources: {
      ua: 'test_user_agent_parser.yaml',
      os: 'test_user_agent_parser_os.yaml',
      device: 'test_device.yaml'
    }
  },
  input: {
    useragents: __dirname + '/useragents.txt'
  },
  output: {
    dir: __dirname + '/report'
  }
};

module.exports = config;
