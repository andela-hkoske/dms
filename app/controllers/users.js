var users = require('../services/users');
var color = require('colors');
var Table = require('cli-table');
var inquirer = require('inquirer');

module.exports = {
  login: function(args, callback, con) {
    if (!args.options.username || !args.options.password) {
      con.log(('ERROR: You need to provide both your username and password to login.').red + ('\n\nEXAMPLE:\n\n\tlogin -u myusername -p mypassword\n').cyan);
    } else {
      var formatOutput = function(err, res) {
        if (!err) {
          con.log(("Welcome to DocMan, ").green + (args.options.username).toUpperCase().blue + ("!").green);
        } else {
          con.log(('ERROR: There was a problem you logging in. Try again!\nMESSAGE: ' + err.message + '\nSPECIFICS: ' + res.body.message).red);
        }
      };
      users.login(args.options.username, args.options.password, formatOutput);
    }
    callback();
  },

  logout: function(args, callback, con) {
    var formatOutput = function(err, res) {
      if (!err) {
        con.log(('You have successfully logged out!').green);
      } else {
        con.log(('\nERROR: There was a problem logging you out!').red);
      }
    };
    users.logout(formatOutput);
    callback();
  },

  listUsers: function(args, callback, con) {
    var formatOutput = function(err, res) {
      if (!err) {
        var table = new Table({
          head: ['#No', 'ID', 'Username', 'Names', 'Email'],
          colWidths: [10, 30, 20, 20, 40]
        });
        for (var x = 0, l = res.body.length; x < l; x++) {
          table.push([
            x + 1,
            res.body[x]._id,
            res.body[x].username,
            res.body[x].name.first + ' ' + res.body[x].name.last,
            res.body[x].email
          ]);
        }
        con.log(table.toString());
      } else {
        con.log(('\nERROR: There was a problem printing a list of users!').red);
      }
    };
    users.getUsers(formatOutput);
    callback();
  },

  findUser: function(args, callback, con, id) {
    var formatOutput = function(err, res) {
      if (!err) {
        var table = new Table({
          head: ['#No', 'ID', 'Username', 'Names', 'Email'],
          colWidths: [10, 30, 20, 20, 40]
        });
        table.push([
          1,
          res.body._id,
          res.body.username,
          res.body.name.first + ' ' + res.body.name.last,
          res.body.email
        ]);
        con.log(table.toString());
      } else {
        con.log(('\nERROR: There was a problem printing a list of users!').red);
      }
    };
    users.findUser(args.options.id, formatOutput);
    callback();
  },

  signup: function(args, callback, con) {
    var password;
    var notEmpty = function(value) {
      if (value.trim().length !== 0) {
        return true;
      } else {
        return 'Please enter a valid value';
      }
    };
    var pwCheck = function(value) {
      if (value.trim().length < 8) {
        return 'Password needs to be greater than 8 characters long';
      } else if (!/\d/.test(value.trim()) || !/\W/.test(value.trim())) {
        return 'Password needs both digits and non-alphanumeric characters';
      } else if (!/[A-Z]/.test(value.trim()) || !/[a-z]/.test(value.trim())) {
        return 'Password needs both upper and lower case letters';
      } else {
        password = value;
        return true;
      }
    };
    var confirmPassword = function(value) {
      if (value === password) {
        return true;
      } else {
        return 'Confirmation needs to match password entered';
      }
    };
    var emailCheck = function(email) {
      if ((/^\S+@\S+\.\S+$/).test(email)) {
        return true;
      } else {
        return "Please enter a valid email address";
      }
    };
    var formatOutput = function(err, res) {
      if (res) {
        con.log(("Welcome to DocMan, ").green + (args.options.username).toUpperCase().blue + ("!").green);
      }
    };
    var questions = [{
      type: "input",
      name: "first_name",
      message: "What's your first name",
      validate: notEmpty
    }, {
      type: "input",
      name: "last_name",
      message: "What's your last name",
      validate: notEmpty
    }, {
      type: "input",
      name: "email",
      message: "What's your email",
      validate: emailCheck
    }, {
      type: "input",
      name: "username",
      message: "What username would you like",
      validate: notEmpty
    }, {
      type: "password",
      name: "password",
      message: "What password would you like",
      validate: pwCheck
    }, {
      type: "password",
      name: "confirmPw",
      message: "Confirm your password",
      validate: confirmPassword
    }];
    inquirer.prompt(questions, function(answers) {
      con.log(JSON.stringify(answers, null, "  "));
      callback();
    });
  }
};
