// import modules
const jwt = require('jsonwebtoken');

// middleware for token validation
const jwtValidator = (req,res,next)=>{
	// retrieving auth token from request header
    const token = req.headers['auth-token'];
    if(!token) return res.status(400).send({error:"Not authorised"});
    // verifying auth token with jwt
    jwt.verify(token,process.env.JWT_TOKEN_KEY,(err,deconded)=>{
        if(err) return res.status(400).send({error:'invalid token'});
        // populating request with decoded auth token
        req.user_id = deconded.u_id;
        next();
        });
}

module.exports.jwtValidator = jwtValidator;