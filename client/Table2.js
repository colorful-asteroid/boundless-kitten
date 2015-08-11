// right turntable

// model for songs
var Song2 = Backbone.Model.extend({

});

// collection : group of models
var Songs2 = Backbone.Collection.extend({
  model: Song2
});

// view: render the models
var SongView2 = Backbone.View.extend({
  tagName: 'tr',

  render: function(){
    this.$el.html(this.model.get("title"));
    return this;
  }

});

//correlates to the 'Songs' collection

var SongsView2 = Backbone.View.extend({

  render: function(){
    //keep 'this' keyword in context
    var that = this;

    //iterate through songs
    this.model.each(function(song){
      var songView2 = new SongView2({ model: song });
      that.$el.append(songView2.render().$el);
    });
  }
});


// adding song data to to the models

var songs2 = new Songs2([
  new Song2({title: "Song Six"}),
  new Song2({title: "Song Seven"}),
  new Song2({title: "Song Eight"}),
  new Song2({title: "Song Nine"}),
  new Song2({title: "Song Ten"}),
]);

//rendering the T2 Queue

var Object_SongsView2 = new SongsView2({el: 
  "#songsRight", 
  model: songs2
});

Object_SongsView2.render();

