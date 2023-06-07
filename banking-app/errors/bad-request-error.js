// Import the status codes.
const { StatusCodes } = require("http-status-codes")

// Import the custom error.
const CustomError = require('./custom-error');

// Create class for bad request error and set its status code.
class BadRequestError extends CustomError {
  constructor(errorMessage) {
    super(errorMessage)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

// Export the class.
module.exports = BadRequestError