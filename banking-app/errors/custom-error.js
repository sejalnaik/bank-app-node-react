
// Create a custom error class which extends the Error class.
class CustomError extends Error {
  constructor (errorMessage) {
    super(errorMessage)
  }
}

// Export the class.
module.exports = CustomError
