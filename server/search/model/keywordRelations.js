import mongoose from 'mongoose';

var KeywordRelationsSchema = new mongoose.Schema({
  keyword1_id: mongoose.Schema.ObjectId,
  keyword2_id: mongoose.Schema.ObjectId,
  total_count: Number,
  count_in_day: Number,
  updated_at: Date
});

export default mongoose.model('keyword_relations', KeywordRelationsSchema);
