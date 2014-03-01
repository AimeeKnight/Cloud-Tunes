'use strict';

module.exports = Song;

var songs = global.nss.db.collection('songs');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');
var _ = require('lodash');

function Song(song){
  this.title = song.title;
  this.artist = song.artist;
  this.albumId = song.albumId ? Mongo.ObjectID(song.albumId) : null;
}

Song.prototype.addSong = function(oldpath){
  console.log('old path', oldpath);
  var songTitle = this.title.replace(/\s/g, '').toLowerCase();
  var songArtist = this.artist.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/audios/';
  relpath += songArtist + '-' + songTitle;

  var extension = path.extname(oldpath);
  relpath += extension;
  fs.renameSync(oldpath, abspath + relpath);

  this.filepath = relpath;
};

Song.prototype.insert = function(fn){
  songs.insert(this, function(err, records){
    fn(err);
  });
};

/*
Album.prototype.update = function(fn){
  albums.update({_id:this._id}, this, function(err, count){
    fn(err, count);
  });
};
*/

Song.findAll = function(fn){
  songs.find().toArray(function(err, records){
    fn(records);
  });
};

Song.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  songs.findOne({_id:_id}, function(err, record){
    // extend (lodash method) sets the protoype of the object mongo returns
    fn(_.extend(record, Song.prototype));
  });
};

