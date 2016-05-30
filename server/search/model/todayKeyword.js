import mongoose from 'mongoose';

var TodayKeywordSchema = new mongoose.Schema({
  keyword: String,
  count: Number
});

export default mongoose.model('today_keywords', TodayKeywordSchema);
