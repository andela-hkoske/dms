var request = require('superagent');
module.exports = {
  getUsers: function(cb){
    request
    .get('localhost:3000/api/');
  }
};