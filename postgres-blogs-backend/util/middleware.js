const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const config = require("./config");
const User = require("../models/user");
const Session = require('../models/session');


const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    return response.status(401).json({ error: "token missing" });
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const session = await Session.findOne({
    where: {
      userId: decodedToken.id,
      token: request.token,
      expiresAt: { [Op.gt]: new Date() },
    },
  });

  if (!session) {
    return response.status(401).json({ error: 'session expired or invalid' });
  }

  const user = await User.findByPk(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: "user not found" });
  }

  if (user.disabled) {
    return response.status(401).json({ error: 'account disabled, please contact admin' });
  }

  request.user = user;
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    const emailValidationError = error.errors.find(e => e.validatorKey === "isEmail");
    if (emailValidationError) {
      return res.status(400).json({
        error: ["Validation isEmail on username failed"],
      });
    }

    const yearValidationError = error.errors.find(e => e.path === "year");
    if (yearValidationError) {
      return res.status(400).json({
        error: "Validation error",
        message: "Year must be an integer between 1991 and the current year.",
      });
    }

    return res.status(400).json({ error: "Validation error", message: error.message });
  } else if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: "Username must be unique", message: error.message });
  } else if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: "Database error", message: error.message });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
