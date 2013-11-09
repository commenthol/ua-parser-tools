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
  source: "https://raw.github.com/commenthol/ua-parser/brand_model",
  regexes_yaml: {
    dir: "ua-parser",
    file: "regexes.yaml"
  },
  ua_parser: "./ua-parser/js/lib", // location of the js ua-parser
  test_resources: {
    dir: "ua-parser/test_resources",
    ua: "test_user_agent_parser.yaml",
    os: "test_user_agent_parser_os.yaml",
    device: "test_device.yaml"
  },
  output: {
    dir: 'report'
  }
};

module.exports = config;
