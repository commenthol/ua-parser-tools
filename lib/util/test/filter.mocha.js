'use strict';

/*global describe, it*/

var assert = require('assert'),
    fs = require('fs'),
    filter = require('../filter')

var log = function(){};
//~ var log = console.log;

describe('#filter', function(){
  
  it('returns device data', function(done){
    filter({ type: 'device'}, 
      __dirname + '/useragents.txt', 
      __dirname + '/test-de.txt',
      function(err, data){
        log(JSON.stringify(data, null, 2));        
        assert.equal(err, null);
        assert.equal(typeof data, 'object');
        done();
      });
  }) 

  it('returns os data', function(done){
    filter({ type: 'os'}, 
      __dirname + '/useragents.txt', 
      __dirname + '/test-os.txt',
      function(err, data){
        log(JSON.stringify(data, null, 2));        
        assert.equal(err, null);
        assert.equal(typeof data, 'object');
        done();
      });
  })  

  it('returns ua data', function(done){
    filter({ type: 'ua'}, 
      __dirname + '/useragents.txt', 
      __dirname + '/test-ua.txt',
      function(err, data){
        log(JSON.stringify(data, null, 2));        
        assert.equal(err, null);
        assert.equal(typeof data, 'object');
        done();
      });
  })  
});
