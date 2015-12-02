var express = require('express');
var restify = require('express-restify-mongoose');
var channel = require('../models/channel');

var io = null;
var router = express.Router();

module.exports = function() {
  restify.serve(router, channel, {
    plural: true,
    lowercase: true
  });

  return router;
};
