var mongoose = require( 'mongoose' );

var transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payId: String,
  orderId: String,
  paySignature: String,
  challange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challange',
    required: false
  },
  type: {
    type: String // Deposite/Withdraw/Play Challange/Win Challange/Lose Challange
  },
  amount: Number,
  status: String // pending/success/failed
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
