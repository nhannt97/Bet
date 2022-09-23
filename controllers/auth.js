const jwt = require('jsonwebtoken');
const User = require('../models/users');
module.exports = {
    register: async (req, res) => {
        try {
            const { email, phone, name, password, rePassword } = req.body;
            if (password !== rePassword) throw 'Repassword not match';
            const user = new User({ email, phone, password, name });
            const result = await user.save();
            res.status(201).send(result);
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(500).send({
                error: JSON.stringify(error)
            });
        }

    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email, password });
            if (user) {
                token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '24h' });
                res.cookie('token', token);
                req.user = user;
                res.cookie('user', JSON.stringify({ _id: user._id, email, name: user.name, phone: user.phone, kyc: user.kyc }));
                res.status(200).send(user);
            } else throw 'Login failed!'
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(401).send({
                error: JSON.stringify(error)
            });
        }
    },
    logout: async (req, res) => {
        try {
            res.cookie('token', undefined);
            req.user = undefined;
            res.cookie('user', undefined);
            res.redirect(process.env.BASE_URL + '/login');
        } catch (error) {
            console.log(JSON.stringify(error))
            res.status(401).send({
                error: JSON.stringify(error)
            });
        }
    },
    checkAuth: async (req, res, next) => {
        try {
            const cookieString = req.headers.cookie;
            const cookie = {};
            if (!cookieString) throw "Unauthorized";
            cookieString.split(';').forEach((item) => {
                const key = item.split('=')[0].trim();
                const value = item.split('=')[1].trim();
                cookie[key] = value;
            });
            const decoded = jwt.verify(cookie.token, process.env.JWT_SECRET);
            const user = await User.findOne({ email: decoded.email });
            if (user) {
                req.user = user;
                res.cookie('user', JSON.stringify({ _id: user._id, email: user.email, name: user.name, phone: user.phone, kyc: user.kyc }));
            } else throw "Unauthorized";
            next();
        } catch (error) {
            console.log(error);
            res.status(401).send({
                error: 'Unauthorized'
            });
        }
    },
    checkAdmin: async (req, res, next) => {
        try {
            if (req.user.email !== 'admin@gmail.com') throw "Unauthorized";
            next();
        } catch (error) {
            console.log(error);
            res.status(401).send({
                error: 'Unauthorized'
            });
        }
    }
};