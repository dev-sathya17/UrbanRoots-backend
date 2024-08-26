const errorHandler = require("../utils/Error");
const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.status(201).send({ message: "User created successfully" });
    } catch (error) {
      // next(errorHandler(500, "duplicate username"));
      next(error);
    }
  },
};

module.exports = userController;
