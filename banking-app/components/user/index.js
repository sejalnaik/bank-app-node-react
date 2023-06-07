// Import express.
const express = require("express")

// Import the jwt token class.
const JwtToken = require('../../middleware/jwt')

// Create the user router.
const userRouter = express.Router()

// Import the functions from user controller.
const { getAllUsers,
    createUser,
    updateUser, deleteUser, getUserByID, login, logout } = require('./controller/user')

// Give path for get all users and provide function for it.
userRouter.get("/", JwtToken.authenticationMiddleware, getAllUsers)

// Give path for create user and provide function for it.
userRouter.post("/", createUser)

// Give path for update user and provide function for it.
userRouter.put("/", JwtToken.authenticationMiddleware, updateUser)

// Give path for delete user and provide function for it.
userRouter.delete("/id/:id", JwtToken.authenticationMiddleware, deleteUser)

// Give path for get user by id and provide function for it.
userRouter.get("/id/:id", JwtToken.authenticationMiddleware, getUserByID)

// Give path for login user and provide function for it.
userRouter.post("/login", login)

// Give path for logout user and provide function for it.
userRouter.get("/logout", logout)

// Export the user router.
module.exports = userRouter