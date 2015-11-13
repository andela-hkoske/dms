var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserRolesSchema = new Schema({
  role: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }
});

module.exports = mongoose.model('UserRole', UserRolesSchema);
