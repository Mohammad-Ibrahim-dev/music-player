const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt=require('jsonwebtoken')

router.get('/', (req, res) => {
    return res.render('login', { error: "" })
})

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: "*Invalid Username or Password" })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) return res.render("login", { error: "Invalid username or password" })
        else {
            const token = jwt.sign({ id:user._id, username:user.username}, process.env.JWT_SECRET)
            res.cookie('UID',token)
            return res.redirect(`/`)
        }
    }
    catch (err) {
        res.send("SOMETHING WRONG HAPPENED ? TRY AGAIN")
    }
})

module.exports = router; 