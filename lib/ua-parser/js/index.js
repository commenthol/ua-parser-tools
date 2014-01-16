"use strict";

var 
  path    = require('path'), 
  fs      = require('fs'),
  yaml    = require('yamlparser'),
  Results = require('./lib/results').BackwardsCompatResults,
  config  = require('../../../config');

var 
  regexesfile  = path.normalize(config.ua_parser.dir + '/' + config.ua_parser.regexes),
  regexes = fs.readFileSync(regexesfile, 'utf8');

regexes = yaml.eval(regexes); // jshint ignore:line

var parseUA = require('./lib/ua').makeParser(regexes.user_agent_parsers);
exports.parseUA = parseUA;

var parseOS = require('./lib/os').makeParser(regexes.os_parsers);
exports.parseOS = parseOS;

var parseDevice = require('./lib/device').makeParser(regexes.device_parsers);
exports.parseDevice = parseDevice;

function parse(str) {
  var ua = parseUA(str),
      os = parseOS(str),
      device = parseDevice(str);
  return new Results(str, ua, os, device);
}
exports.parse = parse;

if (require.main === module) {
  var output, input = process.argv[2];
  if (!input) { process.exit(1); }
  process.stdout.write(parseUA(input).toString());
}

