import mongoose from 'mongoose';

var KeywordSchema = new mongoose.Schema({
  keyword: String
});

export default mongoose.model('keywords', KeywordSchema);
