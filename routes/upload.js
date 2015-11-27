var express = require('express');
var multer  = require('multer');

var router = express.Router();
var upload = multer({ dest: 'public/images' });

module.exports = function() {
  router.post('/', upload.single('item'), function(req, res) {
    res.status(200).send(req.file.filename);
  });

  return router;
};
