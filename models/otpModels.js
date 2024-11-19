const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' } // OTP expires in 5 minutes
});

const Otps = mongoose.model('Otps', otpSchema);

module.exports = Otps;