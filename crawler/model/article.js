var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
  title: String,
  url: String,
  section: Number,
  time: Date
});

module.exports.articleModel = mongoose.model('article', articleSchema);
