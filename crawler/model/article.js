var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
  num_id: Number,
  title: String,
  url: String,
  section: Number,
  time: Number,
  date: String,
  page: Number,
  index: Number,
  uniqId: Number
});

var lastDateSchema = mongoose.Schema({
  _id: {type: String, required: true},
  date: {type: String, default: "0"}
});

module.exports.articleModel = mongoose.model('articles', articleSchema);
module.exports.lastDateModel = mongoose.model('lastdates', lastDateSchema);
