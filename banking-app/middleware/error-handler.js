// Import the status codes.
const { StatusCodes } = require('http-status-codes')

// Import custom error.
const CustomError = require('../errors/custom-error')

// Create middleware.
const errorHandlerMiddleware = (err, req, res, next) => {

  // If error is isnstance of custom error class then send the message and status code as mentioned.
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  // If error is not an isnstance of error class then send the message and status code as internal server error.
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

// Export the class.
module.exports = errorHandlerMiddleware
