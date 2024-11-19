const express = require("express");
const router =express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/',(req,res)=>{
    res.render('forget')
})
   

module.exports=router;   