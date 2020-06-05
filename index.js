// import modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// import Routes middlewares 
const Login = require('./routes/login.js');
const Register = require('./routes/register.js');
const Posts = require('./routes/posts.js');
const users = require('./routes/users.js');
const images = require('./routes/images.js');
const {jwtValidator} = require('./authentication/jwtMiddleware.js');

// Initialize express app
var app = express();
dotenv.config();

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname+'/public'));


// connect mongodb with mongoose
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true,useUnifiedTopology: true },()=>console.log("connected to db"));


// use Router Middlewares
app.use('/api/login',Login);
app.use('/api/register',Register);
app.use('/api/posts',jwtValidator,Posts); //jwValidator is authentication middleware
app.use('/api/users',jwtValidator,users); //jwValidator is authentication middleware
app.use('/api/images',jwtValidator,images); //jwValidator is authentication middleware

// availble router
app.get('/',(req,res)=>{
	res.sendFile('index.html');
})

// run app on port 5000;
const Port = process.env.PORT || 5000;
app.listen(Port,()=>console.log(`server started at ${Port}`));       