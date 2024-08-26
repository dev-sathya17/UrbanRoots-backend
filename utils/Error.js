// Creating a function to handle unknown endpoints
const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

// Exporting the function
module.exports = errorHandler;
