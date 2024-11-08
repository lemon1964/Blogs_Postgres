const router = require("express").Router();
const { sequelize } = require('../util/db');
const { Blog } = require('../models');

router.get("/", async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ],
      group: 'author',
      order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
    });
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
