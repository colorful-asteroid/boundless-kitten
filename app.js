var express = require('express');
var dbconnection = require('./dbconnection.js');
var Library = require('./dbconnection.js').Library;
var app = express();

//==================================//
//            ROUTES                //
//==================================//
app.get('/', function(req, res) {
  res.send('Hello World!');
});

//=======================================================//
//   Populates the library by querying the db  					 //
//=======================================================//

app.get('/songs', function(req, res) {

  Library(function(err, data) {
    if (err) {
      throw err
    } else {
      console.log('THIS! IS! ARGUMEEENNTTSS!!', arguments);
      res.send(data)
    }
  })
});

//==================================//
//            Calling the Server    //
//==================================//
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s -- %s', host, port, 'somecrap');
});
