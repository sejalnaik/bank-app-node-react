// Import the status codes.
const { StatusCodes } = require('http-status-codes')

// Import custom error.
const CustomError = require('../../../errors')

// Import the user class from view.
const User = require('../../../view/user');

// Import the jwt class from middleware.
const JwtToken = require('../../../middleware/jwt')

// Import bcrypt.
const bcrypt = require('bcryptjs');

// Import the functions from user service.
const {
    getAllUsers: getAllUsersService,
    createUser: createUserService,
    updateUser: updateUserService,
    deleteUser: deleteUserService,
    getUserByID: getUserByIDService,
    login: loginService
} = require("../service/user");

// Create function for get all users.
const getAllUsers = async (req, resp, next) => {
    console.log("******************************************** getAllUsers ********************************************")

    try {

        // Create bucket for storing all users after getting it from service.
        let allUsers = await getAllUsersService(req.query)

        // If no users then send record not found error.
        if (!allUsers) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }

        // If found then send ok status and the bucket in json format.
        resp.status(StatusCodes.OK).json(allUsers)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for getting one user.
const getUserByID = async (req, resp, next) => {
    console.log("******************************************** getUserByID ********************************************")

    try {

        // Get the id from request body.
        let id = req.params.id

        // Create bucket for new object of user class for sending id.
        let tempUser = User.createBlankUserWithID(id)

        // Create bucket for storing all users after getting it from service.
        let user = await getUserByIDService(tempUser)

        // If no users then send record not found error.
        if (!user) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }

        // If found then send ok status and the bucket in json format.
        resp.status(StatusCodes.OK).json(user)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for add one user.
const createUser = async (req, resp, next) => {
    console.log("******************************************** createUser ********************************************")

    try {

        // Get the first name form request body.
        let firstName = req.body.firstName

        // Get the last name form request body.
        let lastName = req.body.lastName

        // Get the email from request body.
        let email = req.body.email

        // Get the totalBalance form request body.
        let totalBalance = req.body.totalBalance

        // Get the isAdmin form request body.
        let isAdmin = req.body.isAdmin

        // Get the password form request body.
        let password = req.body.password

        // Create bucket for new object of user class for adding.
        let user = new User(firstName, lastName, email, totalBalance, isAdmin, password)

        // Validate user.
        user.validateUser()

        // Get the logged in user id from token.
        loggedInUser = JwtToken.decodeToken(req.headers.authorization)

        // Give the user id as created by to user object.
        user.createdBy = loggedInUser.userID

        // Create bucket for storing the newly created user.
        let newUser = await createUserService(user)

        // If successful send status for success and the newly created user.
        resp.json(newUser)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for update one user.
const updateUser = async (req, resp, next) => {
    console.log("******************************************** updateUser ********************************************")

    try {

        // Get the id form request body.
        let id = req.body.id

        // Get the first name form request body.
        let firstName = req.body.firstName

        // Get the last name form request body.
        let lastName = req.body.lastName

        // Get the email from request body.
        let email = req.body.email

        // Get the totalBalance form request body.
        let totalBalance = req.body.totalBalance

        // Get the isAdmin form request body.
        let isAdmin = req.body.isAdmin

        // Get the isAdmin form request body.
        let password = req.body.password

        // Create bucket for new object of user class for updating.
        let user = User.createUserWithID(id, firstName, lastName, email, totalBalance, isAdmin, password)

        // Validate user.
        user.validateUser()

        // Get the logged in user id from token.
        loggedInUser = JwtToken.decodeToken(req.headers.authorization)

        // Give the user id as updated by to user object.
        user.updatedBy = loggedInUser.userID

        // Create bucket for storing the newly updated user.
        let updateUser = await updateUserService(user)

        // If successful send status for success and the newly updated user.
        resp.json(updateUser)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for delete one user.
const deleteUser = async (req, resp, next) => {
    console.log("******************************************** deleteUser ********************************************")

    try {

        // Get the id from request body.
        let id = req.params.id

        // Create bucket for new object of user class for updating.
        let user = User.createBlankUserWithID(id)

        // Get the logged in user id from token.
        loggedInUser = JwtToken.decodeToken(req.headers.authorization)

        // Give the user id as deleted by to user object.
        user.deletedBy = loggedInUser.userID

        // Create bucket for storing the newly deleted user.
        let deleteUser = await deleteUserService(user)

        // If successful send status for success and the newly deleted user.
        resp.status(StatusCodes.CREATED).json(deleteUser)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for login.
const login = async (req, res, next) => {
    console.log("******************************************** login ********************************************")

    try {

        // Store the request body in bucket.
        const credential = req.body

        // If email or password not present in body then send error.
        if (!credential.email || !credential.password) {
            throw new CustomError.BadRequestError("Email and password must be specified")
        }

        // Create bucket for new object of user class for login.
        let user = User.createUserForLogin(credential.email, credential.password)

        // Create bucket for storing the user.
        const newUser = await loginService(user)

        // If email is wrong.
        if (!newUser) {
            throw new CustomError.BadRequestError("Email does not exist")
        }

        // If password is wrong.
        result = await comparePassword(user.password, newUser.password)
        if (!result) {
            throw new CustomError.BadRequestError("Password is wrong")
        }

        // Create the jwt class instance.
        const jwt = new JwtToken(
            newUser.id,
            newUser.email,
        )

        // Create the token.
        const token = jwt.generateToken()

        // Set the token in header.
        res.header("authorization", token)

        // Set the cookie.
        // res.cookie('authorization', token, {
        //     httpOnly: false,
        //     secure: false,
        //     maxAge: 1000 * 24 * 60 * 60 * 1000,
        //     // expires: new Date()*
        // })

        // Login is successful.
        res.status(StatusCodes.OK).json(newUser)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for logout.
const logout = async (req, res, next) => {
    console.log("******************************************** logout ********************************************")

    try {

        // Clear all cookies.
        res.cookie()
        res.clearCookie("authorization")

        // Logout is successful.
        res.status(StatusCodes.OK).json({
            message: "Logged out successfully"
        })

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Compare the password from database and user.
async function comparePassword(plaintextPassword, hashPassowrd) {
    const result = await bcrypt.compare(plaintextPassword, hashPassowrd)
    return result
}

// Export all the fucntions.
module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserByID,
    login,
    logout
}

