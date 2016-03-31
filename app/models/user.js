var db = require('../mconfig');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var comparePassword = function(attemptedPassword, hashedPassword, callback) {
  console.log('THIS!!!!!', this);
  bcrypt.compare(attemptedPassword, hashedPassword, function(err, isMatch) {
    callback(isMatch);
  });
};

// db.userSchema.methods.hashPassword = function() {
//   var cipher = Promise.promisify(bcrypt.hash);
//   return cipher(this.get('password'), null, null).bind(this)
//     .then(function(hash) {
//       this.set('password', hash);
//     });
// };

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
// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;
