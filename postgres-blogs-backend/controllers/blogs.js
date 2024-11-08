const router = require("express").Router();
const { Op } = require('sequelize')
const middleware = require('../util/middleware')

const { Blog } = require("../models");
const { User } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC'],
    ]
  });
  res.json(blogs);
});


router.post("/", middleware.tokenExtractor, middleware.userExtractor, async (req, res) => {
  const { body } = req;
  const user = req.user;
  
  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' });
  }
  
  const blog = await Blog.create({ ...body, userId: user.id });
  res.json(blog);
});


router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", middleware.tokenExtractor, middleware.userExtractor, blogFinder, async (req, res) => {
  const user = req.user;

  if (!req.blog) {
    return res.status(404).end();
  }

  if (req.blog.userId !== user.id) {
    return res.status(401).json({ error: 'You do not have permission to delete this blog' });
  }

  await req.blog.destroy();
  res.status(204).end();
});

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  })

module.exports = router;
