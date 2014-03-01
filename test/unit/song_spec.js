'use strict';

process.env.DBNAME = 'tunes-test';
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var Mongo = require('mongodb');
var Song;

describe('Song', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Song = require('../../app/models/song');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/audios/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/song.mp3';
      var copy1file = __dirname + '/../fixtures/song-copy1.mp3';
      var copy2file = __dirname + '/../fixtures/song-copy2.mp3';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(err, result){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new Song object', function(){
      var o = {};
      o.title = 'Test Song Title';
      o.artist = 'Test Michael Jackson';
      o.albumId = '5311322f310e5e5a0aa18e04';
      var s1 = new Song(o);
      expect(s1).to.be.instanceof(Song);
      expect(s1.title).to.equal('Test Song Title');
      expect(s1.artist).to.equal('Test Michael Jackson');
      expect(s1.albumId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('#addSong', function(){
    it('should add a song file to the Song object', function(){
      var o = {};
      o.title= 'Test Song Test';
      o.artist = 'Test Michael Jackson';
      var s1 = new Song(o);
      var oldname = __dirname + '/../fixtures/song-copy1.mp3';
      s1.addSong(oldname);
      console.log('test old name: ', oldname);
      expect(s1.filepath).to.equal('/audios/testmichaeljackson-testsongtest.mp3');
    });
  });

  describe('#insert', function(){
    it('should insert a new Song into Mongo', function(done){
      var o = {};
      o.title = 'Test Song Title';
      o.artist = 'Test Michael Jackson';
      var s1 = new Song(o);
      var oldname = __dirname + '/../fixtures/song-copy1.mp3';
      s1.addSong(oldname);
      s1.insert(function(err){
        expect(s1._id.toString()).to.have.length(24);
        done();
      });
    });
  });

 /*
  describe('#update', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Album({title:'Test Thriller', artist:'Test Michael Jackson', releasedate:'1982-05-01'});
      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should update an existing photo album', function(done){
      var id = a1._id.toString();
      Album.findById(id, function(album){
        //var photo = __dirname + '/../fixtures/euro-copy2.jpg';
        //album.addPhoto(photo, 'france.jpg');
        //expect(album.photos).to.have.length(1);
        //expect(album.photos[0]).to.equal('/img/testa/france.jpg');
        album.update(function(err, count){
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });
*/
  describe('Find Methods', function(){
    var s1, s2, s3;

    beforeEach(function(done){
      s1 = new Song({title:'Test A', artist:'artist1', albumId:'5311322f310e5e5a0aa18e04'});
      s2 = new Song({title:'Test B', artist:'artist2', albumId:'5311322f310e5e5a0aa18e04'});
      s3 = new Song({title:'Test C', artist:'artist3', albumId:'5311322f310e5e5a0aa18e04'});

      s1.insert(function(){
        s2.insert(function(){
          s3.insert(function(){
            done();
          });
        });
      });
    });
    
    describe('.findAll', function(){
      it('should find all the songs in the database', function(done){
        Song.findAll(function(songs){
          expect(songs).to.have.length(3);
          expect(songs[0].title).to.equal('Test A');
          done();
        });
      });
    });

    describe('.findById', function(){
      it('should find a specific song in the database', function(done){
        Song.findById(s1._id.toString(), function(song){
          expect(song._id).to.deep.equal(s1._id);
          done();
        });
      });
    });
  });

});
