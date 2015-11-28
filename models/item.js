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
  scheduled: { type: Date, default: new Date() },
  geo: {
    countries: [{
      value: String,
      key: String
    }],
    languages: [{
      value: String,
      key: String,
    }],
    cities: [{
      value: String,
      key: String
    }],
    regions: [{
      value: String,
      key: String
    }]
  }
}));
