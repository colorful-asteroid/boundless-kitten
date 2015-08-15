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
  var insert = require('./reqHandler.js').insert;
  insert();
  res.send('new copiedDummy.txt file has been created');
});

app.get('/test', function(req, res) {
  var retrieve = require('./reqHandler.js').retrieve;
  // console.log("RETRIEVE IS -----------",retrieve)
  retrieve();
  res.send('testing...');
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
