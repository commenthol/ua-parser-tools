'use strict';

var path = require('path'),
	fs = require('fs'),
	HashTree = require('hashtree').HashTree,
	through = require('./through'),
	split = require('./split'),
	sorter = require('./sorter'),
	decode = require('../util/decode').decode;

var config   = require('../../config'),
	uaParser = require('../ua-parser/js/index')({async: true});

var regexesfile = path.normalize(config.ua_parser.dir + '/' + config.ua_parser.regexes);

uaParser.loadSync(regexesfile);

var M = {};

/**
 * filter testcases
 * 
 * @param {Object} options
 * @param {String} fileName
 * @param {Function} callback
 * @return {Stream}
 */
M = function(options, fileName, fileNameOut, callback) {

	options = options || {};

	var file = fs.createReadStream(fileName);
	var ht = new HashTree();
	var parser, ord;
	var cnt, fnd;
	
	cnt = fnd = 0;
	process.stdout.write('\n');

	// set parser type
	switch (options.type) {
		case 'os': {
			parser = uaParser.parseOS;
			ord = ['debug', 'family', 'major', 'minor', 'patch'];
			break;
		}
		case 'device': {
			parser = uaParser.parseDevice;
			ord = ['debug', 'brand', 'model'];
			break;
		}
		default:
		case 'ua': {
			parser = uaParser.parseUA;
			ord = ['debug', 'family', 'major', 'minor', 'patch'];
			break;
		}
	}

	if (options.ignore ) {
		ord.shift();
	}

	file
		.pipe(split())
		.pipe(through(
			function (line, encoding, done) {
				var res,
					arr = [];
				
				line = line.toString('utf8');
				//~ line = decode(line.toString('utf8'));
				res = parser(line);

				if (cnt % 100 === 0) {
					process.stdout.write('\r' + fnd + '\t' + cnt);
				}
				cnt++;

				if (res.debug) {
					ord.forEach(function(o){
						arr.push(res[o] || '');
					});
					if (!ht.get(arr)) {
						fnd++;
						ht.set(arr, line);
						if (options.short) {
							this.push(line + '\n');
						} else {
							this.push(arr.join('\t') + '\t' + line + '\n');
						}
					}
				}
				done();
			}, 
			function(done){
				process.stdout.write('\n');
				callback(null, ht.tree());
				done();
			})
		)
		.pipe(fs.createWriteStream(fileNameOut));
};

module.exports = M;
