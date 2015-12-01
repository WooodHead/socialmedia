var mongoose = require('mongoose');

module.exports = mongoose.model('Item', new mongoose.Schema({
  content: {
    message: String,
    network: String,
    postType: String,
    media: {
      fileName: String,
      fileUrl: String,
      url: String
    }
  },
  tags: [ String ],
  status: String,
  channels: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' } ],
  scheduled: { type: Date, default: Date.now },
  geo: {
    countries: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Country' } ],
    languages: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Language' } ],
    cities: [ { type: mongoose.Schema.Types.ObjectId, ref: 'City' } ],
    regions: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Region' } ]
  }
}));
