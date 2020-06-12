// express router
const router = require("express").Router();

// local imports
const {
	likeAPost,
	unlikeAPost,
	likesCount,
} = require("../src/functions/index.js");

// routes
router.get("/", async (req, res, next) => {
	const p_id = req.pid;
	try {
		const count = await likesCount(p_id);
		return res.status(200).send({ error: null, msg: count });
	} catch (e) {
		return res.status(200).send({ error: e, msg: null });
	}
});
router.get("/like", async (req, res, next) => {
	const u_id = req.user_id;
	const p_id = req.pid;
	console.log(p_id);
	console.log(u_id);
	try {
		const updatedPost = await likeAPost(p_id, u_id);
		return res.status(200).send({ error: null, msg: updatedPost });
	} catch (e) {
		console.log(e);
		return res.status(200).send({ error: e, msg: null });
	}
});

router.get("/unlike", async (req, res, next) => {
	const u_id = req.user_id;
	const p_id = req.pid;
	console.log(p_id);
	console.log(u_id);
	try {
		const updatedPost = await unlikeAPost(p_id, u_id);
		return res.status(200).send({ error: null, msg: updatedPost });
	} catch (e) {
		console.log(e);
		return res.status(200).send({ error: e, msg: null });
	}
});

module.exports = router;
