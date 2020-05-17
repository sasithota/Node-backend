// import modules
const express = require('express');

// local imports
const {jwtValidator} = require('../authentication/jwtMiddleware.js');
const {postValidator} = require('../authentication/formValidation.js');
const User = require('../models/Users.js');
const Post = require('../models/Posts.js');

// express router
const router = express.Router();

// available routes
router.get('/',jwtValidator,async(req,res,next)=>{
       const u_id = req.user_id;
       // fetch user data from db
       try{
       	 const posts = await Post.find({author:u_id});
         // posts is an array of objects
         if(posts.length==0) return res.status(200).send("create a post");
         return res.status(200).send(posts);
       }catch(e){
         // error connecting to db
         res.status(400).send("error connecting to db");
       }
})
router.post('/create',jwtValidator,async(req,res,next)=>{
      // retrieving data from req 
      const u_id = req.user_id;
      const {title,content} = req.body;
      // validate incoming data
      const {error} = postValidator({title,content});
      if(error) return res.status(400).send(error.details[0].message);
      // creating post object
      const post = new Post({
        title : title,
        content : content,
        author : u_id,
      });
      try{
         // saving post to db
         const savedPost = await post.save();
         if(!savedPost) res.status(400).send("error while uploading post");
         return res.status(200).send(savedPost);
      }catch(e){
        res.status(400).send(e);
      }
})

module.exports = router;