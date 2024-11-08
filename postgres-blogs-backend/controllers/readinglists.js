const router = require("express").Router();
const { UserBlogs } = require("../models");
const middleware = require('../util/middleware')


router.post("/", async (req, res) => {
  const { blogId, userId } = req.body;

  const blog_read = await UserBlogs.create({ blogId, userId });
  res.json(blog_read);
});

router.put("/:id", middleware.tokenExtractor, middleware.userExtractor, async (req, res) => {
  req.blog = await UserBlogs.findByPk(req.params.id);
  if (req.blog) {
    req.blog.read = req.body.read;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
