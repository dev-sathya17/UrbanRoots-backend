const express = require("express");

const userRouter = require("./routes/user.route");
const error = require("./middlewares/Error");

const morgan = require("morgan");

const cors = require("cors");

// Importing the cookie parser library
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(express.json());

// Adding the cors middleware to allow cross-origin requests
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);

app.use(error);

module.exports = app;
