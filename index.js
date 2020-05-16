// import modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// import Routes middlewares 
const Login = require('./routes/login.js');
const Register = require('./routes/register.js');
const Posts = require('./routes/posts.js');

// Initialize express app
var app = express();
dotenv.config();

// middlewares
app.use(express.json());
app.use(cors());


// connect mongodb with mongoose
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true,useUnifiedTopology: true },()=>console.log("connected to db"));


// use Router Middlewares
app.use('/api/login',Login);
app.use('/api/register',Register);
app.use('/api/posts',Posts);

// run app on port 5000;
app.listen(5000,()=>console.log("server started at localhost:5000"));       