var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
// mongodb+srv://24560002:Info123@csbu103.q3boj.mongodb.net/?retryWrites=true&w=majority&appName=CSBU103