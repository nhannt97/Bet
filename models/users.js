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
    },
    type: { // Aadhaar/Driving/Pan/License/Voter ID
      type: String,
    },
    frontPic: {
      url: {
        type: String,
      },
      name: {
        type: String,
      }
    },
    backPic: {
      url: {
        type: String,
      },
      name: {
        type: String,
      }
    },
    status: {
      type: String, // pending/approved/failed
    }
  }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;
