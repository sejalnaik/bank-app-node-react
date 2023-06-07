// Import express.
const express = require("express")

// Import the jwt token class.
const JwtToken = require('../../middleware/jwt')

// Create the transaction router.
const transactionRouter = express.Router()

// Import the functions from transaction controller.
const { getAllTransactions,
    createTransaction,
    getTransactionByID } = require('./controller/transaction')

// Give path for get all transactions and provide function for it.
transactionRouter.get("/", JwtToken.authenticationMiddleware, getAllTransactions)

// Give path for create transaction and provide function for it.
transactionRouter.post("/", JwtToken.authenticationMiddleware, createTransaction)

// Give path for get transaction by id and provide function for it.
transactionRouter.get("/id/:id", JwtToken.authenticationMiddleware, getTransactionByID)

// Export the transaction router.
module.exports = transactionRouter