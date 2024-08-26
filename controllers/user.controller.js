const errorHandler = require("../utils/Error");
const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/config");

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

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(new errorHandler(404, "User not found"));
      }

      const isPasswordValid = bcryptjs.compareSync(password, user.password);
      if (!isPasswordValid) {
        return next(new errorHandler(401, "Invalid credentials!"));
      }

      const token = jwt.sign({ id: user._id }, SECRET_KEY);

      const { password: pass, ...data } = user._doc;
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
          path: "/",
        })
        .status(200)
        .json(data);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
