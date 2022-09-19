var mongoose = require('mongoose');

var challangeSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accepter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gameType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: { // new/running/submitted/approved
    type: String,
    required: true
  },
  roomCode: String,
  submit: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pic: {
      url: String,
      name: String
    }
  }
}, { timestamps: true });


const Challange = mongoose.model('Challange', challangeSchema);

module.exports = Challange;
