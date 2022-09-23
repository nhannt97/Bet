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
                amount: amount * 100,
                currency: "INR",
                receipt,
            };
            const order = await instance.orders.create(options);
            res.status(201).send(order);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error })
        }
    },
    createPayment: async (req, res) => {
        try {
            const { payId, orderId, user, paySignature } = req.body;
            let payment = await instance.payments.fetch(payId, { "expand[]": "card" });
            if (payment.status === 'captured') {
                const transaction = new Transaction({ user, orderId, payId, amount: payment.amount / 100, type: 'Deposit', paySignature, status: 'success' });
                const result = await transaction.save();
                res.status(201).send(result);
            } else throw "Error";
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    },
    createWithdraw: async (req, res) => {
        try {
            const { accountNumber, ifscCode, holderName, amount } = req.body;
            const transaction = new Transaction({ user: req.user._id, accountNumber, ifscCode, holderName, amount: -amount, type: 'Withdraw', status: 'pending' });
            const result = await transaction.save();
            res.status(201).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    },
    getWallet: async (req, res) => {
        try {
            const user = req.user;
            const transactions = await Transaction.find({ user: user._id }).sort({ createdAt: -1 });
            res.status(200).send({
                amount: transactions.map(tran => tran.status === 'fail' ? 0 : tran.amount).reduce((partialSum, a) => partialSum + a, 0),
                transactions
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    },
    getWithdrawRequest: async (req, res) => {
        try {
            const transactions = await Transaction.find({ type: 'Withdraw' }).sort({ createdAt: -1 }).populate(['user']);
            res.status(200).send(transactions);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    },
    approve: async (req, res) => {
        try {
            const transaction = await Transaction.findByIdAndUpdate(req.params.transactionId, {
                $set: {
                    status: 'success'
                }
            }, { new: true });
            res.status(200).send(transaction);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    },
    reject: async (req, res) => {
        try {
            const transaction = await Transaction.findByIdAndUpdate(req.params.transactionId, {
                $set: {
                    status: 'fail'
                }
            }, { new: true });
            res.status(200).send(transaction);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    },
    getBalance: async (userId) => {
        try {
            const transactions = await Transaction.find({ user: userId });
            return transactions.map(tran => tran.status === 'fail' ? 0 : tran.amount).reduce((partialSum, a) => partialSum + a, 0);
        } catch (error) {
            return 0;
        }
    }
};
