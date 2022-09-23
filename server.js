const express = require('express')
const app = express()
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;
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
app.get('/api/logout', ctrlAuth.checkAuth, ctrlAuth.logout);
app.put('/api/user/update-profile', ctrlAuth.checkAuth, ctrlUser.updateProfile);
app.put('/api/user/update-kyc', ctrlAuth.checkAuth, upload.fields([{ name: 'frontPic', maxCount: 1 }, { name: 'backPic', maxCount: 1 }]), ctrlUser.updateKYC);
app.get('/api/users', ctrlAuth.checkAuth, ctrlAuth.checkAdmin, ctrlUser.list);

// app.post('/api/upload', ctrlAuth.checkAuth, upload.array('files', 2), (req, res) => {
//     console.log('done');
// });
app.post('/api/subscribe', ctrlSubscribe.subscribe);
app.get('/api/wallet', ctrlAuth.checkAuth, ctrlTransaction.getWallet);
app.get('/api/challanges', ctrlAuth.checkAuth, ctrlChallange.list);
app.post('/api/challanges/new', ctrlAuth.checkAuth, ctrlChallange.add);
app.get('/api/challanges/:challangeId/play', ctrlAuth.checkAuth, ctrlChallange.play);
app.put('/api/challanges/:challangeId/submit', ctrlAuth.checkAuth, upload.fields([{ name: 'pic', maxCount: 1 }]), ctrlChallange.submit);
app.put('/api/challanges/:challangeId/approve', ctrlAuth.checkAuth, ctrlAuth.checkAdmin, ctrlChallange.approve);
app.get('/api/challanges/:challangeId/submitted-pic', ctrlAuth.checkAuth, ctrlAuth.checkAdmin, ctrlChallange.getSubmittedPic);
app.post('/api/transaction/create-order', ctrlAuth.checkAuth, ctrlTransaction.createOrder);
app.post('/api/transaction/create-payment', ctrlAuth.checkAuth, ctrlTransaction.createPayment);
app.post('/api/transaction/create-withdraw', ctrlAuth.checkAuth, ctrlTransaction.createWithdraw);
app.get('/api/transaction/get-withdraw-request', ctrlAuth.checkAuth, ctrlAuth.checkAdmin, ctrlTransaction.getWithdrawRequest);
app.put('/api/transaction/:transactionId/approve', ctrlAuth.checkAuth, ctrlAuth.checkAdmin, ctrlTransaction.approve);
app.put('/api/transaction/:transactionId/reject', ctrlAuth.checkAuth, ctrlAuth.checkAdmin, ctrlTransaction.reject);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/dashboard', ctrlAuth.checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'dashboard.html'));
});
app.get('/transactions', ctrlAuth.checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'transaction.html'));
});
app.get('/deposit', ctrlAuth.checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'deposit.html'));
});
app.get('/withdraw', ctrlAuth.checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'withdraw.html'));
});
app.get('/withdraw-request', ctrlAuth.checkAuth, ctrlAuth.checkAdmin, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'withdraw-request.html'));
});
app.get('/profile', ctrlAuth.checkAuth, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'profile.html'));
});
app.get('/users', ctrlAuth.checkAuth, ctrlAuth.checkAdmin, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'users.html'));
});
app.get('/challanges', ctrlAuth.checkAuth, ctrlAuth.checkAdmin, function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'challanges.html'));
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
