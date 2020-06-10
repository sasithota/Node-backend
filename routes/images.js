const express = require("express");
const aws_upload = require("../src/functions/uploadImagesAWS.js");

// local imports
const { uploadProfilePic } = require("../src/functions/index.js");
const router = express.Router();

router.post("/", aws_upload.single("avatar"), async (req, res) => {
	const u_id = req.user_id;
	if (!req.file) return res.send({ error: "no image uploaded", msg: null });
	try {
		const updatedProfile = await uploadProfilePic(req.file, u_id);
		return res.status(200).send({ error: null, msg: updatedProfile });
	} catch (e) {
		return res.status(200).send({ error: e, msg: null });
	}
});

module.exports = router;
