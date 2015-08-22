(function(){"use strict";})();

////////////////////////////////////////////////////////////////////////////////
//                                                                    MODELS  //
////////////////////////////////////////////////////////////////////////////////

var getPlayer =  function(player){
  player = player.offsetParent().attr('class');
  return '.'+player.match(/\w+/)[0];
};



//defining model for the entire app
var AppModel = Backbone.Model.extend({
 initialize: function() {
    //instatiating both queue collections. 'queueA' and 'queueB' will both be an array of objects
    var queueA = new QueueCollection([]);
    var queueB = new QueueCollection([]);

    //setting a queue attribute that will have events: add, playsong, and remove
    this.set('queueA', queueA);
    this.set('queueB', queueB);

    //setting a current song attribute
    this.set('currentSongA', new SongModel());
    this.set('currentSongB', new SongModel());

    this.get('queueA').on('playsong', function(song){
     this.set('currentSongA', song);
   }, this);

    this.get('queueB').on('playsong', function(song){
      this.set('currentSongB', song);
    }, this);

    // console.log('Console longgin from line 30', this.get('currentSongA'));
    
    //binding a callback to both queues that will set the current song. it will be invoked when the 'playsong' event is fired from 'QueueCollection'
    queueA.on('playsong', function(song) {
      this.set('currentSongA', song);
    }, this);
    
    queueB.on('playsong', function(song) {
      this.set('currentSongB', song);
    }, this);

  },

});

//defining a model for a song
var SongModel = Backbone.Model.extend({
  // This function is called from the html5 player in playerView
  // It triggers an 'ended' event that is listened to by its collection, QueueCollection
  play: function(player){
    // Triggering an event here will also trigger the event on the collection
    this.trigger('playsong', this);
  },
  dequeue: function(){
    this.trigger('dequeue', this); // Dequeue will be listened to on the QueueCollection
  },

  ended: function(){
     // this.pause(player);
     this.trigger('ended', this); // ended event will be listened to the QueueCollection
   },


 });

////////////////////////////////////////////////////////////////////////////////
//                                                               COLLECTIONS  //
////////////////////////////////////////////////////////////////////////////////

//define a collection class for our song library
var LibraryCollection = Backbone.Collection.extend({
  //model contained within the library
  model: SongModel,

  //where our songs collection exists on the server
  url: 'https://trntbl3000.herokuapp.com/songs'
});

//define a collection class for our queue
var QueueCollection = Backbone.Collection.extend({
  //model contained within the queue
  model: SongModel,

  // When a song ends, it triggers an ended event. This is caught here by QueueCollection
  initialize: function(){
    this.on( 'dequeue', this.dequeue, this );
    this.on( 'ended', this.playNext, this );
    this.on( 'remove', this.dequeue, this);
    
    // this.dequeueTest();
  },

  //define enqueue method, which will be fired from the button in 'LibrarySongView'
  enqueue: function(song) {
    //add song to the queue
    this.add(song);

    //if this is the only song in the queue, send the audio to its corresponding player
    if (this.length === 1) {
      this.trigger('playsong', this.at(0));
    }
  },

   //define dequeue method, which will be fired from 'AppModel'
   dequeue: function(song) {
    //remove the song
    if (this.at(0) === song) {
      this.playNext();
    } else {      
      this.remove(song);
    }

  },

  playNext: function(){
    this.shift();
    if( this.length >= 1 ){
      this.playFirst();
    } else {
      this.trigger('stop');
    }
  },

  playFirst: function(){
    this.at(0).play();
  },

  events: {
    'click': function() {
      this.model.dequeue();
    }
  }
});

////////////////////////////////////////////////////////////////////////////////
//                                                                     VIEWS  //
////////////////////////////////////////////////////////////////////////////////

//define view class for the entire app
var AppView = Backbone.View.extend({
  initialize: function(params) {
    this.startA = 0;
    this.startB = 0;
    
    //instantiating our turntables and crossfader
    this.playerViewA = new PlayerView($('.playerLeft'));
    this.playerViewB = new PlayerView($('.playerRight'));
    this.sliderView = new SliderView($('#sliderContainer'));
    this.speedViewA = new SpeedView($('.playerLeft'));
    this.speedViewB = new SpeedView($('.playerRight'));
    this.tableA = new TableView($('.playerLeft'));
    this.tableB = new TableView($('.playerRight'));
    
    //deckA
    this.deckA = new DeckView($('.playerLeft'));
    this.startPointA = new StartButtonView($('.deck', '.playerLeft'));
    this.setStartA = new SetStartButtonView($('.deck', '.playerLeft'));
    this.skipBackA = new SkipBackButtonView($('.deck', '.playerLeft'));
    this.playA = new PlayButtonView($('.playerLeft').find('.deck'));
    this.skipForA = new SkipForButtonView($('.deck', '.playerLeft'));

    //deckB
    this.deckB = new DeckView($('.playerRight'));
    this.startPointB = new StartButtonView($('.deck', '.playerRight'));
    this.setStartB = new SetStartButtonView($('.deck', '.playerRight'));
    this.skipBackB = new SkipBackButtonView($('.deck', '.playerRight'));
    this.playB = new PlayButtonView($('.deck', '.playerRight'));
    this.skipForB = new SkipForButtonView($('.deck', '.playerRight'));


    //listening for a change to our current song in the corresponding turntable, callback will be invoked when the change event is fired
    //'setSong' is defined in 'PlayerView'
    this.model.on('change:currentSongA', function(model) {
      this.playerViewA.setSong(model.get('currentSongA'));
    }, this);

    this.model.on('change:currentSongB', function(model) {
      this.playerViewB.setSong(model.get('currentSongB'));
    }, this);

    //when song ends, the callback function will be invoked and the ended song will be removed. 'dequeueA/B' is defined in 'AppModel'
    // this.playerViewA.on('ended', function() {
    //   console.log('this is**********************: ', this);
    //   this.model.dequeueA();
    // }, this);
    // this.playerViewB.on('ended', function() {
    //   this.model.dequeueB();
    // }, this);

    //'sliderView' is instantiated in 'AppModel', the callback responds to the 'x-fade' event when the user moves the crossfader
    //the volume control on both audio players are linked together and will respond to crossfader movement
    this.sliderView.on('x-fade', function(value) {
      value = parseFloat(value);
      this.playerViewA.setVolume(value > 0 ? 1 - value : 1);
      this.playerViewB.setVolume(value < 0 ? 1 + value : 1);
    }, this);

    this.speedViewA.on('speedA', function(value){
      value = parseFloat(value).toFixed(2);
      this.playerViewA.playbackRate(value);
      var speed = 2/value;
      $('.playerLeft').find('.timesig').text(value + 'x');
      $('.playerLeft').find('.spinning').css({
        '-webkit-animation': 'spin ' + speed + 's linear infinite',
        '-moz-animation': 'spin ' + speed + 's linear infinite', 
        'animation': 'spin ' + speed + 's linear infinite'
      });
    }, this);
    
    this.speedViewB.on('speedB', function(value){
      value = parseFloat(value).toFixed(2);
      $('.playerRight').find('.timesig').text(value + 'x');
      var speed = 2/value;
      $('.playerRight').find('.spinning').css({
        '-webkit-animation': 'spin ' + speed + 's linear infinite',
        '-moz-animation': 'spin ' + speed + 's linear infinite', 
        'animation': 'spin ' + speed + 's linear infinite'
      });
      this.playerViewB.playbackRate(value);
    }, this);

    this.playA.on('ppA', function(){
      this.playerViewA.play();
    }, this);

    this.playB.on('ppB', function(){
      this.playerViewB.play();
    }, this);

    this.startPointA.on('startPointA', function(){
      this.playerViewA.currentTime(this.startA);
    }, this);

    this.startPointB.on('startPointB', function(){
      this.playerViewB.currentTime(this.startB);
    }, this);

    this.setStartA.on('setStartPointA', function(){
      this.startA = this.playerViewA.setCurrentTime(function(time){return time;});
    }, this);

    this.setStartB.on('setStartPointB', function(){
      this.startB = this.playerViewB.setCurrentTime(function(time){return time;});
    }, this);

    this.skipForA.on('skipFor.playerLeft', function(){
      this.playerViewA.currentTime(this.playerViewA.getEndTime(function(time){return time;}));
    }, this);

    this.skipBackA.on('skipBack.playerLeft', function(){
      this.playerViewA.currentTime(0);
    }, this);

    this.skipForB.on('skipFor.playerRight', function(){
      this.playerViewB.currentTime(this.playerViewB.getEndTime(function(time){return time;}));
    }, this);

    this.skipBackB.on('skipBack.playerRight', function(){
      this.playerViewB.currentTime(0);
    }, this);

  }
});

//define the view class for a song in the library
var LibrarySongView = Backbone.View.extend({
  //create a 'tr' tag name for each song
  tagName: 'tr',

  //initialize will take in a model (song) and both queues, and define them
  initialize: function(model, queueA, queueB) {
    this.model = model;
    this.queueA = queueA;
    this.queueB = queueB;
    this.render();
  },

  //render each song in our library
  render: function() {

    //create a button that, when clicked, will send a song to queueA
    var queueBtnA = $('<input type="button" class="btn btn-default btn-xs" value="QueueA"></input>');
    queueBtnA.click(function() {

      this.queueA.enqueue(this.model.clone());
    }.bind(this));

    queueBtnA.dblclick(function() {
      this.queueA.dequeue(this.model.clone());
    }.bind(this));
    //create a cell in our row that we can append our button to
    var tdA = $('<td>');
    tdA.append(queueBtnA);

    var queueBtnB = $('<input type="button" class="btn btn-default btn-xs" value="QueueB"></input>');
    queueBtnB.click(function() {
      this.queueB.enqueue(this.model.clone());
    }.bind(this));
    var tdB = $('<td>');
    tdB.append(queueBtnB);

    //render this view which will consist of two queue buttons with song title in the same row
    this.$el
    .append(tdA)
    .append('<td>' + this.model.get('title') + '</td>')
    .append('<td>' + this.model.get('artist') + '</td>')
    .append('<td>' + this.model.get('genre') + '</td>')
    .append(tdB);

    return this;

  }
});

//define the view class which will be comprised of the entire song library
var LibraryCollectionView = Backbone.View.extend({
  //create a table for the songs
  tagName: 'table',

  // adding .table classname for bootstrap
  className: 'table table-condensed',

  //passing in arguments that we want our render method to have access to
  initialize: function(container, collection, queueA, queueB) {
    this.collection = collection;
    this.collection.on('add', this.render.bind(this));
    this.queueA = queueA;
    this.queueB = queueB;
    container.append(this.$el);
    this.render();
  },

  //render the view
  render: function() {
    this.$el.html('');
    this.$el.append('<th></th>');
    this.$el.append('<th>Title</th>');
    this.$el.append('<th>Artist</th>');
    this.$el.append('<th>Genre</th>');
    this.$el.append('<th></th>');

    //iterate through the collection and append each song to the table
    this.collection.each(function(item) {
      var song = new LibrarySongView(item, this.queueA, this.queueB);
      this.$el.append(song.$el);
    }, this);
  }
});

//define the view class for a song in the queue
var QueueSongView = Backbone.View.extend({
  //create a new row for each song
  tagName: 'tr',

  className: 'queueSong',

  //passing in a song that will appended in the render method
  initialize: function(model) {
    this.model = model;
    this.render();
    // $('.queueSong').hover(
    //   function(){ 
    //     console.log('inside hover class');
    //     $(this).find('.delete_img').addClass('delete_hover') },
    //   function(){ $(this).find('.delete_img').removeClass('delete_hover') }
    //   );
},

    //render the view and append the song title to the row
    render: function() {
      var textToAppend = '<td>' + this.model.get('title') + '</td>'+'<td><img class="delete_img" src="assets/trash_can_red.png"></img></td>';
      return this.$el.append(textToAppend);
    },

    events: {
      'click': function(){
        this.model.dequeue();
      }, 
      'hover': function() {
        console.log('inside hover class');
        $(this).find('.delete_img').addClass('delete_hover');
      }
    }
  });

//define the view class for the entire queue of songs
var QueueCollectionView = Backbone.View.extend({
  //create a table for the queue
  tagName: 'table',

  // adding .table classname for bootstrap
  className: 'table table-condensed',

  //when a song is added or removed from the collection, render will be invoked to reflect changes
  initialize: function(container, collection) {
    this.collection = collection;
    this.collection.on('add remove', this.render.bind(this));
    container.append(this.$el);
    this.render();
  },

  //render the view
  render: function() {
    //reset the container element for each render
    this.$el.html('');

    //iterate through the collection to append the songs
    this.collection.each(function(item) {
      var song = new QueueSongView(item);
      this.$el.append(song.$el);
    }, this);
  }
});

//create a view class for our turntables, which is instantiated in 'AppView'
var PlayerView = Backbone.View.extend({
  getPlayer: function(player){
    player = player.offsetParent().attr('class');
    return '.'+player.match(/\w+/)[0];
  },
  
  //create a new audio element with controls
  el: '<audio controls preload autoplay/>',

  //callback is invoked when 'ended' is fired (when song is done playing)
  // NOTE: this is triggered by the html 5 player and is being listened for by our
  initialize: function(container) {
    var spinStart = {
      '-webkit-animation':'spin 3s ease-in',
      '-moz-animation':'spin 3s ease-in',
      'animation':'spin 3s ease-in',
    }; 

    var spinning = {
      '-webkit-animation':'spin 2s linear infinite',
      '-moz-animation':'spin 2s linear infinite',
      'animation':'spin 2s linear infinite',
    };

    this.$el.on('ended', (function () { 
      this.model.ended(this.$el);
      var p = this.getPlayer(this.$el);
      $('.arm', p).removeClass('armplay');
      $('.arm', p).addClass('armpause');
      $('.record', p).removeClass('spinning');
      $('.record', p).removeAttr('style');
    }).bind(this));

    this.$el.on('play', function(){
      this.model.play(this.$el);
      var p = this.getPlayer(this.$el);
      $('.arm', p).removeClass('armpause');
      $('.arm', p).addClass('armplay');
      $('.record', p).css(spinStart);
      setTimeout(function(){
        if($('.record', p).attr('style')){
          $('.record', p).addClass('spinning');
          $('.record', p).css(spinning);
        }      
      }, 3000);
    }.bind(this));

    this.$el.on('pause', function(){
      var p = this.getPlayer(this.$el);
      $('.arm', p).removeClass('armplay');
      $('.arm', p).addClass('armpause');
      $('.record', p).removeClass('spinning');
      $('.record', p).removeAttr('style');
    }.bind(this));

    //clear song out of player
    container.append(this.$el);
    this.render();
  },

  //'AppView' is listening for 'setSong' to fire
  setSong: function(song) {
    this.model = song; // Sets the model for player to be a song
    if (!this.model) {
      this.el.pause();
    }

    this.render();
  },

  //'AppView' is listening for 'setVolume' to fire
  setVolume: function(value) {
    this.$el.prop("volume", value);
  },

  playbackRate: function(value){
    this.$el.prop("playbackRate", value);
  },

  play: function(){
    if(this.el.paused){
      this.el.play();
    } else {
      this.el.pause();
    }
  },

  currentTime: function(time){
    this.el.currentTime=time;
  },

  setCurrentTime: function(callback){
    return callback(this.el.currentTime);
  },

  getEndTime: function(callback){
    return callback(this.el.duration);
  },

  //render the view for the player and get the song from the server
  render: function() {
    return this.$el.attr('src', this.model ? 'https://trntbl3000.herokuapp.com/' + this.model.get('filename') : '');
  }

});

var DeckView = Backbone.View.extend({
  el: '<div class="deck"></div>',
  initialize: function(container){
    container.append(this.$el);
  }      
});

var PlayButtonView = Backbone.View.extend({
  el: '<div id="play" class="deckButton">▌▌ ▶</div>',
  initialize: function(container){
    this.render(container);
    this.$el.on('click', function(){
      var pp = this.$el.offsetParent().attr('class');
      var trig = "";
      if(pp === 'playerLeft col-md-5'){
        trig = 'ppA';
      } else if(pp === 'playerRight col-md-5'){
        trig = 'ppB';
      }
      this.trigger(trig);
    }.bind(this));
  },
  render: function(container){
    container.append(this.$el);
  }
});

var StartButtonView = Backbone.View.extend({
  el: '<div id="startPoint" class="deckButton">start</div>',
  initialize: function(container){
    this.render(container);
    this.$el.on('click', function(){
      var player = this.$el.offsetParent().attr('class');
      var trig = "";

      if(player === 'playerLeft col-md-5'){
        trig = 'startPointA';
      } else {
        trig = 'startPointB';
      }
      this.trigger(trig);
    }.bind(this));
  },
  render: function(container){
    container.append(this.$el);
  }
});

var SetStartButtonView = Backbone.View.extend({
  el: '<div id="setStartPoint" class="deckButton">set</div>',
  initialize: function(container){
    this.render(container);
    this.$el.on('click', function(){
      var player = this.$el.offsetParent().attr('class');
      var trig = "";

      if(player === 'playerLeft col-md-5'){
        trig = 'setStartPointA';
      } else {
        trig = 'setStartPointB';
      }
      this.trigger(trig);
    }.bind(this));
  },

  render: function(container){
    container.append(this.$el);
  }

});

var SkipForButtonView = Backbone.View.extend({
  el: '<div id="skipFor" class="deckButton">▶▶▌</div>',
  initialize: function(container){
    this.render(container);
    this.$el.on('click', function(){
      this.trigger('skipFor'+getPlayer(this.$el));
    }.bind(this));
  },
  render: function(container){
    container.append(this.$el);
  }
});

var SkipBackButtonView = Backbone.View.extend({
  el: '<div id="skipBack" class="deckButton">▌◀◀</div>',
  initialize: function(container){
    this.render(container);
    this.$el.on('click', function(){
      this.trigger('skipBack'+getPlayer(this.$el));
    }.bind(this));
  },
  render: function(container){
    container.append(this.$el);
  }
});

//define a view class for our crossfader which is instantiated in 'AppView'
var SliderView = Backbone.View.extend({
  //create the slider element and declare a range which will help with 'setVolume' method in 'PlayerView'
  el: '<input id="slider" type="range" min="-1" max="1" step="0.1"></input>',
  initialize: function(container) {
    //append the slider, and invoke the callback on any crossfader movement by the user
    container.append(this.$el);
    this.$el.on('input', function() {
      this.trigger('x-fade', this.$el.val());
    }.bind(this));
  }
});

var SpeedView = Backbone.View.extend({
  el: '<input type="range" min="0.5" max="2" step="0.01" id="speedSlider"></input>',
  initialize: function(container){
    container.append(this.$el);
    this.$el.on('input', function() {
      var slider = this.$el.offsetParent().attr('class');
      var trig = "";
      if(slider === 'playerLeft col-md-5'){
        trig = 'speedA';
      } else if(slider === 'playerRight col-md-5'){
        trig = 'speedB';
      }
      this.trigger(trig, this.$el.val());
    }.bind(this));
  }
});

var TableView = Backbone.View.extend({
  el: '<div class="turntable"><img class="record" src="assets/record.png"></img><img class="arm armpause" src="assets/djarm.png"/></div>',
  initialize: function(container){
    container.prepend(this.$el);
  }
});

$(document).ready(function() {
  $('#airHorn').click(function() {
    $("<audio></audio>").attr({
      src: 'sfx/airHorn_1.mp3',
      autoplay: 'autoplay'
    });
  });

  ////////////////////////////////////////////////////////////////////////////////
  //                                                           MODEL INSTANCES  //
  ////////////////////////////////////////////////////////////////////////////////

  //create a model class for our entire app
  var appModel = new AppModel();

  ////////////////////////////////////////////////////////////////////////////////
  //                                                      COLLECTION INSTANCES  //
  ////////////////////////////////////////////////////////////////////////////////

  //library is a collection of the songs in our database
  var library = new LibraryCollection();

  //calling fetch on library makes a GET request and populates our library
  library.fetch();

  ////////////////////////////////////////////////////////////////////////////////
  //                                                            VIEW INSTANCES  //
  ////////////////////////////////////////////////////////////////////////////////

  //instantiating a new view for our library
  var libraryView = new LibraryCollectionView($('#libraryView'), library, appModel.get('queueA'), appModel.get('queueB'));

  //instantiating our queue collections
  var queueViewA = new QueueCollectionView($('#queueViewA'), appModel.get('queueA'));

  var queueViewB = new QueueCollectionView($('#queueViewB'), appModel.get('queueB'));

  //instantiate a view for our entire app
  var appView = new AppView({
    model: appModel
  });
});
