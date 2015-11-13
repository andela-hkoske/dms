var vorpal = require('vorpal')();
var UsersCtrl = require('../controllers/users');

vorpal
  .command('users:login', 'Logs in a user')
  .option('-u, --username <username>', 'Specifies username')
  .option('-p, --password <password>', 'Specifies user password')
  .action(function(args, callback) {
    UsersCtrl.login(args, callback, this);
  });

vorpal
  .command('users:logout', 'Logs out current user')
  .action(function(args, callback) {
    UsersCtrl.logout(args, callback, this);
  });

vorpal
  .command('users:list', 'Prints a list of all registered users')
  .action(function(args, callback) {
    UsersCtrl.listUsers(args, callback, this);
  });

vorpal
  .command('users:signup', 'Creates a new user account')
  .action(function(args, callback) {
    UsersCtrl.signup(args, callback, this);
  });

vorpal
  .command('users:find', 'Finds a particular user')
  .option('-i, --id <id>', 'Specifies user ID')
  .action(function(args, callback) {
    UsersCtrl.findUser(args, callback, this);
  });



vorpal
  .delimiter('docman~$')
  .show();
