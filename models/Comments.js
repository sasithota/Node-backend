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
		authorName : {
			type :String
		},
		authorId : {
			type : mongoose.ObjectId
		}
	},
	createdOn : {
		type : Date,
		default : Date.now
	}
});

// creating schema in db
const Comment = mongoose.model('comments',comment);

module.exports = Comment;