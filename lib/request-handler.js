var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

// var db = require('../app/config');
var db = require('../app/mconfig');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

//Change these models
exports.fetchLinks = function(req, res) {
  db.Url.find({}, function(err, urls) {
    if (err) { 
      throw err; 
    }
    res.send(200, urls); 
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  db.Url.find({
    url: uri,
  }, function(err, found) {
    console.log('found!!!!!!', found);
    if (found.length > 0) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          throw err;
          return res.send(404);
        }
        var newUrl = db.Url({
          url: uri,
          title: title,
          baseUrl: req.headers.origin,
        });

        //save
        newUrl.save();
        res.send(200, newUrl);
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.find({
    username: username,
  }, function(err, user) {
    if (err) {
      throw err;
    }
    User.compare(password, user[0].password, function(match) {
      if (match) {
        console.log('comparison good!');
        util.createSession(req, res, user);
      } else {
        console.log('bad password!');
        res.redirect('/login');
      }
    });
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //check if user exists
  db.User.find({
    username: username,
  }, function(err, user) {
    if (err) {
      throw err;
    }
    if (user.length === 0) {
      //create new user
      var newUser = db.User({
        username: username,
        password: password,
      });

      //save new user (mongoDB)
      newUser.save(function(err) {
        if (err) {
          throw err;
        }
        util.createSession(req, res, newUser);
      });
    } else {
      //redirect to signup page
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  console.log('before anything happens in navToLink');
  db.Url.findOne({
    code: req.params[0],
  }, function(err, url) {
    console.log('URLS!!!!!!', url);
    if (err) {
      throw err;
    }
    if (!url) {
      res.redirect('/');
    } else {
      console.log('url.visits', url.__v);
      url.__v++;
      url.save();
      return res.redirect(url.url);
    }
  });
};






