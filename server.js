const express = require('express')
const app = express()
const port = process.env.NODE_ENV === 'production' ? process.env.PORT || 3000;
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
require('./db');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'client/js')));

const UPLOAD = path.join(__dirname, process.env.UPLOAD);
module.exports = {
    UPLOAD
};

if (!fs.existsSync(UPLOAD)) {
    fs.mkdirSync(UPLOAD, { recursive: true });
}

const upload = multer({
    dest: UPLOAD
});

const ctrlAuth = require('./controllers/auth');
const ctrlSubscribe = require('./controllers/subscribe');
const ctrlTransaction = require('./controllers/transaction');
const ctrlChallange = require('./controllers/challange');
const ctrlUser = require('./controllers/user');

app.post('/api/register', ctrlAuth.register);
app.post('/api/login', ctrlAuth.login);
app.put('/api/user/update-profile', ctrlAuth.checkAuth, ctrlUser.updateProfile);
app.put('/api/user/update-kyc', ctrlAuth.checkAuth, upload.fields([{ name: 'frontPic', maxCount: 1 }, { name: 'backPic', maxCount: 1 }]), ctrlUser.updateKYC);
// app.post('/api/upload', ctrlAuth.checkAuth, upload.array('files', 2), (req, res) => {
//     console.log('done');
// });
app.post('/api/subscribe', ctrlSubscribe.subscribe);
app.get('/api/wallet', ctrlAuth.checkAuth, ctrlTransaction.getWallet);
app.get('/api/challanges', ctrlAuth.checkAuth, ctrlChallange.list);
app.post('/api/challanges/new', ctrlAuth.checkAuth, ctrlChallange.add);
app.get('/api/challanges/:challangeId/play', ctrlAuth.checkAuth, ctrlChallange.play);
app.post('/api/transaction/create-order', ctrlAuth.checkAuth, ctrlTransaction.createOrder);
app.post('/api/transaction/create-payment', ctrlAuth.checkAuth, ctrlTransaction.createPayment);

app.get('/', ctrlAuth.checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
app.get('/transactions', ctrlAuth.checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'transaction.html'));
});
app.get('/deposit', ctrlAuth.checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'deposit.html'));
});
app.get('/profile', ctrlAuth.checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'profile.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'login.html'));
});
app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'register.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
