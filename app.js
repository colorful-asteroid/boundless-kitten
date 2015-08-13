"use strict";

var express = require('express');
var dbconnection = require('./dbconnection.js');
var Library = require('./dbconnection.js').Library;
var app = express();
var url = require('./reqHandler.js').url;
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
  res.send('Hello World!');
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
