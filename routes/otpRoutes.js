const express = require('express');
const router = express.Router();
const Otps = require('../models/otpModels');
const User = require("../models/user");
const randomstring = require('randomstring');
const bcrypt=require('bcrypt')
const nodemailer = require('nodemailer');

function generateOTP() {
    return randomstring.generate({ length: 6, charset: 'numeric' });
}

router.post('/',async(req,res)=>{
    const { email } = req.body;
    const userMatch = await User.findOne({email});
    if(!userMatch) return res.send("user not found"); 
    const otp =generateOTP()
    await Otps.create({
        email,
        otp
    })
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,  
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verify',
        text: `Your OTP code is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending OTP: ' + error.message);
        }
        res.status(200).json({msg:"succesfull"})
    });
});
router.post('/verify', async(req,res)=>{
    const { otp,password,email } = req.body;
    const existingOTP = await Otps.findOneAndDelete({ otp });
    if (existingOTP) {
        const newPassword =await bcrypt.hash(password,10)
        await User.updateOne({
            email}, 
           {password}
        )
        res.status(200).redirect("/login");
    } else { 
        res.status(400).send('Invalid OTP');
    }
});

module.exports = router;