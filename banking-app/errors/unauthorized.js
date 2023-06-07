// Import the status codes.
const { StatusCodes } = require('http-status-codes');

// Import the custom error.
const CustomError = require('./custom-error');

// Create class for unauthorized error and set its status code.
class UnauthorizedError extends CustomError {
  constructor(errorMessage) {
    super(errorMessage)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

// Export the class.
module.exports = UnauthorizedError