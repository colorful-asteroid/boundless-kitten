//working on player view

var PlayerView = Backbone.View.extend({

  el: "<audio controls preload auto />'",

  id: "player",

  events: {

    'click': function() {
      this.model.play();
    }

  },

  initiazlize: function() {

    this.render();

  },

  render: function() {

    return this;

  }


});

var playerView = new PlayerView({
  el: '#test'
});

playerView.render();

console.log('#####: ', playerView);
