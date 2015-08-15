
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var fs = require('fs');
var Song = require('./models.js').Song;

var insert = function() {
  // Connection URL 
  var url = 'mongodb://ds031213.mongolab.com:31213/heroku_sxb8blzn';
  // var fileId = new mongo.ObjectId();
  //   console.log('wtf is fieldId ------->',fileId)
  // Use connect method to connect to the Server 
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server FROM REQ HANDLER");
   
  // make sure the db instance is open before passing into `Grid` 
    db.authenticate('testDummy', 'testDummy', function(err, res) {
    // callback
      var gfs = Grid(db, mongo);
      // console.log('this is the fucking GFS object',gfs)
      // streaming to gridfs 
      var writestream = gfs.createWriteStream({
            filename: 'EmSoDepCopy.mp3'
        });
      
      fs.createReadStream('EmSoDep.mp3').pipe(writestream);
      // fs.close('NEWFILE.txt', callback);
      // save this is async
      writestream.on('close', function(file) {
        console.log( 'file._id :', file._id );
        
        var titanicTS = new Song({
          title: file.filename,
          trackId: file._id
        });

        titanicTS.save(function(err) {
          if (err) // ...
          console.log('I\'ll never let go Jack');
        });



      });
    // });



    });
  });


}

var retrieve = function(){
  var url = 'mongodb://ds031213.mongolab.com:31213/heroku_sxb8blzn';
  // var fileId = new mongo.ObjectId();
  //   console.log('wtf is fieldId ------->',fileId);
  // Use connect method to connect to the Server 
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server FROM REQ HANDLER -- RETRIEVE");
    db.authenticate('testDummy', 'testDummy', function(err, res) {
    // callback
    var gfs = Grid(db, mongo);
      //write content to file system
      var fs_write_stream = fs.createWriteStream('TESTmp3.mp3');
       
      //read from mongodb
      var readstream = gfs.createReadStream({
         _id: '55ce7e8777d23106ec378586'
      });
      readstream.pipe(fs_write_stream);
      
      fs_write_stream.on('close', function () {
           console.log('file has been written fully!');
      });
    
    })
  })
}

exports.insert = insert;
exports.retrieve = retrieve;
//reference: http://excellencenodejsblog.com/gridfs-using-mongoose-nodejs/
