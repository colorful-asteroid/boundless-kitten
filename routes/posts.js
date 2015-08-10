var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/posts', function(req, res, next) {
  res.send('respond from / posts');
});

module.exports = router;
