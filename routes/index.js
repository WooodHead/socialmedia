var express = require('express');
var path = require('path');
var router = express.Router();

module.exports = function() {
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/views/:name', function(req, res, next) {
    res.render(path.join(req.params.name, req.params.name));
  });

  router.get('/views/:dir/:filename', function(req, res, next) {
    res.render(path.join(req.params.dir, req.params.filename));
  });

  return router;
};
