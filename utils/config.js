require("dotenv").config();

// Exporting values from .env file
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

// Exporting the variables for access across the application
module.exports = { MONGODB_URI, PORT, SECRET_KEY };
