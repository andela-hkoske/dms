var User = require('../models/user');
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var secretKey = config.secretKey;
var http = require('http');
var fs = require('fs');

function createToken(user) {
  var token = jsonwebtoken.sign({
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role,
    username: user.username
  }, secretKey, {
    expiresInMinute: 1440
  });
  return token;
}

function validEmail(email) {
  return (/^\S+@\S+\.\S+$/).test(email);
}

module.exports = {
  authenticate: function(req, res, next) {
    var respond = function(result, decoded) {
      if (result) {
        req.decoded = decoded;
        next();
      } else {
        res.status(403).send({
          success: false,
          message: 'Failed to authenticate user. No token provided.'
        });
      }
    };
    fs.readFile('./server/data/token.txt', 'utf8', function(err, token) {
      if (err) {
        respond(false);
        return console.log(err);
      }
      jsonwebtoken.verify(token, secretKey, function(err, decoded) {
        if (err) {
          respond(false);
        } else {
          respond(true);
        }
      });
    });
  },
  signup: function(req, res) {
    var user = new User({
      name: {
        first: req.body.firstname,
        last: req.body.lastname
      },
      email: req.body.email,
      username: req.body.username,
      role: req.body.role,
      password: req.body.password
    });
    user.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).send({
          success: false,
          message: err.message || err
        });
        return;
      } else {
        res.json({
          success: true,
          message: 'User has been created!'
        });
        return;
      }
    });
  },
  getUsers: function(req, res) {
    User.find({}, function(err, users) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(users);
    });
  },
  findUser: function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(user);
    });
  },
  removeUser: function(req, res) {
    User.remove({
      _id: req.params.id
    }, function(err, ok) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.send({
        message: 'Successfully deleted user.'
      });
    });
  },
  logout: function(req, res) {
    var respond = function(result) {
      if (result) {
        res.send({
          success: true,
          message: 'Successfully logged out'
        });
      } else {
        res.status(500).send({
          success: true,
          message: 'There was a problem logging out.'
        });
      }
    };
    fs.writeFile("./server/data/token.txt", '', function(err) {
      if (err) {
        respond(false);
        return console.log(err);
      }
      respond(true);
    });
  },
  login: function(req, res) {
    var login = this;
    User.findOne({
      username: req.body.username
    }).select('password').exec(function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        res.status(500).send({
          success: false,
          message: "User doesn't exist"
        });
      } else if (user) {
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.status(500).send({
            success: false,
            message: "Invalid password"
          });
        } else {
          var tokenStr = createToken(user);
          var respond = function(result) {
            if (result) {
              res.send({
                success: true,
                message: 'Successfully logged in',
                token: tokenStr
              });
            } else {
              res.status(500).send({
                success: true,
                message: 'There was a problem logging in.'
              });
            }
          };
          fs.writeFile("./server/data/token.txt", tokenStr, function(err) {
            if (err) {
              respond(false);
              return console.log(err);
            }
            respond(true);
          });
        }
      }
    });
  },
  update: function(req, res) {
    User.findOneAndUpdate({
      _id: req.params.id
    }, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      role: req.body.role,
      username: req.body.username
    }, function(err) {
      if (err) {
        res.status(500).send(err.errmsg || err.message || err);
        return;
      } else {
        res.json({
          success: true,
          message: 'Successfully updated your profile'
        });
        return;
      }
    });
  }
};
