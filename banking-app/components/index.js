// Import express.
const express = require("express")

// Create main router.
const router = express.Router()

// Take router of index.js from bank folder.
const bankRouter = require("./bank")

// Take router of index.js from user folder.
const userRouter = require("./user")

// Take router of index.js from account folder.
const accountRouter = require("./account")

// Take router of index.js from transaction folder.
const transactionRouter = require("./transaction")

// Give path for bank router to make it sub router of main router.
router.use("/bank", bankRouter)

// Give path for user router to make it sub router of main router.
router.use("/user", userRouter)

// Give path for account router to make it sub router of main router.
router.use("/account", accountRouter)

// Give path for transaction router to make it sub router of main router.
router.use("/transaction", transactionRouter)

// Export the main router.
module.exports = router