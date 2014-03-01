'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var albums = require('../routes/albums');

  console.log('routes function called. This is before app.get and stuff');

  app.get('/', d, albums.index);
  app.get('/albums/new', d, albums.new);
  app.get('/albums/:id', d, albums.show);
  app.post('/albums', d, albums.create);
//  app.post('/albums/:id', d, albums.photoAdd);
  console.log('Routes Loaded');
  fn();
}

