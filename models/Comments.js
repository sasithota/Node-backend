// import modules
const mongoose = require('mongoose');

// local imports


// New schema
const comment = new mongoose.Schema({
	content : {
		type : String,
		required : true
	},
	post : {
		type : mongoose.ObjectId,
		required : true
	},
	author : {
		type : mongoose.ObjectId,
		required : true
	},
	createdOn : {
		type : Date,
		default : Date.now
	}
});

// creating schema in db
const Comment = mongoose.model('comments',comment);

module.exports = Comment;