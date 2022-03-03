const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.route('/').get(async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.user.id}).select('friends');
        const posts = await Post.find({user:{$in:[...user.friends,req.user.id]}}).populate('user','first').sort({createdAt:-1});
        console.log(posts);
        res.json(posts);
    }catch(err){

    }
});
router.route('/add').post(async(req,res)=>{
    try{
        const {content} = req.body;
        const post = new Post({user: req.user.id, content, likes:[]});
        console.log(post);
        const success =await post.save();
        if(success){
           res.json('success');
        }
    }catch(err){

    }
});
module.exports = router;