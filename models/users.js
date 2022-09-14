var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  kyc: {
    number: {
      type: String,
      required: true
    },
    type: { // Aadhaar/Driving/Pan/License/Voter ID
      type: String,
      required: true
    },
    frontPic: {
      url: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    backPic: {
      url: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    status: {
      type: String, // pending/approved/failed
      required: true
    }
  }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;
