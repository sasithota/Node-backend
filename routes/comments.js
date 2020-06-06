// import modules
const router = require("express").Router();

// local imports
const {
	fetchComments,
	pushAComment,
	getAComment,
	updateAComment,
	deleteAComment,
} = require("../src/functions/index.js");

// fetch comments on a post with p_id
router.get("/", async (req, res, next) => {
	// fetch post id from req parameters
	const p_id = req.pid;
	try {
		const comments = await fetchComments(p_id);
		return res.status(200).send({ error: null, msg: comments });
	} catch (e) {
		return res.status(200).send({ error: e, msg: null });
	}
});
// to create a new comment on a post
router.put("/", async (req, res, next) => {
	const u_id = req.user_id;
	const u_name = req.user_name;
	const p_id = req.pid;
	const { content } = req.body;
	try {
		const createdComment = await pushAComment(u_id, u_name, p_id, content);
		return res.status(200).send({ error: null, msg: createdComment });
	} catch (e) {
		return res.status(200).send({ error: e, msg: null });
	}
});
// to get details of a comment
router.get("/:cid", async (req, res, next) => {
	const c_id = req.params.cid;
	try {
		const comment = await getAComment(c_id);
		return res.status(200).send({ error: null, msg: comment });
	} catch (e) {
		return res.status(200).send({ error: e, msg: null });
	}
});
// if current user and author of the comment is same then accessible
// to modify a comment
router.post("/:cid", async (req, res, next) => {
	const c_id = req.params.cid;
	const { content } = req.body;
	try {
		const updatedComment = await updateAComment(c_id, content);
		return res.status(200).send({ error: null, msg: updatedComment });
	} catch (e) {
		return res.status(200).send({ error: e, msg: null });
	}
});

router.delete("/:cid", async (req, res, next) => {
	const c_id = req.params.cid;
	try {
		const deletedComment = await deleteAComment(c_id);
		return res.status(200).send({ error: null, msg: deletedComment });
	} catch (e) {
		return res.status(200).send({ error: e, msg: null });
	}
});

module.exports = router;
