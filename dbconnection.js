"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://testDummy:testDummy@ds031213.mongolab.com:31213/heroku_sxb8blzn');

//sets up the structure of the Song db
var songSchema = new Schema({
  title: String,
  genre: String,
  duration: Number
});

// not exactly sure what this does, but the docs say to do it
var Song = mongoose.model('Song', songSchema);

var titanicTS = new Song({
  title: 'My Heart Will Go On',
  genre: 'movie sound track',
  duration: '5000000'
});

titanicTS.save(function(err) {
  if (err) // ...
  console.log('I\'ll never let go Jack');
});

