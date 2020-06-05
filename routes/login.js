// import modules
const router = require('express').Router();

// local imports
const {Login} = require('../src/functions/index.js');

// available routes
router.route('/')
.post(async(req,res,next)=>{
    const {username,password} = req.body;
    // using functions -> Login({username,password});
    try{
       const token = await Login({username,password});
       return res.status(200).send({error:null,msg:{user:username,token}});
    }catch(e){
      return res.status(200).send({error:e,msg:null});
    }  
});

// export module
module.exports = router;