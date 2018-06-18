// Discover Art model

// MongoDB just to test locally

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DiscoverArtSchema = new Schema(
  {
    title: {type: String, required: true},
    gallery: {type: Schema.ObjectId, ref: 'Gallery', required: true},
    description: {type: String, required: true},
    price: {type: String, required: true}
  }
);

// Virtual for Artwork's URL
// ArtworkSchema
// .virtual('url')
// .get(function () {
//   return '/artwork/' + this._id;
// });

//Export model
module.exports = mongoose.model('Artwork', ArtworkSchema);