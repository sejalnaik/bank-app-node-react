// Import express.
const express = require("express")

// Import the jwt token class.
const JwtToken = require('../../middleware/jwt')

// Create the bank router.
const bankRouter = express.Router()

// Import the functions from bank controller.
const { getAllBanks,
    createBank,
    updateBank, deleteBank, getBankByID } = require('./controller/bank')

// Give path for get all banks and provide function for it.
bankRouter.get("/", JwtToken.authenticationMiddleware, getAllBanks)

// Give path for create bank and provide function for it.
bankRouter.post("/", JwtToken.authenticationMiddleware, createBank)

// Give path for update bank and provide function for it.
bankRouter.put("/", JwtToken.authenticationMiddleware, updateBank)

// Give path for delete bank and provide function for it.
bankRouter.delete("/id/:id", JwtToken.authenticationMiddleware, deleteBank)

// Give path for get bank by id and provide function for it.
bankRouter.get("/id/:id", JwtToken.authenticationMiddleware, getBankByID)

// Export the bank router.
module.exports = bankRouter