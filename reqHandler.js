
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var fs = require('fs');
var Song = require('./models.js').Song;

var songsList = require('./songsList.js');

var insert = function() {
  // Connection URL 
  var url = 'mongodb://ds031213.mongolab.com:31213/heroku_sxb8blzn';
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server FROM REQ HANDLER");
    db.authenticate('testDummy', 'testDummy', function(err, res) {
  
      var gfs = Grid(db, mongo);

      var currRecord = songsList.shift();

      var uploadMP3 = function(){
        var writestream = gfs.createWriteStream({
            filename: currRecord.title
        });
      
        fs.createReadStream('audio_files/' + currRecord.filename).pipe(writestream);
    
        writestream.on('close', function(file) {
    
          console.log( 'file._id :', file._id );
          makeSongRecord(file._id);

        });
      }
      
      var makeSongRecord = function(id){

        var titanicTS = new Song({
          title: currRecord.title,
          artist: currRecord.artist,
          genre: currRecord.genre,
          trackId: id
        });

        titanicTS.save(function(err) {
          if (err) console.log(err);
          console.log('Wrote Record:', currRecord.title);

          currRecord = songsList.shift()
          if(currRecord){
            uploadMP3();
          }else{
            console.log('completed uploads!!!')
          }

        });

      }

      uploadMP3();

    });
  });
}


var retrieve = function(id){
  var url = 'mongodb://ds031213.mongolab.com:31213/heroku_sxb8blzn';

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server FROM REQ HANDLER -- RETRIEVE");
    db.authenticate('testDummy', 'testDummy', function(err, res) {
    // callback
    var gfs = Grid(db, mongo);
      //write content to file system
      var fs_write_stream = fs.createWriteStream('random.mp3');
       
      //read from mongodb
      var readstream = gfs.createReadStream({
         _id: id
      });
      readstream.pipe(fs_write_stream);
      
      fs_write_stream.on('close', function () {
           console.log('file has been written fully!');
      });
    
    })
  })
}

retrieve('55ce940a823fa40795ccbedc');

exports.insert = insert;
exports.retrieve = retrieve;
//reference: http://excellencenodejsblog.com/gridfs-using-mongoose-nodejs/
