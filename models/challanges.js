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
  status: {
    type: String,
    required: true
  }
}, { timestamps: true });


const Challange = mongoose.model('Challange', challangeSchema);

module.exports = Challange;
