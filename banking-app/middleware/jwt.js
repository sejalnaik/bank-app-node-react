
// Import jsonwebtoken.
const jwt = require("jsonwebtoken")

// Import custom error.
const CustomError = require('../errors')

// Create the jwt class.
class JwtToken {
  constructor(id, email) {
    this.userID = id
    this.email = email
  }

  // Create the payload instance.
  createPayload() {
    return {
      userID: this.userID,
      email: this.email,
    }
  }

  // Generate the token.
  generateToken() {

    // Declare the secret key.
    const SECRET_KEY = "ImmaBest"

    // Create object literal of jwt.
    const tempJWT = {
      userID: this.userID,
      email: this.email
    }

    // Create the token.
    const token = jwt.sign((tempJWT), SECRET_KEY.toString(), { expiresIn: 1000 * 24 * 60 * 60 * 1000 })

    // Return the token.
    return token
  }

  // Decode the token.
  static decodeToken(token) {

    // Declare the secret key.
    const SECRET_KEY = "ImmaBest"

    // Decipher the token. 
    const decoded = jwt.verify(token, SECRET_KEY)

    const user = {
      userID: decoded.userID,
      email: decoded.email
    }

    // Return the token.
    return user
  }

  // Authenticate the token coming from front end for login through cookie.
  static authenticateCookie(req, res, next) {

    // Get the cookie from the request.
    let tokenCookie = req.cookies["authorization"]

    // If no cookie found then it is unauthorized.
    if (!tokenCookie) {
      throw new CustomError.UnauthorizedError("Session cookie not found. Please login")
    }

    try {

      // Declare the secret key.
      const SECRET_KEY = "ImmaBest"

      // Decipher the token.
      let decode = jwt.verify(tokenCookie, SECRET_KEY)

      // Go to next middleware.
      next()

    } catch (error) {

      // If error then token is invalid.
      throw CustomError.UnauthorizedError("Session expired. Please login again")
    }
  }

  // Authenticate the token coming from front end for login.
  static authenticationMiddleware = async (req, res, next) => {
    try {

      // Get the authorization header from the request.
      const token = req.headers.authorization

      // If authorization header not present or does not contain the string Bearer then throw error. 
      if (!token) {
        throw new CustomError.UnauthorizedError("token not provided")
      }

      // Go to next middleware.
      next()

    } catch (error) {

      // Retuen error.
      next(error)
    }
  }

}

// Export the class.
module.exports = JwtToken