'use strict';

var Album = require('../models/album');
var moment = require('moment');

exports.index = function(req, res){
  Album.findAll(function(albums){
    res.render('albums/index', {moment:moment, albums:albums, title: 'Photo Albums'});
  });
};

exports.show = function(req, res){
  Album.findById(req.params.id, function(album){
    res.render('albums/show', {moment:moment, album:album, title: album.title});
  });
};

exports.new = function(req, res){
  res.render('albums/new', {title: 'New Album'});
};

exports.create = function(req, res){
  var album = new Album(req.body);
  album.addCover(req.files.cover.path);
  album.insert(function(){
    res.redirect('/');
  });
};

exports.photoAdd = function(req, res){
  Album.findById(req.params.id, function(album){
    // req.files.photo.path === nodes temporary directory ie mangled photo name
    // req.files.photo.name === the name of the photo
    album.addPhoto(req.files.photo.path, req.files.photo.name);
    album.update(function(){
      res.redirect('/albums/' + req.params.id);
    });
  });
};

