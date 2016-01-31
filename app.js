var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');

var Schema = mongoose.Schema;
var objectId = Schema.ObjectId;

// connect to Mongo database
mongoose.connect('mongodb://localhost/auth');

var User = mongoose.model('user', new Schema( {
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
  var user = new User({
    login: req.body.login,
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(error) {
    var err;
    if(error) {
      err = 'Something went wrong. Please try again!';
      if(error.code === 11000) {
        err = 'This email is already taken. Please use another one.';
      }
      res.render('register.jade', {error: err});
    } else {
      res.redirect('/dashboard');
    }

  });

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
