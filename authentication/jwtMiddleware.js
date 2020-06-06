// import modules
const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");

// middleware for token validation
const jwtValidator = (req, res, next) => {
  // retrieving auth token from request header
  const token = req.headers["auth-token"];
  if (!token) return res.status(200).send({ error: "Not authorised" });
  // verifying auth token with jwt
  jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, deconded) => {
    if (err) return res.status(200).send({ error: "invalid token" });
    // populating request with decoded auth token
    try {
      const { username } = await User.findOne({ _id: deconded.u_id });
      req.user_id = deconded.u_id;
      req.user_name = username;
      next();
    } catch {
      res.status(200).send({ error: "invalid token" });
    }
  });
};

module.exports.jwtValidator = jwtValidator;
