// Import express.
const express = require("express")

// Import the jwt token class.
const JwtToken = require('../../middleware/jwt')

// Create the account router.
const accountRouter = express.Router()

// Import the functions from account controller.
const { getAllAccounts,
    createAccount,
    updateAccount, deleteAccount, getAccountByID } = require('./controller/account')

// Give path for get all accounts and provide function for it.
accountRouter.get("/", JwtToken.authenticationMiddleware, getAllAccounts)

// Give path for create account and provide function for it.
accountRouter.post("/", JwtToken.authenticationMiddleware, createAccount)

// Give path for update account and provide function for it.
accountRouter.put("/", JwtToken.authenticationMiddleware, updateAccount)

// Give path for delete account and provide function for it.
accountRouter.delete("/id/:id", JwtToken.authenticationMiddleware, deleteAccount)

// Give path for get account by id and provide function for it.
accountRouter.get("/id/:id", JwtToken.authenticationMiddleware, getAccountByID)

// Export the account router.
module.exports = accountRouter