//left turntable

// MODELS
var SongModel = Backbone.Model.extend({

});

// COLLECTIONS
var LibraryCollection = Backbone.Collection.extend({
  model: SongModel
});

var QueueCollection = Backbone.Collection.extend({
  model: SongModel
});

// collection : group of models
// var Songs = Backbone.Collection.extend({
//   model: Song
// });

// VIEWS
// view: render the models

var LibrarySongView = Backbone.View.extend({

});

var LibraryCollectionView = Backbone.View.extend({

});

var QueueSongView = Backbone.View.extend({
  tagName: 'tr',
  initialize: function(model) {
    this.model = model;
    this.render();
  },
  render: function() {
    return this.$el.append('<td>' + this.model.get('title') + '</td>');
  }
});

var QueueCollectionView = Backbone.View.extend({
  tagName: 'table',
  initialize: function(container, collection) {
    this.collection = collection;
    container.append(this.$el);
    this.render();
  },
  render: function() {
    this.collection.each(function(item) {
      var song = new QueueSongView(item);
      this.$el.append(song.$el);
    }, this);
  }
});

var PlayerView = Backbone.View.extend({

  el: '<audio controls preload auto />',
  initialize: function(container) {
    container.append(this.$el);
    this.render();
  },
  render: function() {
    return this.$el.attr('src', 'audio/jayz.mp3');
  }

});

// COLLECTION INSTANCES

var library = new LibraryCollection();

var queueA = new QueueCollection([
  new SongModel({
    title: "Song One"
  }),
  new SongModel({
    title: "Song Two"
  }),
  new SongModel({
    title: "Song Three"
  }),
  new SongModel({
    title: "Song Four"
  }),
  new SongModel({
    title: "Song Five"
  }),
]);

var queueB = new QueueCollection([
  new SongModel({
    title: "Song Six"
  }),
  new SongModel({
    title: "Song Seven"
  }),
  new SongModel({
    title: "Song Eight"
  }),
  new SongModel({
    title: "Song Nine"
  }),
  new SongModel({
    title: "Song Ten"
  }),
]);

// VIEW INSTANCES

var libraryView = new LibraryCollectionView();

var queueViewA = new QueueCollectionView($('#queueViewA'), queueA);

var queueViewB = new QueueCollectionView($('#queueViewB'), queueB);

var playerViewA = new PlayerView($('.playerLeft'));

var playerViewB = new PlayerView($('.playerRight'));

// var SongView = Backbone.View.extend({
//   tagName: "tr",

//   render: function(){
//     this.$el.html(this.model.get("title"));
//     return this;
//   }

// });

// //correlates to the 'Songs' collection

// var SongsView = Backbone.View.extend({

//   render: function(){
//     //keep 'this' keyword in context
//     var that = this;

//     //iterate through songs
//     this.model.each(function(song){
//       var songView = new SongView({ model: song });
//       that.$el.append(songView.render().$el);
//     });
//   }
// });


// adding song data to the models

//rendering the T1 Queue

// var Object_SongsView = new SongsView({
//   el: "#songsLeft", 
//   model: songs
// });

// Object_SongsView.render();
