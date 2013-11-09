"use strict";

var 
  config = require('../config'),
  https = require('https'),
  fs = require('fs');

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  console.log('... downloading ' + url); 
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      cb();
    });
  });
};

var url = config.source + '/' + config.regexes_yaml.file;
var dest = __dirname + '/../' + config.regexes_yaml.dir + '/' + config.regexes_yaml.file;
download(url, dest, (function(){
  var u = url;
  console.log('... done ' + u);
})());

['ua', 'os', 'device'].map(function(p){
  var url  = config.source + '/test_resources/' + config.test_resources[p];
  var dest = __dirname + '/../' + config.test_resources.dir + '/' + config.test_resources[p];
  download(url, dest, (function(){
    var u = url;
    console.log('... done ' + u);
  })());
});


