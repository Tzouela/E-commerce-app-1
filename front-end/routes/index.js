var express = require('express');
var router = express.Router();
var { checkIfAuthorized } = require('./authMiddlewares');


/* GET home page. */
router.get('/', checkIfAuthorized, function(req, res, next) {
  res.render('index');
});

module.exports = router;
