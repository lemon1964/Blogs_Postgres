const router = require('express').Router();
const Session = require('../models/session');
const User = require('../models/user');
const middleware = require('../util/middleware')


router.delete('/', middleware.tokenExtractor, middleware.userExtractor, async (req, res) => {
  const user = req.user;
  await Session.destroy({ where: { token: req.token } });
  await User.update({ disabled: true }, { where: { id: user.id } });
  res.status(204).end();
});


module.exports = router;
