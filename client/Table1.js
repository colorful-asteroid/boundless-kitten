//left turntable

// model for songs
var Song = Backbone.Model.extend({

});

// collection : group of models
var Songs = Backbone.Collection.extend({
  model: Song
});

// view: render the models
var SongView = Backbone.View.extend({
  tagName: "tr",

  render: function(){
    this.$el.html(this.model.get("title"));
    return this;
  }

});

//correlates to the 'Songs' collection

var SongsView = Backbone.View.extend({

  render: function(){
    //keep 'this' keyword in context
    var that = this;

    //iterate through songs
    this.model.each(function(song){
      var songView = new SongView({ model: song });
      that.$el.append(songView.render().$el);
    });
  }
});


// adding song data to the models

var songs = new Songs([
  new Song({title: "Song One"}),
  new Song({title: "Song Two"}),
  new Song({title: "Song Three"}),
  new Song({title: "Song Four"}),
  new Song({title: "Song Five"}),
]);

//rendering the T1 Queue

var Object_SongsView = new SongsView({
  el: "#songsLeft", 
  model: songs
});

Object_SongsView.render();

