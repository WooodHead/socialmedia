var mongoose = require('mongoose');

var GeoSchema = {
  name: String
};

module.exports = {
  country: mongoose.model('Country', new mongoose.Schema(GeoSchema)),
  region: mongoose.model('Region', new mongoose.Schema(GeoSchema)),
  city: mongoose.model('City', new mongoose.Schema(GeoSchema)),
  language: mongoose.model('Language', new mongoose.Schema(GeoSchema)),
};
