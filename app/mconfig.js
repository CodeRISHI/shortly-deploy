//mongoose related stuff
var mongodb = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myapp');

//Create Schema
var Schema = mongoose.Schema;

//Define Schemas (tables)
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

var urlSchema = new Schema({
  url: String, 
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
});

//Create model
var User = mongoose.model('User', userSchema);

var Url = mongoose.model('Url', urlSchema);

//export
module.exports.User = User;
module.exports.Url = Url;
module.exports.userSchema = userSchema;
module.exports.urlSchema = urlSchema;