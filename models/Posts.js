// import modules
const mongoose = require("mongoose");

// local imports
// const User = require('./Users.js');
// new Schema

const post = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	author: {
		authorName: {
			type: String,
		},
		authorId: {
			type: mongoose.ObjectId,
		},
		authorPic: {
			type: String,
		},
	},
	createdOn: {
		type: Date,
		default: Date.now,
	},
});

// schema to db
const Post = mongoose.model("posts", post);

// export module
module.exports = Post;
