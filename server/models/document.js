var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocumentSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

DocumentSchema.pre('save', function(next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});


module.exports = mongoose.model('Document', DocumentSchema);
