var express = require('express');
var loki = require('lokijs');

var db = new loki('db.json');

db.loadDatabase({}, function() {
  db.getCollection('items').ensureUniqueIndex('id');
});

var router = express.Router();

module.exports = function() {
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
  });

  router.post('/', function(req, res) {
    var items = db.getCollection('items');
    var lokiObject = items.insert(req.body);
    lokiObject.id = lokiObject['$loki'];
    items.update(lokiObject);
    res.json(lokiObject.id);
  });

  router.delete('/', function(req, res) {
    var items = db.getCollection('items');
    items.removeWhere(function(item) { return true; });
    res.sendStatus(200);
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
    req.body.id = req.params.id;

    var items = db.getCollection('items');
    var item = items.by('id', req.params.id);

    if(item) {
      items.remove(item);
    }

    items.insert(req.body);
    res.sendStatus(200);
  });

  router.delete('/:id', function(req, res) {
    var items = db.getCollection('items');
    var item = items.by('id', req.params.id);

    if(!item) {
      res.sendStatus(404);
    } else {
      items.remove(item);
      res.sendStatus(200);
    }
  });

  return router;
};