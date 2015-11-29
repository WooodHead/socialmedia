var express = require('express');
var restify = require('express-restify-mongoose');
var Item = require('../models/item');

var io = null;
var router = express.Router();

// http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

function broadcast(item, event) {
  if(io) {
    var scheduled = new Date(item.scheduled);
    var isoWeek = scheduled.getWeekNumber();

    io.emit('items:month:' + (scheduled.getMonth() - 1) + ':' + event, item);
    io.emit('items:week:' + isoWeek + ':' + event, item);
  }
}

module.exports = {
  setIO: function(_io) { io = _io; },
  handleRequests: function() {
    restify.serve(router, Item, {
      plural: true,
      lowercase: true,
      preDelete: function(req, res, next) {
        Item.findById(req.params.id, function(err, item) {
          if(err) return next(err);
          req.item = item;
          next();
        });
      },
      postCreate: function(req, res, next) {
        if(req.erm.statusCode === 201)
          broadcast(req.erm.result, 'new');
        next();
      },
      postUpdate: function(req, res, next) {
        if(req.erm.statusCode === 200)
          broadcast(req.erm.result, 'edit');
        next();
      },
      postDelete: function(req, res, next) {
        if(req.erm.statusCode === 204)
          broadcast(req.item, 'delete');
        next();
      }
    });

    return router;
  }
};
