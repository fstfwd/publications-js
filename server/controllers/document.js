
/**
 * Publications JS API
 * Document Controller
 * Michael Kelly and Carlos Paelinck
 */

var DocumentModel = require('../models/document')
  , UserModel = require('../models/user')

exports.index = function(req, res) {
  DocumentModel.find({ _user: req.user._id }).exec(function(err, documents) {
    res.json(documents || err);
  });
};

exports.show = function(req, res) {
  res.json(req.doc);
};

exports.update = function(req, res) {
  var docId = req.doc._id;

  DocumentModel.findByIdAndUpdate(docId, req.body, { upsert: true }, function(err, doc) {
    res.json(doc || err);
  });
};

exports.create = function(req, res) {
  var newDoc = new DocumentModel(req.body)
    
  UserModel.findById(req.user._id, function(err, user) {
    user.documents.push(newDoc);
    user.save(function() {
      newDoc.save(function(err, doc) {
        return res.json(doc || err);
      });
    });
  });
};

exports.remove = function(req, res) {
  var userId = req.user._id
    
  UserModel.findById(userId, function(err, user) {
    user.documents.remove(req.doc);
    user.save(function(err) {
      if (err) {
        res.json({ success: false });
        
      } else {
        req.doc.remove(function() {
          res.json({ success: true });
        });
      }
    });
  });
};

exports.pdf = function(req, res) {
  var pdf = req.doc.pdf();
  res.set('Content-type', 'application/pdf');
  pdf.pipe(res);
  pdf.end();
};