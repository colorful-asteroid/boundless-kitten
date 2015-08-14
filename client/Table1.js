////////////////////////////////////////////////////////////////////////////////
//                                                                    MODELS  //
////////////////////////////////////////////////////////////////////////////////

var AppModel = Backbone.Model.extend({
  initialize: function() {
    var queueA = new QueueCollection([]);
    var queueB = new QueueCollection([]);

    queueA.on('playsong', function(song) {
      this.set('currentSongA', song);
    }, this);
    queueB.on('playsong', function(song) {
      this.set('currentSongB', song);
    }, this);

    this.set('queueA', queueA);
    this.set('queueB', queueB);

    this.set('currentSongA', new SongModel());
    this.set('currentSongB', new SongModel());
  }
});

var SongModel = Backbone.Model.extend({

});

////////////////////////////////////////////////////////////////////////////////
//                                                               COLLECTIONS  //
////////////////////////////////////////////////////////////////////////////////

var LibraryCollection = Backbone.Collection.extend({
  model: SongModel
});

var QueueCollection = Backbone.Collection.extend({
  model: SongModel,
  enqueue: function(song) {
    this.add(song);
    if (this.length === 1) {
      //play it somehow
      this.trigger('playsong', this.at(0));
    }
  }
});

////////////////////////////////////////////////////////////////////////////////
//                                                                     VIEWS  //
////////////////////////////////////////////////////////////////////////////////

var AppView = Backbone.View.extend({
  initialize: function(params) {
    this.playerViewA = new PlayerView($('.playerLeft'));
    this.playerViewB = new PlayerView($('.playerRight'));

    this.model.on('change:currentSongA', function(model){
      this.playerViewA.setSong(model.get('currentSongA'));
    }, this);

    this.model.on('change:currentSongB', function(model){
      this.playerViewB.setSong(model.get('currentSongB'));
    }, this);
  }
});

var LibrarySongView = Backbone.View.extend({
  tagName: 'tr',
  initialize: function(model, queueA, queueB) {
    this.model = model;
    this.queueA = queueA;
    this.queueB = queueB;
    this.render();
  },
  render: function() {
    var that = this;
    var queueBtnA = $('<input type="button" value="QueueA"></input>');
    queueBtnA.click(function() {
      that.queueA.enqueue(that.model.clone());
    });
    var tdA = $('<td>');
    tdA.append(queueBtnA);

    var queueBtnB = $('<input type="button" value="QueueB"></input>');
    queueBtnB.click(function() {
      that.queueB.enqueue(that.model.clone());
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
  initialize: function(container, collection, queueA, queueB) {
    this.collection = collection;
    this.queueA = queueA;
    this.queueB = queueB;
    container.append(this.$el);
    this.render();
  },
  render: function() {
    this.collection.each(function(item) {
      var song = new LibrarySongView(item, this.queueA, this.queueB);
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
    this.collection.on('add', this.render.bind(this));
    container.append(this.$el);
    this.render();
  },
  render: function() {
    this.$el.html('');
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
  setSong: function(song){
    this.model = song;
    if(!this.model){
      this.el.pause();
    }

    this.render();
  },
  render: function() {
    return this.$el.attr('src', this.model ? this.model.get('url') : '');
  }

});

////////////////////////////////////////////////////////////////////////////////
//                                                           MODEL INSTANCES  //
////////////////////////////////////////////////////////////////////////////////

var appModel = new AppModel();

////////////////////////////////////////////////////////////////////////////////
//                                                      COLLECTION INSTANCES  //
////////////////////////////////////////////////////////////////////////////////

var library = new LibraryCollection([
  new SongModel({
    title: "Jay-Z",
    url: 'audio/jayz.mp3'
  }),
  new SongModel({
    title: "Biggie",
    url: 'audio/big.mp3'
  }),
  new SongModel({
    title: "Nas",
    url: 'audio/nas.mp3'
  }),
  new SongModel({
    title: "Scarface",
    url: 'audio/scarface.mp3'
  }),
  new SongModel({
    title: "Q-Tip",
    url: 'audio/qtip.mp3'
  })
]);

////////////////////////////////////////////////////////////////////////////////
//                                                            VIEW INSTANCES  //
////////////////////////////////////////////////////////////////////////////////

var libraryView = new LibraryCollectionView($('#libraryView'), library, appModel.get('queueA'), appModel.get('queueB'));

var queueViewA = new QueueCollectionView($('#queueViewA'), appModel.get('queueA'));

var queueViewB = new QueueCollectionView($('#queueViewB'), appModel.get('queueB'));

var appView = new AppView({
  model: appModel
});
