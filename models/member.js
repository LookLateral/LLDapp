//Member model

// MongoDB just to test locally

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MemberSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 50},
    gallery: {type: Schema.ObjectId, ref: 'Gallery', required: true}
  }
);

// Virtual for Members's full name
MemberSchema
.virtual('name')
.get(function () {
  return this.last_name + ', ' + this.first_name;
});

// Virtual for Members's URL
MemberSchema
.virtual('url')
.get(function () {
  return '/member/' + this._id;
});

//Export model
module.exports = mongoose.model('Member', MemberSchema);