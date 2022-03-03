const express = require('express');
const cors = require('cors');
const mongoose=require('mongoose');
const bcrypt =require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 8000;
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri,{useNewUrlParser: true}
).catch(e=>{
    console.log(e.message)
});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("Database Connected");
});



app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true
}));
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Hellooooo World");
})


const User = require('./models/User');
const jwt = require('jsonwebtoken');

let authenticate = async(req,res,next) => {
    console.log(req.headers['access-token']);
    const token = req.headers['access-token'];
    if(!token){
        return res.status(401).json('Unauthorized');
    }
    let error ='';
    const {email} = jwt.verify(token, process.env.jwt_key, (err, decode)=>{
        if(err){
            error = err;
        }
        return decode;
    });
    if(error){
        return res.status(401).json('Bad Token');
    }
    const user = await User.findOne({email});
    if(!user)return res.json({message:'User not found'});
    req.user = user;
    req.token = token;
    next();
};

app.get('/getUser',authenticate,(req,res)=>{
    return res.json({id:req.user._id,first: req.user.first,last: req.user.last,email: req.user.email,token:req.token});
});


//Routers
const authRouter = require('./routers/auth')
app.use('/auth',authRouter);

const friendsRouter = require('./routers/friends');
app.use('/friends',authenticate,friendsRouter);

const personRouter = require('./routers/person');
app.use('/person',authenticate,personRouter);

const postRouter = require('./routers/post');
app.use('/post',authenticate,postRouter);


app.listen(PORT,()=>{
    console.log(`Server on ${PORT}`);
})