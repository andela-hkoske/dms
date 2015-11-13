var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
require('./app/cli/index');

var app = express();

mongoose.connect(config.database, function(err) {
  if (err) {
    console.log('Error connecting to the database');
  } else {
    console.log('Connected to the database...');
  }
});

// Middleware
// Encodes data in url
app.use(bodyParser.urlencoded({
  extended: true
}));
// Tp parse jason values
app.use(bodyParser.json());
// Logs all the requests to the console
app.use(morgan('dev', {
  skip: function(req, res) {
    return res.statusCode < 400;
  }
}));

var api = require('./server/routes')(app, express);
app.use('/api', api);

app.listen(config.port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('app is up');
  }
});

process.on('SIGINT', function() {
  console.log("Exiting...");
  process.exit();
});
