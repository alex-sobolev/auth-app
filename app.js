var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var sessions = require('client-sessions');

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
app.use(sessions({
  cookieName: 'session',
  secret: 'dkwfrejkgkvkpengo0243090504959469',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

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
  user.save(function(errorReason) {
    var err;
    if(errorReason) {
      err = 'Something went wrong. Please try again!';
      if(errorReason.code === 11000) {
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

app.post('/login', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if(!user) {
      res.render('login.jade', {error: 'Invalid email or password'});
    } else {
      if(req.body.password === user.password) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('login.jade', {error: 'Invalid email or password'});
      }
    }
  });
});

app.get('/dashboard', function(req, res) {
  if(req.session && req.session.user) {
    User.findOne({email: req.session.user.email}, function(err, user) {
      if(!user) {
        req.session.reset();
        res.redirect('/login');
      } else {
        res.locals.user = user;
        res.render('dashboard.jade');
      }
    })
  } else {
    res.redirect('/login');
  }

});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.listen(3000);
