const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const otp = require('../models/otp');
const otpGenerator = require('otp-generator');


let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

router.route('/signup').post(async (req, res) => {
    try {
    const { first, last, email, password } = req.body;
    //checking email in database
    const user =await User.findOne({email:email});
        if(user){
            console.log(user);
           return res.json("User already exist");
        }
    //creating user
    
        const token = jwt.sign({ first, last, email, password }, process.env.jwt_key, { expiresIn: '15m' });
        // let newOtp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        // const salt = await bcrypt.genSalt(10);
        // const hashotp = await bcrypt.hash(newOtp, salt);
        // let saveOTP = new otp({ email, otp: hashotp, token });
        // const success = await saveOTP.save();
        if (token) {
            let mailOptions = {
                from: `"Rishabh Raj" <rishabh8n@gmail.com>`,
                to: `${email}`,
                subject: `Account Verification`,
                html: `<a href='${process.env.FRONTEND}/signup/verify/${token}'>${process.env.FRONTEND}/signup/verify/${token}</a>`
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return console.log(err);
                }
                console.log("Message sent: %s", info.messageId);
            })
            res.json({ message: 'Verify email using link in email.' });
        }
    } catch (e) {
        console.log(e);
    }
});

router.route('/signup/verify').post(async (req, res) => {
    try{
    const {token} = req.body;
    let user = jwt.verify(token, process.env.jwt_key, async(err, user) => {
        if (err) {
            return res.status(203).json({ err,message:err.message });
        }
        const { first, last, email, password } = user;

    let checkUser = await User.findOne({ email: email });
        if (checkUser) {
            return res.status(200).json('User already verified.');
        }
    let newUser = new User({ first, last, email, password });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    let success = await newUser.save();
    if (success) {
        return res.json('Signed Up Successfully');
    }
        // return decode;
    });

    
    }catch (err) {
        console.log(err);
        res.json({ err: err.message })
    }
    // try {
    //     let checkUser = await User.findOne({ email: req.body.email });
    //     console.log(checkUser);
    //     if (checkUser) {
    //         return res.status(400).json({ err: 'User already verified.' });
    //     }
    //     let allOtp = await otp.find({ email: req.body.email });
    //     if (allOtp.length === 0) { return res.status(400).json('Otp expired'); }
    //     const currOtp = allOtp[allOtp.length - 1];
    //     const verifiedUser = await bcrypt.compare(req.body.otp, currOtp.otp);
    //     if (verifiedUser) {
    //         console.log('verified');
    //         let user = jwt.verify(currOtp.token, process.env.jwt_key, (err, decode) => {
    //             if (err) {
    //                 return res.status(400).json({ err });
    //             }
    //             return decode;
    //         });
    //         console.log(user);
    //         const { first, last, email, password } = user;
    //         let newUser = new User({ first, last, email, password });
    //         const salt = await bcrypt.genSalt(10);
    //         newUser.password = await bcrypt.hash(newUser.password, salt);
    //         let success = await newUser.save();
    //         const otpDelete = await otp.deleteMany({ email: currOtp.email })
    //         if (success) {
    //             return res.json('Signed Up Successfully');
    //         }
    //     } else {
    //         res.json({ err: 'Wrong OTP' });
    //     }
    // } catch (err) {
    //     console.log(err);
    //     res.json({ err: err.message })
    // }
});

router.route('/signin').post(async(req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({email});
    if(!user)return res.json({message:'User not found'});

    const success = await bcrypt.compare(password,user.password);
    if(!success){
      return res.json({message:'Incorrect Password'});
    }
    const token =jwt.sign({email:user.email},process.env.jwt_key,{expiresIn:'5h'});
    res.json({id:user._id,first: user.first,last: user.last,email: user.email,token});
});

module.exports = router;