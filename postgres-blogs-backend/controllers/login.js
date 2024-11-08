const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");
const Session = require("../models/session");

router.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(request.body.password, user.password_hash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  await User.update({ disabled: false }, { where: { id: user.id } });

  const userForToken = { id: user.id, username: user.username };
  const token = jwt.sign(userForToken, SECRET, { expiresIn: "1h" });
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  await Session.create({ userId: user.id, token, expiresAt });

  response.status(200).send({ token, username: user.username, name: user.name, id: user.id });
});

module.exports = router;
