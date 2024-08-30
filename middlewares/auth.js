const { SECRET_KEY } = require("../utils/config");
const errorHandler = require("../utils/Error");

const jwt = require("jsonwebtoken");

const auth = {
  isAuthenticated(req, res, next) {
    const token = req.cookies.token;

    if (!token) return next(errorHandler(401, "Unauthorized"));

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return next(errorHandler(403, "Forbidden"));
      req.user = user;
      next();
    });
  },
};

module.exports = auth;
