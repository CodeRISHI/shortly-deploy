var db = require('../mconfig');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var comparePassword = function(attemptedPassword, hashedPassword, callback) {
  console.log('THIS!!!!!', this);
  bcrypt.compare(attemptedPassword, hashedPassword, function(err, isMatch) {
    callback(isMatch);
  });
};

db.userSchema.pre('save', function(next) {
  var password = this.password;
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

module.exports.compare = comparePassword;
