const express = require("express");
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.post("/signup", userController.signUp);
userRouter.post("/signin", userController.signIn);
userRouter.post("/google", userController.googleSignIn);
userRouter.put("/update/:id", auth.isAuthenticated, userController.updateUser);

module.exports = userRouter;
