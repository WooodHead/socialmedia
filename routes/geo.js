var express = require('express');
var restify = require('express-restify-mongoose');
var geo = require('../models/geo');

var router = express.Router();

var options = {
  plural: true,
  lowercase: true
};

module.exports = function() {
  restify.serve(router, geo.country, options);
  restify.serve(router, geo.region, options);
  restify.serve(router, geo.city, options);
  restify.serve(router, geo.language, options);

  return router;
};
