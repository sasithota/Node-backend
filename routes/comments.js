// import modules 
const express = require('express');

// local imports
const Comment = require('../models/Comments.js');
const {jwtValidator} = require('../authentication/jwtMiddleware.js');

// express router
const router = express.Router();

// fetch comments on a post with p_id
router.get('/',jwtValidator,async(req,res,next)=>{
	// fetch post id from req parameters
	const p_id = req.pid;
	console.log(p_id);
	// fetch comments on a post from db
	try{
      const comments = await Comment.find({post:p_id});
      if(comments.length==0) return res.send({error:null,msg:null});
      return res.send({error:null,msg:comments});
	}catch(e){
        res.send({msg:null,error:'coudl not connect to db'});
	} 
});
// to create a new comment on a post
router.put('/',jwtValidator,async(req,res,next)=>{
	const u_id = req.user_id;
	const p_id = req.pid;
	console.log(p_id);
	const {content} = req.body;
	if(!content) return res.send({error:"content is required",msg:null});
	// add comment to db
	const comment = new Comment({
		content : content,
		post : p_id,
		author : u_id
	})
	try{
		const savedComment = await comment.save();
		if(!savedComment) return res.send({error:"could not append to comments",msg:null});
		return res.send({error:null,msg:'comment created successfully'});

	}catch(e){
		res.send({msg:null,error:'could not connect to db'});
	}

})
// to get details of a comment
router.get('/:cid',jwtValidator,async(req,res,next)=>{
	const c_id = req.params.cid;
	// find comment in db
	try{
	    const comment = await Comment.findById(c_id);
	    if(!comment) return res.send({msg:null,error:"error fetching comment"});
	    res.send({msg:comment,error:null});

	}catch{
		res.send({msg:null,error:"error connecting to db"});
	}
})
// if current user and author of the comment is same then accessible
// to modify a comment
router.post('/:cid',jwtValidator,async(req,res,next)=>{
	const {content} = req.body;
	if(!content) return res.send({msg:null,error:"content can not be null"});
	// update to db
	try{
      const updatedComment = await Comment.findByIdAndUpdate(req.params.cid,{$set:{content}});
      if(!updatedComment) return res.send({msg:null,error:"could not update comment"});
      res.send({msg:'comment updated successfully',error:null});
	}catch{
		res.send({msg:null,error:"error connecting to db"});
	}
})

router.delete('/:cid',jwtValidator,async(req,res,next)=>{
	const c_id = req.params.cid;
	try{
		const deletedComment = await Comment.deleteOne({_id:c_id})
        if(!deletedComment) return res.send({msg:null,error:'could not delete comment'});
        return res.send({msg:'comment deleted successfully',error:null});
	}catch(e){
		res.send({msg:null,error:"could not connect to db"});
	}
})


module.exports = router;