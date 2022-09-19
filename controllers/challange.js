const Challange = require('../models/challanges');
const Transaction = require('../models/transactions');
const ctrlTransaction = require('../controllers/transaction');
const fs = require('fs');
const { UPLOAD } = require('../server');
module.exports = {
    list: async (req, res) => {
        try {
            const { status } = req.query;
            const filter = {};
            if (status) filter.status = status;
            const challanges = await Challange.find(filter).sort({ createdAt: -1 }).populate(['creator', 'accepter', { path: 'submit', populate: ['winner'] }]).exec();
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
            const roomCode = req.query.roomCode;
            if (!roomCode) throw "Room Code is required";
            let challange = await Challange.findById(challangeId);
            const balance = await ctrlTransaction.getBalance(req.user._id);
            if (balance < challange.amount) throw "Balance is not enough";
            challange = await Challange.findOneAndUpdate({
                _id: challangeId,
                accepter: null,
                status: 'new'
            }, { $set: { accepter: req.user._id, status: 'running', roomCode } });
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
    submit: async (req, res) => {
        try {
            const { challangeId } = req.params;
            const pic = {};
            Object.keys(req.files).forEach((key) => {
                const { originalname, fieldname, path } = req.files[key][0];
                const splitName = originalname.split('.');
                const ext = splitName[splitName.length - 1];
                fs.copyFileSync(path, `${UPLOAD}/${challangeId}_${fieldname}.${ext}`);
                pic.name = `${challangeId}_${fieldname}`;
                pic.url = `${UPLOAD}/${challangeId}_${fieldname}.${ext}`;

                fs.unlinkSync(path);
            });
            await Challange.findByIdAndUpdate(challangeId, {
                $set: {
                    status: 'submitted',
                    submit: {
                        winner: req.user._id,
                        pic
                    }
                }
            });
            res.status(200).send({});
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }
    },
    approve: async (req, res) => {
        try {
            const { challangeId } = req.params;
            const challange = (await Challange.findOneAndUpdate({
                _id: challangeId,
            }, { $set: { status: 'approved' } }))?.toObject();
            if (!challange) throw "Challange not found"
            const transaction = new Transaction({ user: challange.submit.winner, challange: challange._id, type: 'Win Challange', amount: challange.amount * 2 * 8 / 10 });
            await transaction.save();
            res.status(200).send({});
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }

    },
    getSubmittedPic: async (req, res) => {
        try {
            const { challangeId } = req.params;
            const challange = await Challange.findById(challangeId);
            res.sendFile(challange.submit?.pic?.url);
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }
    }
};