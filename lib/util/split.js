'use strict';

var through = require('./through');

var M = {};

function split(options) {
	var self = {};
	self.options = options || { encoding: 'utf8'};
	self.options.object = true;
	self.buffer = '';
	self.matcher = self.options.matcher || /\r?\n/;
	self.encoding = self.options.encoding || 'utf8';

	function transform(chunk) {
		var lines = [];

		if (chunk) {
			lines = (self.buffer + chunk.toString(self.encoding)).split(self.matcher);

			self.buffer = lines.pop();

			for (var i = 0; i < lines.length; i++) {
				this.push(lines[i]);
			}
		}
	};

	function flush() {
		this.push(self.buffer);
	};

	return through(self.options, transform, flush);
}

module.exports = split;
