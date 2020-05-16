// import modules
const express = require('express');

// local imports
const {jwtValidator} = require('../authentication/jwtMiddleware.js');
const User = require('../models/Users.js');

// express router
const router = express.Router();

// available routes
router.route('/')
.get(jwtValidator,async(req,res,next)=>{
       const u_id = req.user_id;
       // fetch user data from db
       try{
       	const user = await User.findOne({_id:u_id});
       	if(!user) res.status(400).send({error:"error fetching user data"});
       	res.status(200).send({error:null,user});
       }catch(e){
         // error connecting to db
         res.status(400).send("error connecting to db");
       }
})

module.exports = router;