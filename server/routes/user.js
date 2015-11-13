var UserCtrl = require('../controllers/users');

module.exports = function(api) {
  api.post('/users',UserCtrl.signup);
  api.post('/users/login',UserCtrl.login);
  api.use(UserCtrl.authenticate);
  api.get('/users',UserCtrl.getUsers);
  api.get('/users/logout',UserCtrl.logout);
  api.get('/users/:id',UserCtrl.findUser);
  api.delete('/users/:id',UserCtrl.removeUser);
  api.put('/users/:id',UserCtrl.update);
  return api;
};
