const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// local imports
const User = require("../models/Users.js");
const storage = multer.diskStorage({
	destination: "public/uploads/",
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.fieldname + path.extname(file.originalname));
	},
});
const upload = multer({
	storage: storage,
});

const router = express.Router();

router.post("/", upload.single("avatar"), async (req, res) => {
	const u_id = req.user_id;
	if (!req.file) return res.send({ error: "no image uploaded", msg: null });
	try {
		const user = await User.update(
			{ _id: u_id },
			{ $set: { profilePic: req.file.filename } }
		);
		if (!user)
			return res.send({ msg: null, error: "error uploading to db" });
		res.send({ msg: "profilepic uploaded", error: null });
	} catch {
		res.status(400).send({ msg: null, error: "error connecting to db" });
	}
});

module.exports = router;
