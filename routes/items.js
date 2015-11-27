var express = require('express');
var restify = require('express-restify-mongoose');
var item = require('../models/item');

var io = null;
var router = express.Router();

module.exports = {
  setIO: function(_io) { io = _io; },
  handleRequests: function() {
    restify.serve(router, item, {
      plural: true,
      lowercase: true
    });

    return router;
  }
};
