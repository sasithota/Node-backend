// import modules
const router = require("express").Router();

// local imports
const comments = require("./comments.js");
const likes = require("./likes.js");
const {
  fetchPostsRelated,
  pushAPost,
  fetchAPost,
  updateAPost,
  deleteAPost,
} = require("../src/functions/index.js");
// comments route
// comments route is post specific
router.use("/:pid/comments", postIdMiddleware, comments);
router.use("/:pid/likes", postIdMiddleware, likes);
// available routes
// get all posts of a user
router.get("/", async (req, res, next) => {
  const id = req.user_id;
  // using functioins getPostsRelated(userid);
  try {
    const posts = await fetchPostsRelated(id);
    return res.status(200).send({ error: null, msg: posts });
  } catch (e) {
    return res.status(200).send({ error: e, msg: null });
  }
});

// create a new post with author as user
router.put("/", async (req, res, next) => {
  // retrieving data from req
  const id = req.user_id;
  const name = req.user_name;
  const { title, content } = req.body;
  // using function pushAPost(userid,username,{title,content});
  try {
    const post = await pushAPost(id, name, { title, content });
    return res.status(200).send({ error: null, msg: post });
  } catch (e) {
    return res.status(200).send({ error: e, msg: null });
  }
});
// details of a post
router.get("/:pid", async (req, res, next) => {
  // post id from req parameters
  const p_id = req.params.pid;
  // using functions fetchAPost(postid);
  try {
    const getPost = await fetchAPost(p_id);
    return res.status(200).send({ error: null, msg: getPost });
  } catch (e) {
    res.status(200).send({ error: e, msg: null });
  }
});
// if current user and author of the post are same
// to update a post
router.post("/:pid", async (req, res, next) => {
  const pid = req.params.pid;
  const { title, content } = req.body;
  // using functions updateAPost(postid,{title,content});
  try {
    const updatedPost = await updateAPost(pid, { title, content });
    return res.status(200).send({ error: null, msg: updatedPost });
  } catch (e) {
    res.status(200).send({ error: e, msg: null });
  }
});

router.delete("/:pid", async (req, res, next) => {
  const p_id = req.params.pid;
  // using functions deleteAPost
  try {
    const deletedPost = await deleteAPost(p_id);
    return res.status(200).send({ error: null, msg: deletedPost });
  } catch (e) {
    res.status(200).send({ error: e, msg: null });
  }
});

// <----MIDDLEWARE----->
// popultaing postid in req for comments
// could not able to retrieve req.params inside comments router so created
// middleware to populate params in request
function postIdMiddleware(req, res, next) {
  const p_id = req.params.pid;
  req.pid = p_id;
  next();
}

module.exports = router;
