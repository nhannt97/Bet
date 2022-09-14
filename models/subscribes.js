var mongoose = require( 'mongoose' );

var subscribeSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true });


const Subscribe = mongoose.model('Subscribe', subscribeSchema);

module.exports = Subscribe;
