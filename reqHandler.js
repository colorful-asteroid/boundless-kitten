
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var fs = require('fs');

// Connection URL 
var url = 'mongodb://testDummy:testDummy@ds031213.mongolab.com:31213/heroku_sxb8blzn';

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server FROM REQ HANDLER");
 
  db.close();
});


 
// create or use an existing mongodb-native db instance 
var db = new mongo.Db('heroku_sxb8blzn', new mongo.Server("mongodb://ds031213.mongolab.com:31213/"));

// make sure the db instance is open before passing into `Grid` 
db.open(function (err) {
  db.authenticate('testDummy', 'testDummy', function(err, res) {
  // callback
  console.log('HELP');
  console.log('err', err);
  console.log('res', res);
	});
  if (err) throw err;
  var gfs = Grid(db, mongo);

 
// streaming to gridfs 
var writestream = gfs.createWriteStream({
    filename: 'my_file.txt'
});
fs.createReadStream('./views').pipe(writestream);
 
})
// // streaming from gridfs 
// var readstream = gfs.createReadStream({
//   filename: 'my_file.txt'
// });
 
// //error handling, e.g. file does not exist 
// readstream.on('error', function (err) {
//   console.log('An error occurred!', err);
//   throw err;
// });
 
// readstream.pipe(response);

