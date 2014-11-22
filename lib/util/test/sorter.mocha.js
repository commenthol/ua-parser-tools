'use strict';

var fs = require('fs'),
	assert = require('assert'),
	through = require('../through'),
	split = require('../split'),
	sorter = require('../sorter');
	
describe('#sorter', function() {
	it('Mozilla first', function(){
		
		var arr = [
			'HbbTV/1.1.2',
			'Mozilla/5.0 (SymbianOS/9.4; U)',
			'mozilla/5.0 (Galaxy Nexus Build/JOP40C)',
			'Mozilla/5.0 (Linux; U; Android 4.2.1; de-de; HUAWEI G610-U00 Build)',
			'Test Mozilla/4.0 (compatible; MSIE 4.01; Windows NT)'
		];
		var exp = [ 
			'Mozilla/5.0 (Linux; U; Android 4.2.1; de-de; HUAWEI G610-U00 Build)',
			'Mozilla/5.0 (SymbianOS/9.4; U)',
			'Test Mozilla/4.0 (compatible; MSIE 4.01; Windows NT)',
			'HbbTV/1.1.2',
			'mozilla/5.0 (Galaxy Nexus Build/JOP40C)' ];
		
		var res = arr.sort(sorter.userAgentsSorter);
		
		assert.deepEqual(res, exp);
	});
	
  it('sorted uas', function(done){ 
	fs.createReadStream(__dirname + '/useragents.txt')
		.pipe(split())
		.pipe(sorter.sort())
		.pipe(through(function(line, enc, _done){
			line = line.toString();
			console.log(line);
			_done();
		}, function(_done){
			_done();
			done();
		}));	  
  }) 	
})
