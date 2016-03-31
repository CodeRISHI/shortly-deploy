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
  db.Url.find({}, function(err, res) {
    if (err) { throw err; }
    console.log('RES: ---------->', res);
  });

  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // });

};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  //Change these models
  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        //Change these models
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        //Change these models
        newLink.save().then(function(newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
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

  //Change these models
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       });
  //     }
  // });
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
  
  //Change these models
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });
};

exports.navToLink = function(req, res) {

  db.Url.find({
    code: req.params[0],
  }, function(err, url) {
    if (err) {
      throw err;
    }
    if (url.length === 0) {
      res.redirect('/');
    } else {
      //update visits counter
      //save it
      //redirect to new url.
    }
  });

  //Change these models
  //query database for url linked to code
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   //if that doesnt exists, serve home page
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     //if link does exist, increment visits,
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         //and redirect to the url.
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};






