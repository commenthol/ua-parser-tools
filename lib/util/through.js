/**
 * Stream Transformer
 * 
 * @copyright (c) 2014 commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	Transform = require('stream').Transform;

function Through(options, transform, flush) {
	if (!(this instanceof Through)) {
		return new Through(options, transform, flush);
	}
	
	if (typeof options === 'function') {
		flush = transform;
		transform = options;
		options = {};
	}

	options = util._extend({ encoding: 'utf8' }, options);

	Transform.call(this, options);
	this.fnTransform = transform || function (chunk, encoding, done) { done(); } ;
	this.fnFlush = flush || function (done) { done(); };

	return this;
}

util.inherits(Through, Transform);

Through.prototype._transform = function(chunk, encoding, done) {
	this.fnTransform(chunk, encoding, function(){
		done();
	});
};

Through.prototype._flush = function(done) {
	this.fnFlush(function(){
		done();
	});
};

module.exports = Through;
