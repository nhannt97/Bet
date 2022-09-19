const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { UPLOAD } = require('../server');
module.exports = {
    list: async (req, res) => {
        try {
            const users = await User.find({ email: { $ne: 'admin@gmail.com' } });
            res.status(200).send(users.map((user) => ({
                email: user.email,
                phone: user.phone,
                name: user.name
            })));
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { phone, name } = req.body;
            const user = await User.findOneAndUpdate({ _id: req.user?._id }, {
                $set: {
                    phone,
                    name
                }
            }, { new: true });
            req.user = user;
            res.cookie('user', JSON.stringify({ _id: user._id, email: user.email, name: user.name, phone: user.phone, kyc: user.kyc }));
            res.status(200).send({ phone, name });
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }

    },
    updateKYC: async (req, res) => {
        try {
            const { number, type} = req.body;
            const frontPic = {};
            const backPic = {};
            Object.keys(req.files).forEach((key) => {
                const { originalname, fieldname, path } = req.files[key][0];
                const splitName = originalname.split('.');
                const ext = splitName[splitName.length - 1];
                fs.copyFileSync(path, `${UPLOAD}/${req.user._id}_${fieldname}.${ext}`);
                if (fieldname === 'frontPic') {
                    frontPic.name = `${req.user._id}_${fieldname}`;
                    frontPic.url = `${UPLOAD}/${req.user._id}_${fieldname}.${ext}`;
                }
                if (fieldname === 'backPic') {
                    backPic.name = `${req.user._id}_${fieldname}`;
                    backPic.url = `${UPLOAD}/${req.user._id}_${fieldname}.${ext}`;
                }
                fs.unlinkSync(path);
            });
            const user = await User.findOneAndUpdate({ _id: req.user?._id }, {
                $set: {
                    kyc: {
                        number,
                        type,
                        frontPic,
                        backPic
                    }
                }
            }, { new: true });
            res.cookie('user', JSON.stringify({ _id: user._id, email: user.email, name: user.name, phone: user.phone, kyc: user.kyc }));
            res.status(200).send(user.kyc);
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(401).send({
                error: JSON.stringify(error)
            });
        }
    },
};