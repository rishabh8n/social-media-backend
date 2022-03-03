const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.route('/:id').get(async(req,res)=>{
    try{
        console.log(req.params);
        const user = await User.findOne({_id:req.user.id});
        const person = await User.findOne({_id:req.params.id});
        const personPosts = await Post.find({user:person._id}).populate('user','first').sort({createdAt:-1});
        console.log(person);
        if(!person){
            return res.status(201).json('No person Found');
        }
        if (user.friends.includes(req.params.id)){
            return res.json({person, personPosts, relation:{code:1, value: 'friends'}});
        }
        if (user.sentRequest.includes(req.params.id)){
            return res.json({person, personPosts, relation:{code:2, value: 'request sent'}});
        }
        if (user.receivedRequest.includes(req.params.id)){
            return res.json({person, personPosts, relation:{code:3, value: 'request received'}});
        }
        return res.json({person, personPosts, relation:{code:0, value: 'no relation'}});
    }catch(err){

    }
});

router.route('/search').post(async(req,res)=>{
    try{
        const user = await User.find({first:{$regex: req.body.name , $options: 'i'}, _id:{$ne: req.user.id}}).select('first').select('last');
        console.log(user);
        return res.json(user);
    }catch(err){}
});
module.exports = router;