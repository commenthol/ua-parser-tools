"use strict";

/**
 * convert options from cli to internal options
 */
exports.convert = function convert(options){
  
  var 
    filename,
    opts = {};
  
  if (options.ua) {
    opts.file = options.ua;
  }
  if (options.out) {
    filename = options.out.replace(/\.[^\.]*$/, '');
    opts.listfile = filename + '.csv';
    opts.logfile  = filename + '.log';
  }
  if (options.tc) {
    opts.testcases = true;
  }
  if (options.tcin) {
    opts.testcasesin = options.tcin;
    opts.testcases = true;
  }
  if (options.tcout) {
    opts.testcasesout = options.tcout;
  }
  if (options.console) {
    opts.console = true;
  }
  if (options.other) {
    opts.other = true;
  } 
  if (options.nodebug) {
    opts.debug = false;
  } 
  if (options.swapdebug) {
    opts.swapdebug = true;
  } 
  if (options.nofamily) {
    opts.family = false;
  } 
  if (options.noappend) {
    opts.appenduas = false;
  }

  return opts;
};
