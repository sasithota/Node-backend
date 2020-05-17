// import modules
const mongoose = require('mongoose');

// local imports
// const User = require('./Users.js');
// new Schema

const Post = new mongoose.Schema({
	title:{
		type : String,
		required : true,
	},
	content : {
		type  :String,
		required : true
	},
	author : {
		type : mongoose.ObjectId,
		required: true
	},
	createdOn : {
		type : Date,
		default : Date.now
	}
});

const Posts = mongoose.model('posts',Post);

module.exports = Posts;