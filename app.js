const express = require("express");

const userRouter = require("./routes/user.route");
const error = require("./middlewares/Error");

const morgan = require("morgan");

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);

app.use(error);

module.exports = app;
