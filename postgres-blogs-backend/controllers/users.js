const router = require("express").Router();
const bcrypt = require("bcrypt");
const { Op } = require('sequelize')

const { User } = require("../models");
const { Blog } = require("../models");
const { UserBlogs } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read === "true"
  }
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password_hash', 'created_at', 'updated_at', 'id'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'created_at', 'updated_at'] },
        through: {
          model: UserBlogs,
          as: 'readinglists',
          attributes: ['id', 'read'],
          where
        },
      }
    ]
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    username,
    name,
    password_hash: passwordHash,
  });

  res.status(201).json(newUser);
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.name = req.body.name;
  await user.save();
  res.json(user);
});

module.exports = router;
