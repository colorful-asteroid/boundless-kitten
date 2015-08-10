var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
  content: String,
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  }
});

mongoose.model('posts', postsSchema)

/*

(1) modify this to be our database


modify to something like this:

var trackSchema = new Schema({
  track: String,
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  }
  more things here: ...
});


*/