// imports
const router = require("express").Router();

// Local imports
const {
    fetchAUser,
    fetchUsers,
    getUserWithoutPosts,
    Follow,
    Unfollow,
    getUserIdByUsername,
} = require("../src/functions/index.js");
// routes
router.get("/simple/:user_id", async (req, res, next) => {
    const u_id = req.params.user_id;
    try {
        const userdetails = await getUserWithoutPosts(u_id);
        return res.status(200).send({ error: null, msg: userdetails });
    } catch (e) {
        return res.status(200).send({ error: e, msg: null });
    }
});
// details of current user
router.get("/details/:user_id", async (req, res, next) => {
    const u_id = req.params.user_id;
    // using functions
    try {
        const userdetails = await fetchAUser(u_id);
        return res.status(200).send({ error: null, msg: userdetails });
    } catch (e) {
        console.log(e);
        return res.status(200).send({ error: e, msg: null });
    }
});
router.post("/find", async (req, res, next) => {
    const str = req.body.username;
    try {
        const users = await fetchUsers(str);
        return res.status(200).send({ error: null, msg: users });
    } catch (e) {
        return res.status(200).send({ error: e, msg: null });
    }
});
// follow route
router.get("/follow/:user_id", async (req, res, next) => {
    const follower_id = req.user_id;
    const following_id = req.params.user_id;
    try {
        const response = await Follow(follower_id, following_id);
        return res.status(200).send({ error: null, msg: response });
    } catch (e) {
        return res.status(200).send({ error: e, msg: null });
    }
});
// unfollow route
router.get("/Unfollow/:user_id", async (req, res, next) => {
    const follower_id = req.user_id;
    const following_id = req.params.user_id;
    try {
        const response = await Unfollow(follower_id, following_id);
        return res.status(200).send({ error: null, msg: response });
    } catch (e) {
        return res.status(200).send({ error: e, msg: null });
    }
});

router.get("/userid/:username", async (req, res, next) => {
    const username = req.params.username;
    try {
        const id = await getUserIdByUsername(username);
        return res.status(200).send({ error: null, msg: id });
    } catch (e) {
        return res.status(200).send({ error: e, msg: null });
    }
});
module.exports = router;
