require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser');

const app = express()
const port = process.env.PORT || 3000;
const authentication = require('./middlewares/auth.middleware')
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const forgetRouter =require('./routes/forget');
const otpRouter= require("./routes/otpRoutes"); 
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log("mongoose connected")});

app.use(cookieParser());
app.use(express.json());  
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/login',loginRouter);
app.use('/forget',forgetRouter);
app.use('/otp',otpRouter); 
app.use('/signup',signupRouter);
app.use(authentication)

app.get(`/`,(req,res)=>{
  res.render("index",{profile:req.user.username.slice(0,1), fullname:req.user.username})
})

app.post('/logout',(req,res)=>{  
   res.clearCookie("UID")
   res.redirect('/') 
})   
 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})   