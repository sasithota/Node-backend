// import modules
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// local imports
const User = require('../models/Users.js');
const {Validator} = require('../authentication/formValidation.js');

// express router
const router = express.Router();

// available routes
router.route('/')
.post(async(req,res,next)=>{
    // validate incoming data with @hapi/joi validator
    const {error} = Validator(req.body);
    if(error) res.status(200).send({user:null,token:null,error:error.details[0].message});
    // checking existance of user in db 
    try{
       const user = await User.findOne({username:req.body.username});
       if(!user) res.status(200).send({user:null,token:null,error:"wrong username or password"});
       // compare hashed password and form password with bcyrpt
       const correctPass = await bcrypt.compare(req.body.password,user.password);
       console.log(correctPass);
       if(!correctPass) res.status(200).send({user:null,token:null,error:"wrong password"});
       // creating authentication token with jsonwebtoken
       const token = await jwt.sign({u_id : user.id},process.env.JWT_TOKEN_KEY);
       res.status(200).send({user:user.username,token:token,error:null});
    }catch(e){
      // if error connecting to db
      res.status(200).send(e);
    }
});

// export module
module.exports = router;