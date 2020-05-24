// import modules
const express = require('express');

// local imports
const {postValidator} = require('../authentication/formValidation.js');
const comments = require('./comments.js');
const User = require('../models/Users.js');
const Post = require('../models/Posts.js');
// popultaing postid in req for comments
// could not able to retrieve req.params inside comments router so created
// middleware to populate params in request
const commentsMiddleware = (req,res,next)=>{
     const p_id = req.params.pid;
     req.pid = p_id;
     next();
}
// express router
const router = express.Router();
router.use('/:pid/comments',commentsMiddleware,comments);

// available routes
// get all posts of a user
router.get('/',async(req,res,next)=>{
       const u_id = req.user_id;
       // fetch user data from db
       try{
       	 const posts = await Post.find({author:u_id});
         // posts is an array of objects
         return res.status(200).send({msg:posts,error:null});
       }catch(e){
         // error connecting to db
         res.status(400).send({msg:null,error:'could not connect to db'});
       }
})
// create a new post with author as user
router.put('/',async(req,res,next)=>{
      // retrieving data from req 
      const u_id = req.user_id;
      const {title,content} = req.body;
      // validate incoming data
      const {error} = postValidator({title,content});
      if(error) return res.status(400).send({msg:null,error:error.details[0].message});
      // creating post object
      const post = new Post({
        title : title,
        content : content,
        author : u_id,
      });
      try{
         // saving post to db
         const savedPost = await post.save();
         if(!savedPost) res.status(400).send({msg:null,error:"error while uploading post"});
         return res.status(200).send({msg:"post created successfully",error:null});
      }catch(e){
        res.status(400).send({msg:null,error:'could not connect to db'});
      }
})
// details of a post 
router.get('/:pid',async(req,res,next)=>{
      // post id from req parameters
      const p_id = req.params.pid;
      // fetch post from db
      try{
         const posts = await Post.findOne({_id:p_id});
         if(!posts) return res.status(400).send({msg:null,error:"post not found"});
         const {title,content} = await posts;
         return res.status(200).send({msg:{title,content},error:null});
      }catch(e){
        res.status(400).send({msg:null,error:'could not connect to db'});
      }
})
// if current user and author of the post are same
// to update a post
router.post('/:pid',async(req,res,next)=>{
      // validating incoming data from request
      const {error} = postValidator(req.body);
      if(error) return res.status(400).send({error:error.details[0].message});
      const post = {
        title : req.body.title,
        content : req.body.content,
      };
      // updating the post in db
      try{
        const updatedPost = await Post.update({_id:req.params.pid},{$set:post});
        console.log(updatedPost);
        if(!updatedPost) return res.status(400).send({msg:null,error:"could not update"});
        res.status(200).send({msg:'post updated successfully',error:null});
      }catch(e){
        res.status(400).send({msg:null,error:'could not connect to db'});
      }
})

router.delete('/:pid',async(req,res,next)=>{
    const p_id = req.params.pid;
    try{
        const deletedPost = await Post.deleteOne({_id : p_id});
        if(!deletedPost) return res.status(400).send({msg:null,error:"could not delete the post"});
        res.status(200).send({msg:'post deleted successfully',error:null});
    }catch(e){
      res.stauts(400).send({msg:null,error:"could not connect to server"});
    }
})

module.exports = router;