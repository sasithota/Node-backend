// external dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// import Database Models
const User = require("../../models/Users.js");
const Post = require("../../models/Posts.js");
const Comment = require("../../models/Comments.js");
// import Form Validators
const {
	loginValidator,
	postValidator,
} = require("../../authentication/formValidation.js");

// get followings and followers arguments->userid
const getFollowingAndFollowers = (id) => {
	return new Promise(async (resolve, reject) => {
		const Following = Array();
		const Followers = Array();
		// search database
		try {
			const user = await User.findOne({ _id: id });
			if (!user) return reject("user not found");
			user.following.map((item) => Following.push(item));
			user.followers.map((item) => Followers.push(item));
			return resolve({ Following, Followers });
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connect to db");
		}
	});
};

// Registering user logic arguments->userdetals{username,password}
const Register = (body) => {
	return new Promise(async (resolve, reject) => {
		// form data in body
		const { error } = loginValidator(body);
		if (error) return reject(error.details[0].message);
		// encrypting password
		const Salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(body.password, Salt);
		body.password = await hashedPassword;
		const user = new User(body);
		// insertion into database
		try {
			const createdUser = await user.save();
			return resolve(createdUser.username);
		} catch (e) {
			if (e) return reject("username already exists");
			return reject("could not connect to db");
		}
	});
};
// Login user Logic arguments->userdetals{username,password}
const Login = (body) => {
	return new Promise(async (resolve, reject) => {
		// form data in body
		const { error } = loginValidator(body);
		if (error) return reject(error.details[0].message);
		// Searching User in database
		try {
			const user = await User.findOne({ username: body.username });
			if (!user) return reject("username does not exist");
			// validating hashed password
			const comparedPass = await bcrypt.compare(
				body.password,
				user.password
			);
			if (!comparedPass)
				return reject("username or password is incorrect");
			// Generating jwt tokens
			const token = await jwt.sign(
				{ u_id: user.id },
				process.env.JWT_TOKEN_KEY
			);
			if (!token) reject("could not generate a token");
			return resolve(token);
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connect to db");
		}
	});
};
// <--------------------------------POSTS SECTION------------------------------------------------------->
// fetch users posts by his/her id arguments->userid
const fetchPosts = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({ _id: id });
			const userpic = await user.profilePic;
			const posts = await Post.find({ "author.authorId": id }).lean();
			posts.map((post) => {
				post.author.authorPic = userpic;
			});
			return resolve(posts);
		} catch {
			return reject("could not connect to db");
		}
	});
};

// fetch user related posts ->following posts arguments->userid
const fetchPostsRelated = (id) => {
	return new Promise(async (resolve, reject) => {
		const { Following } = await getFollowingAndFollowers(id);
		Following.push(id);
		// fetch posts from database
		try {
			const posts = await Post.find({
				"author.authorId": { $in: Following },
			})
				.sort({ createdOn: -1 })
				.lean();
			// await Promise for array.map;
			await Promise.all(
				posts.map(async (post) => {
					try {
						const user = await User.findOne({
							_id: post.author.authorId,
						});
						post.author.authorPic = await user.profilePic;
						console.log(post.author);
						console.log(user.profilePic);
					} catch (e) {
						console.log(e);
					}
				})
			).then(() => resolve(posts)); //<-----Promise resolved here
		} catch (e) {
			return reject("could not connect to database");
		}
	});
};

// insert post to database arguments->userid,username,postcontent
const pushAPost = (id, name, body) => {
	return new Promise(async (resolve, reject) => {
		// form data in body
		const { error } = postValidator(body);
		if (error) return reject(error.details[0].message);
		try {
			const user = await User.findOne({ _id: id });
			var pic = user.profilePic;
		} catch (e) {
			return reject(e);
		}
		const post = new Post({
			title: body.title,
			content: body.content,
			author: {
				authorName: name,
				authorId: id,
				authorPic: pic,
			},
		});
		// inserting into database
		try {
			const createdPost = await post.save();
			if (!createdPost) return reject("could not create post");
			return resolve("post created successfully");
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connect to database");
		}
	});
};
// fetch a post by it's id arguments->postid
const fetchAPost = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const post = await Post.findOne({ _id: id });
			if (!post) return reject("post not found or might be deleted");
			return resolve(post);
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connect to db");
		}
	});
};

// update a post by id arguments->postid,updatedcontent
const updateAPost = (id, body) => {
	return new Promise(async (resolve, reject) => {
		// form data in body
		const { error } = postValidator(body);
		if (error) return reject(error.details[0].message);
		// updating in database
		try {
			const updatedPost = await Post.update({ _id: id }, { $set: body });
			if (!updatedPost) return reject("could not update the post");
			return resolve("post updated successfully");
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connect to db");
		}
	});
};
// delete a post from database by its id arguments->postid
const deleteAPost = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const deletedPost = await Post.deleteOne({ _id: id });
			if (!deletedPost) return reject("could not delete the post");
			const deleteCommentsRelated = await Comment.deleteMany(
				{},
				{ postid: id }
			);
			return resolve("post deleted successfully");
		} catch (e) {
			return reject("could not connect to db");
		}
	});
};
// <--------------------------------COMMENTS SECTION------------------------------------------------------->
// fetch comments on a post argumetns->postid
const fetchComments = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const comments = await Comment.find({ post: id });
			return resolve(comments);
		} catch (e) {
			return reject("could not connect to db");
		}
	});
};

// create a new comment on a post by id arguments->userid,username,postid,content
const pushAComment = (userid, username, postid, content) => {
	return new Promise(async (resolve, reject) => {
		if (!content) return reject("content is allowed to be empty");
		const comment = new Comment({
			content,
			post: postid,
			author: {
				authorName: username,
				authorId: userid,
			},
		});
		// inserting into database
		try {
			const createdComment = await comment.save();
			if (!createdComment) return reject("could not create the comment");
			const pushToPost = await Post.update(
				{ _id: postid },
				{
					$inc: { commentsCount: 1 },
					$push: { comments: createdComment._id },
				}
			);
			return resolve("comment created successfully");
		} catch {
			return reject("could not connect to db");
		}
	});
};
// get a comment by its id
const getAComment = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const comment = await Comment.findOne({ _id: id });
			if (!comment)
				return reject("comment not found or might be deleted");
			return resolve(comment);
		} catch {
			return reject("could not connect to db");
		}
	});
};
// update a comment by its id arguments->commentid,content
const updateAComment = (id, content) => {
	return new Promise(async (resolve, reject) => {
		if (!content) return reject("content is not allowed to be empty");
		try {
			const updatedComment = await Comment.update(
				{ _id: id },
				{ $set: { content } }
			);
			return resolve("comment update successfully");
		} catch {
			return reject("could not connet to db");
		}
	});
};
// delete a comment by its id arguments->commentid,postid
const deleteAComment = (commentId, postId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const deletedComment = await Comment.deleteOne({ _id: commentId });
			if (!deletedComment) return reject("could not delete the comment");
			const id = mongoose.Types.ObjectId(commentId);
			const popFromPost = await Post.updateOne(
				{ _id: postId },
				{
					$inc: { commentsCount: -1 },
					$pull: { comments: id },
				}
			);
			console.log(popFromPost);
			if (!popFromPost) return reject("could not delete the comment");
			return resolve("comment deleted successfully");
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connet to db");
		}
	});
};

// <--------------------------------USERS SECTION------------------------------------------------------->

// fetch userdetails by id
const fetchAUser = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const posts = await fetchPosts(id);
			const { Following, Followers } = await getFollowingAndFollowers(id);
			const user = await User.findOne({ _id: id });
			const userdetails = {
				username: user.username,
				profilePic: user.profilePic,
				posts: posts,
				Following: Following,
				Followers: Followers,
			};
			return resolve(userdetails);
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connect to db");
		}
	});
};
// get userdetails without posts
const getUserWithoutPosts = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({ _id: id });
			const userdetails = {
				profile: user.proficPic,
				username: user.username,
				followers: user.followers.length,
				following: user.following.length,
			};
			return resolve(userdetails);
		} catch {
			return reject("could not connect to db");
		}
	});
};

// find users by regex
const fetchUsers = (regex) => {
	return new Promise(async (resolve, reject) => {
		const reg = new RegExp(regex);
		try {
			const users = await User.find({
				username: { $regex: reg, $options: `six` },
			});
			return resolve(users);
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connect to db");
		}
	});
};

// follow an user by his/her userid
const Follow = (followerId, followingId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.updateOne(
				{ _id: followingId },
				{ $push: { followers: followerId } }
			);
			const follower = await User.updateOne(
				{ _id: followerId },
				{ $push: { following: followingId } }
			);
			return resolve("follwing added successfully");
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connect to db");
		}
	});
};

// unfollow an user by his/her user_id
const Unfollow = (followerId, followingId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.updateOne(
				{ _id: followingId },
				{ $pull: { followers: followerId } }
			);
			const follower = await User.updateOne(
				{ _id: followerId },
				{ $pull: { following: followingId } }
			);
			return resolve("Unfollow successfully");
		} catch (e) {
			if (e) return reject(e);
			return reject("could not connect to db");
		}
	});
};

// get userid by username
const getUserIdByUsername = (username) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({ username });
			if (!user) return reject("user not found");
			return resolve(user._id);
		} catch (e) {
			if (e) return reject(e);
			return reject("Could not connect to db");
		}
	});
};

const uploadProfilePic = (file, userid) => {
	return new Promise(async (resolve, reject) => {
		try {
			const updatedProfile = await User.update(
				{ _id: userid },
				{ $set: { profilePic: file.location } }
			);
			if (!updatedProfile) return reject("could not update profilepic");
			return resolve("pic updated successfully");
		} catch (e) {
			if (e) return reject(e);
			return reject("could not find user");
		}
	});
};
//<--------------------------------------------------Like SECTION------------------------------------------------------->
const likeAPost = (postid, userid) => {
	return new Promise(async (resolve, reject) => {
		try {
			const updatedPost = await Post.updateOne(
				{ _id: postid },
				{ $push: { likes: userid }, $inc: { likesCount: 1 } }
			);
			return resolve("postLiked");
		} catch (e) {
			return reject("could not connect to db");
		}
	});
};

const unlikeAPost = (postid, userid) => {
	return new Promise(async (resolve, reject) => {
		try {
			const updatedPost = await Post.updateOne(
				{ _id: postid },
				{ $pull: { likes: userid }, $inc: { likesCount: -1 } }
			);
			return resolve("postdisLiked");
		} catch (e) {
			return reject("could not connect to db");
		}
	});
};

const likesCount = (postid) => {
	return new Promise(async (resolve, reject) => {
		try {
			const count = await Post.findOne({ _id: postid });
			return resolve(count.likesCount);
		} catch (e) {
			return reject("network error");
		}
	});
};

module.exports = {
	Register,
	Login,
	fetchPostsRelated,
	pushAPost,
	fetchAPost,
	updateAPost,
	deleteAPost,
	fetchComments,
	pushAComment,
	getAComment,
	updateAComment,
	deleteAComment,
	fetchAUser,
	fetchUsers,
	getUserWithoutPosts,
	Follow,
	Unfollow,
	getUserIdByUsername,
	uploadProfilePic,
	likeAPost,
	unlikeAPost,
	likesCount,
};
