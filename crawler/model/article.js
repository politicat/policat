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

var CounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 0 }
});

var lastDateSchema = mongoose.Schema({
  _id: {type: String, required: true},
  date: {type: String, default: "0"}
})

var counter = mongoose.model('counter', CounterSchema);

articleSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, {"upsert": true, "new": true}, function(error, count)   {
        if(error)
            return next(error);

          doc.num_id = count.seq;
          next();
    });
});


module.exports.articleModel = mongoose.model('article', articleSchema);
module.exports.lastDateModel = mongoose.model('lastDate', lastDateSchema);
module.exports.counter = counter;
