"use strict";

/*jshint loopfunc:true*/

/**
 * parse process arguments `argv` from commandline 
 * into a json object which is then used as options
 * 
 * If JSON.parse fails `null` is returned. 
 *
 * @param {Array} argv
 * @return {Object}
 */
function parse(argv) {
  var i,
      opts,
      str;

  // remove the two first arguments from array.
  argv.shift(); 
  argv.shift();
  
  for (i in argv) {
    if (/[a-z]+:/.test(argv[i])) {
      argv[i] = argv[i].replace(/^([a-z_]+):(.+)$/, function(m, m1, m2) {
        m1 = ',"'+m1+'":';
        if (! /^(true|false|\d+)$/.test(m2)) {
          m2 = '"'+m2.replace(/"/g, '\\"')+'"';
        }
        return m1 + m2;
      });
    }
  }
  str = argv.join('').replace(/^\s*,?/,'{').replace(/,?\s*$/,'}'); 

  try {
    opts = JSON.parse(str);    
  } catch(err) {
    console.log(str);
    opts = null;
  }
  return opts;
}
exports.parse = parse;


/**
 * run callback function `cb` after parsing process arguments or 
 * display `errormsg`.
 * 
 * @param {Function} cb
 * @param {String} errormsg
 * @api public
 */
function run(cb, errmsg) {
  var argv,
      opts;
  
  argv = process.argv.slice(0);
  opts = parse(argv);
  
  if (opts) {
    cb(opts);
  }
  else {
    errmsg = errmsg || '';
    console.log('Error: Could not parse arguments\n' + errmsg);
  }
}
exports.run = run;
