var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');

// connect to database
mongoose.connect('mongodb://localhost/auth');
var schema = mongoose.Schema;
var objectId = schema.objectId;
var user = mongoose.model('user', new schema({
  id: objectId,
  login: String,
  email: {type: String, unique: true},
  password: String
}));

// middleware
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.render('index.jade');
});

app.get('/register', function(req, res) {
  res.render('register.jade');
});

app.post('/register', function(req, res) {
  res.json(req.body);
});

app.get('/login', function(req, res) {
  res.render('login.jade');
});

app.get('/dashboard', function(req, res) {
  res.render('dashboard.jade');
});

app.get('/logout', function(req, res) {
  res.redirect('/');
});

app.listen(3000);
