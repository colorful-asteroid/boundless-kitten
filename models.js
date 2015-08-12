var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// sets up the structure of the Song db
var songSchema = new Schema({
  title: String,
  genre: String,
  duration: Number
});

// not exactly sure what this does, but the docs say to do it
var Song = mongoose.model('Song', songSchema);

// sets up the structure of the Song db
var userSchema = new Schema({
  name: String
});

// not exactly sure what this does, but the docs say to do it
var User = mongoose.model('User', userSchema);


//sample dummy data
// var titanicTS = new Song({
//   title: 'My Heart Will Go On',
//   genre: 'movie sound track',
//   duration: '5000000'
// });

// titanicTS.save(function(err) {
//   if (err) // ...
//   console.log('I\'ll never let go Jack');
// });

//export to use in the dbconnection file
exports.Song = Song;
exports.User = User;
// assuming theres a model User
