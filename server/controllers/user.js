
/**
 * Publications
 * User Controller
 * 2014 Michael Kelly and Carlos Paelinck
 */

var bcrypt = require('bcrypt'),
  _ = require('lodash'),
  UserModel = require('../models/user'),
  DocumentModel = require('../models/document')

exports.show = function(req, res) {
  if (req.user) {
    UserModel.findById(req.user._id, function(err, user) {
      if (err) {
        res.send(401)
      } else {
        res.json(user)
      }
    })
  } else {
    res.send(401)
  }
};

exports.update = function(req, res) {
  var userJson = req.body

  UserModel.findById(req.user._id, function(err, user) {
    if (err) {
      res.send(401)
    } else {
      bcrypt.compare(userJson.currentPassword, user.password, function(err, isValid) {
        if (isValid) {
          var updateUser = _.extend(user, userJson)
          delete updateUser.currentPassword

          updateUser.save(function(err, user) {
            return res.json(user || err)
          })

        } else {
          res.send(422)
        }
      })
    }
  })
};

exports.login = function(req, res) {
  res.send(req.user || 401);
};

exports.logout = function(req, res) {
  var user = req.user;

  UserModel.findById(user._id, function(err, user) {
    if (!err && user) {
      if (user.temporary) {
        DocumentModel.remove({ _user: user }, function() {
          user.remove();
        });
      }
    }
  });

  req.logout();
  res.json({});
};

exports.create = function(req, res) {
  bcrypt.genSalt(5, function(err, salt) {
    bcrypt.hash(new Date().toLocaleTimeString(), salt, function(err, nameHash) {
      var userModel = new UserModel({
        name: nameHash,
        password: 'password',
        temporary: true
      });

      userModel.save(function(err, user) {
        res.json(user || null);
      });
    });
  });
};