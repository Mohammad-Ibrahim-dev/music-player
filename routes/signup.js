const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('signup',{error:""});
});

router.post('/', async (req, res) => {
  let { email, username, phone, password } = req.body;
  try {
    if (!email || !username || !phone || !password) {
      return res.status(400).send('All fields are required.');
  
    }
    const match = await User.findOne({ email, phone });
    const hashedpassword=await bcrypt.hash(password,10)
    if (!match) {
      await User.create({
        email,
        username,
        phone, 
        password:hashedpassword
      });
      res.redirect('login')
    }
  } catch (error) {
    res.render('signup',{error:"*email or phone number already in used"})
  } 
})

module.exports = router; 