const router = require('express').Router();
const User = require('../models/User');

router.route('/fr').get(async(req,res)=>{
    try{
        const friends = await User.findOne({email:req.user.email}).select('friends').populate('friends','first');
        console.log(friends);
        res.json(friends);
    }catch(err){

    }
});
router.route('/req-rec').get(async(req,res)=>{
    try{
        const friends = await User.findOne({email:req.user.email}).select('receivedRequest').populate('receivedRequest','first');
        console.log(friends);
        res.json(friends);
    }catch(err){

    }
});
router.route('/req-sent').get(async(req,res)=>{
    try{
        const friends = await User.findOne({email:req.user.email}).select('sentRequest').populate('sentRequest','first');
        console.log(friends);
        res.json(friends);
    }catch(err){

    }
});
router.route('/add').post(async(req,res)=>{
    try{
        const {id} = req.body;
        const user = await User.updateOne({email:req.user.email,sentRequest:{$ne:id}},{$push: {sentRequest: id}});
        const friend = await User.updateOne({_id: id, receivedRequest:{$ne:req.user.id }},{$push: {receivedRequest: req.user.id}});
        console.log(friend);
        res.json('success');
    }catch(err){

    }
});
router.route('/confirm').post(async(req,res)=>{
    try{
        const {id} = req.body;
        const user = await User.updateOne({email:req.user.email},{$addToSet: {friends: id}, $pull: {receivedRequest: id}});
        const friend = await User.updateOne({_id: id},{$addToSet: {friends: req.user.id}, $pull:{sentRequest: req.user.id}});
        console.log(friend);
        res.json('success');
    }catch(err){

    }
});
router.route('/remove').post(async(req,res)=>{
    try{
        const {id} = req.body;
        const user = await User.updateOne({email:req.user.email},{$pull: {friends: id}});
        const friend = await User.updateOne({_id: id},{$pull: {friends: req.user.id}});
        console.log(friend);
        res.json('success');
    }catch(err){

    }
});
router.route('/cancel').post(async(req,res)=>{
    try{
        const {id} = req.body;
        const user = await User.updateOne({email:req.user.email},{$pull: {sentRequest: id}});
        const friend = await User.updateOne({_id: id},{$pull: {receivedRequest: req.user.id}});
        console.log(friend);
        res.json('success');
    }catch(err){

    }
});
router.route('/delete').post(async(req,res)=>{
    try{
        const {id} = req.body;
        const user = await User.updateOne({email:req.user.email},{$pull: {receivedRequest: id}});
        const friend = await User.updateOne({_id: id},{$pull: {sentRequest: req.user.id}});
        console.log(friend);
        res.json('success');
    }catch(err){

    }
});
module.exports = router;
