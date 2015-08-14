"use strict";

var express = require('express');
var dbconnection = require('./dbconnection.js');
var Library = require('./dbconnection.js').Library;
var app = express();
var url = require('./reqHandler.js').url;
// var foo = require('./reqHandler.js').gridGet;
// console.log('what is the URL :',url)
// console.log('whatis this foo : ',foo)
// var db = require('./reqHandler.js').db;
// var gfs = require('./reqHandler.js').gfs;
// var writeStream = require('./reqHandler.js').writeStream;
/**
 * Get port from environment and store in Express.
 */

var port = process.env.PORT || '3000';

//========================================================//
//   ROUTES                                               //
//========================================================//
app.get('/', function(req, res) {
  res.send('INDEX Hello World!');
});


app.get('/gridtest', function(req, res) {

console.log('helloo????????')
  var MongoClient = require('mongodb').MongoClient;
  var assert = require('assert');
  var mongo = require('mongodb');
  var Grid = require('gridfs-stream');
  var fs = require('fs');


  // Connection URL 
  var url = 'mongodb://ds031213.mongolab.com:31213/heroku_sxb8blzn';

  // Use connect method to connect to the Server 
  var thingy = MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server FROM REQ HANDLER HELLO");
   
  // make sure the db instance is open before passing into `Grid` 
    db.authenticate('testDummy', 'testDummy', function(err, res) {
    // callback
      var gfs = Grid(db, mongo);

      // streaming to gridfs 
      var writestream = gfs.createWriteStream({
            filename: 'NEWFILE.txt'
        });
      
      fs.createReadStream('dummyfile1.md').pipe(writestream);
      // fs.close('NEWFILE.txt', callback);
      // save this is async
      writestream.on('close', function(file) {

        console.log( 'file :', file.md5 );

      });
    // });


      //write content to file system
      var fs_write_stream = fs.createWriteStream('copiedDummy.txt');
       
      //read from mongodb
      var readstream = gfs.createReadStream({
         filename: 'NEWFILE.txt'
      });
      readstream.pipe(fs_write_stream);
      
      fs_write_stream.on('close', function () {
           console.log('file has been written fully!');
      });

    });
  });



  var test = function() {return 19430943094}





  console.log('THINGYYYYYYYYYY',test)







  res.send(JSON.stringify(test));
});
//========================================================//
//   Populates the library by querying the db             //
//========================================================//
app.get('/songs', function(req, res) {

  Library(function(err, data) {
    if (err) {
      throw err;
    } else {
      res.send(data);
    }
  });
});

//========================================================//
//   Calling the Server                                   //
//========================================================//
var server = app.listen(port, function() {
  var host = server.address().address;

  console.log('Example app listening at http://%s:%s -- %s', host, port, 'somecrap');
});
