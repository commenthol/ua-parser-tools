/**
 * Stream Transformer
 * 
 * @copyright (c) 2014 commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	Transform = require('stream').Transform;

function noop() {}

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
	this.fnTransform = transform || noop;
	this.fnFlush = flush || noop;
	this.fnTransformDone = this.fnFlushDone = function(done) { done(); };

	if (this.fnTransform.length === 3) {
		this.fnTransformDone = noop;
	}
	if (this.fnFlush.length === 1) {
		this.fnFlushDone = noop;
	}

	return this;
}

util.inherits(Through, Transform);

Through.prototype._transform = function(chunk, encoding, done) {
	this.fnTransform(chunk, encoding, function() {
		done();
	});
	this.fnTransformDone(done);
};

Through.prototype._flush = function(done) {
	this.fnFlush(function() {
		done();
	});
	this.fnFlushDone(done);
};

// shortcut for objectmode
Through.obj = function (options, transform, flush) {
	if (typeof options === 'function') {
		flush = transform;
		transform = options;
		options = {};
	}
	options = util._extend({}, options, { objectMode: true });
	return new Through(options, transform, flush);
};

module.exports = Through;
