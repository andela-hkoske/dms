var request = require('superagent');
module.exports = {
  login: function(username, password, cb) {
    request
      .post('http://localhost:3000/api/users/login')
      .send({
        username: username,
        password: password
      })
      .end(cb);
  },

  logout: function(cb) {
    request
      .get('localhost:3000/api/users/logout')
      .end(cb);
  },

  getUsers: function(cb) {
    request
      .get('localhost:3000/api/users')
      .end(cb);
  },

  findUser: function(id, cb) {
    request
      .get('localhost:3000/api/users/' + id)
      .end(cb);
  },

  signup: function(data, cb) {
    request
      .post('localhost:3000/api/users')
      .send(data)
      .end(cb);
  }

};
