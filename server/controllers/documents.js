var Document = require('../models/document');

module.exports = {
  save: function(req, res) {
    var document = new Document({
      creator: req.body.user,
      title: req.body.title,
      content: req.body.content
    });
    document.save(function(err) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      } else {
        res.status(200).json({
          success: true,
          message: 'Document has been saved!'
        });
        return;
      }
    });
  },
  getAll: function(req, res) {
    Document.find({}).populate('creator').exec(function(err, documents) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(documents);
    });
  },
  findId: function(req, res) {
    Document.findById(req.params.id).populate('creator').exec(function(err, document) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.send(document);
    });
  },
  findTitle: function(req, res) {
    Document.find({
      title: req.body.title
    }).populate('creator').exec(function(err, document) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.send(document);
    });
  },
  delete: function(req, res) {
    Document.remove({
      _id: req.params.id
    }, function(err) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).send({
        success: true,
        message: 'Successful deletion of document!'
      });
    });
  },
  update: function(req, res) {
    Document.findOneAndUpdate({
      _id: req.params.id
    }, {
      title: req.body.title,
      content: req.body.content
    }, function(err) {
      if (err) {
        res.status(500).send(err.errmsg || err.message || err);
        return;
      } else {
        res.status(200).json({
          success: true,
          message: 'Successfully updated your document'
        });
        return;
      }
    });
  }
};
