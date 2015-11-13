var UserRole = require('../models/userRole');

module.exports = {
  create: function(req, res) {
    var userRole = new UserRole({
      role: req.body.role
    });
    userRole.save(function(err) {
      if (err) {
        res.status(500).send(err.errmsg || err);
        return;
      } else {
        res.status(200).json({
          success: true,
          message: 'Successfully created a new role'
        });
        return;
      }
    });
  },
  update: function(req, res) {
    UserRole.findOneAndUpdate({role: req.params.role},{
      role: req.body.role
    },function(err) {
      if (err) {
        res.status(500).send(err.errmsg || err);
        return;
      } else {
        res.status(200).json({
          success: true,
          message: 'Successfully updated a role'
        });
        return;
      }
    });
  },
  getUserRole: function(req, res) {
    UserRole.findOne({
      role: req.params.role
    }).exec(function(err, user) {
      if (err) {
        res.status(500).send(err.errmsg || err);
        return;
      } else if (!user) {
        res.status(500).json({
          success: false,
          message: 'User role not found'
        });
        return;
      } else {
        res.status(200).send(user);
        return;
      }
    });
  },
  removeRole: function(req, res) {
    UserRole.remove({
      role: req.params.role
    }, function(err, ok) {
      if (err) {
        res.status(500).send(err.errmsg || err);
        return;
      }
      res.send({
        message: 'Successfully deleted user role.'
      });
    });
  },
  getAllRoles: function(req, res) {
    UserRole.find({}).exec(function(err, users) {
      if (err) {
        res.status(500).send(err.errmsg || err);
        return;
      } else if (!users) {
        res.status(500).json({
          success: false,
          message: 'Error accessing user roles'
        });
        return;
      } else {
        res.status(200).send(users);
        return;
      }
    });
  }
};
