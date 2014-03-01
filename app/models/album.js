'use strict';

module.exports = Album;

var albums = global.nss.db.collection('albums');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');
var _ = require('lodash');

function Album(album){
  this.title = album.title;
  this.artist = album.artist;
  this.releaseyear = new Date(album.releaseyear);
  this.songs = [];
}

Album.prototype.addCover = function(oldpath){
  var albumTitle = this.title.replace(/\s/g, '').toLowerCase();
  var albumArtist = this.artist.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + albumArtist + '-' + albumTitle;

  var extension = path.extname(oldpath);
  relpath += extension;
  fs.renameSync(oldpath, abspath + relpath);

  this.cover = relpath;
};

Album.prototype.addSong = function(songId, fn){
  var mongosongId = new Mongo.ObjectID(songId);
  this.songs.push(mongosongId);
  this.update(function(count){
    fn(count);
  });
};

Album.prototype.insert = function(fn){
  albums.insert(this, function(err, records){
    fn(err);
  });
};

Album.prototype.update = function(fn){
  albums.update({_id:this._id}, this, function(err, count){
    fn(err, count);
  });
};

Album.findAll = function(fn){
  albums.find().toArray(function(err, records){
    fn(records);
  });
};

Album.findById = function(id, fn){
  var _id = new Mongo.ObjectID(id);

  console.log('Album findById called. _id: ', _id);

  albums.findOne({_id:_id}, function(err, record){
    // extend (lodash method) sets the protoype of the object mongo returns
    var newRecord = _.extend(record, Album.prototype);

    console.log('albums findOne called. err, record, newRecord: ', err, record, newRecord);

    fn(newRecord);
  });
};

