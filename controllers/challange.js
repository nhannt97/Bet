const Challange = require('../models/challanges');
const Transaction = require('../models/transactions');
const ctrlTransaction = require('../controllers/transaction');
module.exports = {
    list: async (req, res) => {
        try {
            const challanges= await Challange.find({ }).sort({ createdAt: -1 }).populate(['creator', 'accepter']).exec();
            res.status(200).send(challanges);
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }
        
    },
    add: async (req, res) => {
        try {
            const { amount, gameType } = req.body;
            const balance = await ctrlTransaction.getBalance(req.user._id);
            if (balance < amount) throw "Balance is not enough";
            const challange = new Challange({ amount, gameType, status: 'new', creator: req.user._id });
            const result = await challange.save();
            const transaction = new Transaction({ user: req.user._id, challange: challange._id, type: 'Add Challange', amount: -challange.amount });
            await transaction.save();
            res.status(201).send(result);
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }
        
    },
    play: async (req, res) => {
        try {
            const { challangeId } = req.params;
            let challange = await Challange.findById(challangeId);
            const balance = await ctrlTransaction.getBalance(req.user._id);
            if (balance < challange.amount) throw "Balance is not enough";
            challange = await Challange.findOneAndUpdate({
                _id: challangeId,
                accepter: null,
                status: 'new'
            }, { $set: { accepter: req.user._id, status: 'running' } });
            const transaction = new Transaction({ user: req.user._id, challange: challange._id, type: 'Play Challange', amount: -challange.amount });
            await transaction.save();
            res.status(200).send(challange);
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }
        
    },
};