var express = require('express');
var loki = require('lokijs');

var db = new loki('db.json');

db.loadDatabase({}, function() {
  db.getCollection('items').ensureUniqueIndex('id');
});

var io = null;
var router = express.Router();

module.exports = {
  setIO: function(_io) { io = _io; },
  handleRequests: function() {
    router.get('/', function(req, res) {
      var items = db.getCollection('items');
      var all = items.find({});
      var ids = all.map(function(item) { return item.id ;});
      res.json(ids);
    });

    router.put('/', function(req, res) {
      var items = db.getCollection('items');
      items.removeWhere(function(item) { return true; });

      var ids = [];

      req.body.forEach(function(item) {
        var lokiObject = items.insert(item);
        lokiObject.id = lokiObject['$loki'];
        items.update(lokiObject);
        ids.push(lokiObject.id);
      });

      res.json(ids);
      if(io) { io.emit('items:put', ids); }
    });

    router.post('/', function(req, res) {
      var items = db.getCollection('items');
      var lokiObject = items.insert(req.body);
      lokiObject.id = lokiObject['$loki'];
      items.update(lokiObject);
      res.json(lokiObject.id);
      if(io) { io.emit('items:post', lokiObject.id); }
    });

    router.delete('/', function(req, res) {
      var items = db.getCollection('items');
      items.removeWhere(function(item) { return true; });
      res.sendStatus(200);
      if(io) { io.emit('items:delete:all', { }); }
    });

    router.get('/:id', function(req, res) {
      var items = db.getCollection('items');
      var item = items.by('id', req.params.id);

      if(!item) {
        res.sendStatus(404);
      } else {
        res.json(item);
      }
    });

    router.put('/:id', function(req,res) {
      var updated = false;
      req.body.id = req.params.id;

      var items = db.getCollection('items');
      var item = items.by('id', req.params.id);

      if(item) {
        // HACK: This should not be explicit
        item.content = req.body.content;
        item.tags = req.body.tags;
        item.status = req.body.status;
        item.channels = req.body.channels;
        item.scheduled = req.body.scheduled;
        item.geo = req.body.geo;

        items.update(item);
        updated = true;
      } else {
        items.insert(req.body);
      }

      res.sendStatus(200);

      if(io) {
        updated ?
          io.emit('items:' + item.id + ':put', req.body) :
          io.emit('items:post', item.id);
      }
    });

    router.delete('/:id', function(req, res) {
      var items = db.getCollection('items');
      var item = items.by('id', req.params.id);

      if(!item) {
        res.sendStatus(404);
      } else {
        items.remove(item);
        res.sendStatus(200);
        if(io) { io.emit('items:delete', item.id); }
      }
    });

    return router;
  }
};
