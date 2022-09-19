const Razorpay = require('razorpay');
const Transaction = require('../models/transactions');
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {
    createOrder: async (req, res) => {
        try {
            const { amount, receipt } = req.body;
            const options = {
                amount,
                currency: "INR",
                receipt,
            };
            const order = await instance.orders.create(options);
            res.status(201).send(order);
        } catch (error) {
            console.log(error);
            res.status(500).send({error})
        }
    },
    createPayment: async (req, res) => {
        try {
            const { payId, orderId, user, paySignature } = req.body;
            let payment = await instance.payments.fetch(payId,{"expand[]":"card"});
            if (payment.status === 'captured') {
                const transaction = new Transaction({ user, orderId, payId, amount: payment.amount, type: 'Deposit', paySignature });
                const result = await transaction.save();
                res.status(201).send(result);
            } else throw "Error";
        } catch (error) {
            console.log(error);
            res.status(500).send({error});
        }
    },
    getWallet: async (req, res) => {
        try {
            const user = req.user;
            const transactions = await Transaction.find({ user: user._id }).sort({ createdAt: -1 });
            res.status(200).send({
                amount: transactions.map(tran => tran.amount).reduce((partialSum, a) => partialSum + a, 0),
                transactions
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({error});
        }
    },
    getBalance: async (userId) => {
        try {
            const transactions = await Transaction.find({ user: userId });
            return transactions.map(tran => tran.amount).reduce((partialSum, a) => partialSum + a, 0);
        } catch (error) {
            return 0;
        }
    }
};
