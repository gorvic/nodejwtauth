var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema 
var UserSchema = new Schema({
    name: String,
    acl_id: String,
    key: Number
});

module.exports = mongoose.model('acl_role_name', UserSchema);