// console.log('in soundcloud.js');
SC.initialize({
  client_id: 'YOUR_CLIENT_ID',
  redirect_uri: 'http://example.com/callback'
});

// initiate auth popup
SC.connect(function() {
  SC.get('/me', function(me) {
    alert('Hello, ' + me.username);
  });
});