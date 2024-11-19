const express = require("express")
const jwt = require('jsonwebtoken')
function authentication(req, res, next) { 
    const token = req.cookies.UID;
    if (!token) {
        return res.render('login',{error:""});
    }
  
    jwt.verify(token,process.env.JWT_SECRET, (err, user) => { 
        if (err) {
            return res.sendStatus(403);
        }
        req.user=user;
        next();
    });
  }

  module.exports = authentication;