'use strict';

process.env.DBNAME = 'tunes-test';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var Album;

describe('albums', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Album = require('../../app/models/album');
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

  describe('GET /', function(){
    it('should display the album home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('GET /albums/3', function(){
    var a1, a2, a3;
/*
    beforeEach(function(done){
      a1 = new Album({title:'Test A', artist:'Drew', releaseyear:'2012-03-25'});
      a2 = new Album({title:'Test B', artist:'Aimee', releaseyear:'2012-03-26'});
      a3 = new Album({title:'Test C', artist:'Sam', releaseyear:'2012-03-27'});


      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            console.log('beforeEach called: ', a1, a2, a3);
            done();
          });
        });
      });
    });
*/
    it('should display the album show page', function(done){
      a1 = new Album({title:'Test A', artist:'Drew', releaseyear:'2012-03-25'});
      a2 = new Album({title:'Test B', artist:'Aimee', releaseyear:'2012-03-26'});
      a3 = new Album({title:'Test C', artist:'Sam', releaseyear:'2012-03-27'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            console.log('beforeEach called: ', a1, a2, a3);
            request(app)
            .get('/albums/' + a1._id.toString())
            .expect(200, done);

            console.log('it album show page called. a1._id.toString(): ', a1._id.toString());
          });
        });
      });
    });
  });

  describe('GET /albums/new', function(){
    it('should display the new album html page', function(done){
      console.log('it new album html page called.');
      request(app)
      .get('/albums/new')
      .expect(200, done);
    });
  });

  describe('POST /albums', function(){
    it('should create a new album and send user back to home', function(done){



      var filename = __dirname + '/../fixtures/euro-copy1.jpg';

      console.log('shoud create new album send user home called, filename: ', filename);

      request(app)
      .post('/albums')
      .attach('cover', filename)
      .field('title', 'Test Thriller')
      .field('releaseyear', '2014-02-25')
      .field('artist', 'Test Michael Jackson')
      .expect(302, done);
    });
  });
});

/*
  describe('POST /albums/3', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Album({title:'Test A', taken:'2012-03-25'});
      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should add a photo to the album', function(done){
      var filename = __dirname + '/../fixtures/euro-copy2.jpg';
      request(app)
      .post('/albums/' + a1._id.toString())
      .attach('photo', filename)
      .expect(302, done);
    });
  });
});
*/

