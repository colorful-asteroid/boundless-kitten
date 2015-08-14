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
  tagName: 'tr',
  initialize: function(model) {
    this.model = model;
    this.render();
  },
  render: function() {
    
    var queueBtnA = $('<input type="button" value="QueueA"></input>');
    queueBtnA.click(function() {
      console.log('someshit');
    });
    var tdA = $('<td>');
    tdA.append(queueBtnA);

    var queueBtnB = $('<input type="button" value="QueueB"></input>');
    queueBtnB.click(function() {
      console.log('someshit other shit');
    });
    var tdB = $('<td>');
    tdB.append(queueBtnB);

    this.$el
      .append(tdA)
      .append('<td>' + this.model.get('title') + '</td>')
      .append(tdB);

    return this;

  }
});

var LibraryCollectionView = Backbone.View.extend({
  tagName: 'table',
  initialize: function(container, collection) {
    this.collection = collection;
    container.append(this.$el);
    this.render();
  },
  render: function() {
    this.collection.each(function(item) {
      var song = new LibrarySongView(item);
      this.$el.append(song.$el);
    }, this);
  }
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

var library = new LibraryCollection([
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
  })
]);

var queueA = new QueueCollection([]);

var queueB = new QueueCollection([]);

// VIEW INSTANCES

var libraryView = new LibraryCollectionView($('#libraryView'), library);

var queueViewA = new QueueCollectionView($('#queueViewA'), queueA);

var queueViewB = new QueueCollectionView($('#queueViewB'), queueB);

var playerViewA = new PlayerView($('.playerLeft'));

var playerViewB = new PlayerView($('.playerRight'));
