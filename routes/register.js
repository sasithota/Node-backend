// import modules
const router = require('express').Router();

// local imports
const {Register} = require('../src/functions/index.js');

// available routes
router.put('/',async(req,res,next)=>{
	const {username,password} =req.body;
	// using functions ->Register({username,password})
	try{
       const user = await Register({username,password});
       return res.send({error:null,msg:user});
	}catch(e){
		return res.send({error:e,msg:null});
	}
});

// Export module
module.exports = router;