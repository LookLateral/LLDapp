// Gallery model

// MongoDB just to test locally

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GallerySchema = new Schema(
  {
    artwork: {type: Schema.ObjectId, ref: 'Artwork', required: true},
    member: {type: Schema.ObjectId, ref: 'Member', required: true}
  }
);

// Virtual for Gallery's URL
GallerySchema
.virtual('url')
.get(function () {
  return '/gallery/' + this._id;
});

//Export model
module.exports = mongoose.model('Gallery', GallerySchema);