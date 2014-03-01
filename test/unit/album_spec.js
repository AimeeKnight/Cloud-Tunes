'use strict';

process.env.DBNAME = 'tunes-test';
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var Album;
var Song;

describe('Tunes', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Album = require('../../app/models/album');
      Song = require('../../app/models/song');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/euro.jpg';
      var copy1file = __dirname + '/../fixtures/euro-copy1.jpg';
      var copy2file = __dirname + '/../fixtures/euro-copy2.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(err, result){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new Album object', function(){
      var o = {};
      o.title = 'Test Thriller';
      o.artist = 'Test Michael Jackson';
      o.realeaseyear = '1982 05-01';
      var a1 = new Album(o);
      expect(a1).to.be.instanceof(Album);
      expect(a1.title).to.equal('Test Thriller');
      expect(a1.releaseyear).to.be.instanceof(Date);
      expect(a1.songs).to.have.length(0);
    });
  });

  describe('#addCover', function(){
    it('should add a cover to the Album', function(){
      var o = {};
      o.title = 'Test Thriller';
      o.artist = 'Test Michael Jackson';
      o.realeaseyear = '1982 05-01';
      var a1 = new Album(o);
      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      a1.addCover(oldname);
      expect(a1.cover).to.equal('/img/testmichaeljackson-testthriller.jpg');
    });
  });
/*
  describe('#addSong', function(){
    var s1;

    beforeEach(function(done){
      s1 = new Song({title:'Test A', artist:'Node Audio'});
      var oldname = __dirname + '/../fixtures/song-copy1.mp3';
      s1.addSong(oldname);
      s1.insert(function(){
        done();
      });
    });

    it('should add a song to the Album', function(done){
      var songid = s1._id.toString();
      Album.findById(ALBUM ID NEEDED, function(album){
        album.addSong(songid, function(album){
          expect(album.songs).to.have.length(1);
          //expect(album.songs[0]).to.equal('/img/testa/france.jpg');
          done();
        });
      });
    });
  });
*/

  describe('#insert', function(){
    it('should insert a new Album into Mongo', function(done){
      var o = {};
      o.title = 'Test Thriller';
      o.artist = 'Test Michael Jackson';
      o.realeaseyear = '1982 05-01';
      var a1 = new Album(o);
      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      a1.addCover(oldname);
      a1.insert(function(err){
        expect(a1._id.toString()).to.have.length(24);
        done();
      });
    });
  });

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
        album.releasedate = new Date('1983-05-12');
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

  describe('Find Methods', function(){
    var a1, a2, a3;

    beforeEach(function(done){
      a1 = new Album({title:'Test A', artist:'Aimee', releaseyear:'2012-03-25'});
      a2 = new Album({title:'Test B', artist:'Sam', releaseyear:'2012-03-26'});
      a3 = new Album({title:'Test C', artist:'Drew', releaseyear:'2012-03-27'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            done();
          });
        });
      });
    });

    describe('.findAll', function(){
      it('should find all the albums in the database', function(done){
        Album.findAll(function(albums){
          expect(albums).to.have.length(3);
          expect(albums[0].songs).to.have.length(0);
          done();
        });
      });
    });

    describe('.findById', function(){
      it('should find a specific album in the database', function(done){
        Album.findById(a1._id.toString(), function(album){
          expect(album._id).to.deep.equal(a1._id);
          // use respondTo test since instanceof will not always return correct results
          expect(album).to.respondTo('addCover');
          done();
        });
      });
    });
  });

});
