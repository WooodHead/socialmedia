var express = require('express');
var loki = require('lokijs');

var db = new loki('db.json');

db.loadDatabase({}, function() {
  var items = db.getCollection('items');

  if(!items) {
    items = db.addCollection('items');
    items.ensureUniqueIndex('id');
  }
});

var io = null;
var router = express.Router();

module.exports = {
  setIO: function(_io) { io = _io; },
  handleRequests: function() {
    router.get('/', function(req, res) {
      var items = db.getCollection('items');
      var between = items.where(function(item) {
        return req.query.start <= item.scheduled && item.scheduled <= req.query.end;
      });
      res.json(between);
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
      db.saveDatabase();
    });

    router.post('/', function(req, res) {
      var items = db.getCollection('items');
      var lokiObject = items.insert(req.body);
      lokiObject.id = lokiObject['$loki'].toString();
      items.update(lokiObject);
      res.json(lokiObject.id);
      if(io) { io.emit('items:post', lokiObject.id); }
      db.saveDatabase();
    });

    router.delete('/', function(req, res) {
      var items = db.getCollection('items');
      items.removeWhere(function(item) { return true; });
      res.sendStatus(200);
      if(io) { io.emit('items:delete:all', { }); }
      db.saveDatabase();
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
      db.saveDatabase();
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
        db.saveDatabase();
      }
    });

    return router;
  }
};
