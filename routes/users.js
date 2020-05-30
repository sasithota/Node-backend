// imports
const router = require('express').Router();

// Local imports
const User = require('../models/Users.js');

// routes
// details of current user
router.post('/',async(req,res,next)=>{
     const u_id = req.body.uid;
     console.log(u_id);
     // db query
     try{
        const user = await User.findOne({_id:u_id});
        if(!user) return res.send({msg:null,error:'user not found'});
        return res.send({msg:user,error:null});
     }catch(e){
        console.log('error connecting');
     	res.status(200).send('could not connect to db');
     }
});
router.post('/find',async(req,res,next)=>{
     const str = req.body.username;
     const reg = new RegExp(str);

     // search in db
     try{
         const users = await User.find({username:{$regex : reg,$options:`six`}});
         res.status(200).send({msg:users,error:null});
     }catch{
     	res.status(400).send({msg:null,error:'error connecting to db'});
     }
})

module.exports = router;