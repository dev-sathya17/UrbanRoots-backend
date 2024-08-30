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
        return next(errorHandler(404, "User not found"));
      }

      const isPasswordValid = bcryptjs.compareSync(password, user.password);
      if (!isPasswordValid) {
        return next(errorHandler(401, "Invalid credentials!"));
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
  googleSignIn: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      console.log(user);
      if (user) {
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
      } else {
        const generatedPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, SECRET_KEY);
        const { password: pass, ...data } = newUser._doc;
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
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  updateUser: async (request, response, next) => {
    try {
      if (request.user.id !== request.params.id)
        return next(errorHandler(401, "You can only update your own account"));

      if (request.body.password) {
        request.body.password = bcryptjs.hashSync(request.body.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        request.params.id,
        {
          $set: {
            username: request.body.username,
            email: request.body.email,
            avatar: request.body.avatar,
            password: request.body.password,
          },
        },
        {
          new: true,
        }
      );

      const { password, ...rest } = updatedUser._doc;
      response.json(rest);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
