// imports
const router = require('express').Router();

// Local imports
const {fetchAUser,fetchUsers,getUserWithoutPosts} = require('../src/functions/index.js');


router.post('/simple/:user_id',async(req,res,next)=>{
      const u_id = req.params.user_id;
      try{
         const userdetails = await getUserWithoutPosts(u_id);
         return res.status(200).send({error:null,msg:userdetails});
      }catch(e){
        return res.status(200).send({error:e,msg:null});
      }
})
// routes
// details of current user
router.post('/details/:user_id',async(req,res,next)=>{
     const u_id = req.params.user_id;
     // using functions
     try{
       const userdetails = await fetchAUser(u_id);
       return res.status(200).send({error:null,msg:userdetails});
     }catch(e){
        console.log(e);
        return res.status(200).send({error:e,msg:null});
     }

});
router.post('/find',async(req,res,next)=>{
     const str = req.body.username;
     try{
        const users = await fetchUsers(str);
        return res.status(200).send({error:null,msg:users});
     }catch(e){
        return res.status(200).send({error:e,msg:null});
     }
})


module.exports = router;