// Import the status codes.
const { StatusCodes } = require('http-status-codes')

// Import the transaction class from view.
const Transaction = require('../../../view/transaction');

// Import the functions from transaction service.
const {
    getAllTransactions: getAllTransactionsService,
    createTransaction: createTransactionService,
    getTransactionByID: getTransactionByIDService
} = require("../service/transaction");

// Create function for get all transactions.
const getAllTransactions = async (req, resp, next) => {
    console.log("******************************************** getAllTransactions ********************************************")

    try {

        // Create bucket for storing all transactions after getting it from service.
        let allTransactions = await getAllTransactionsService()

        // If no transactions then send record not found error.
        if (!allTransactions) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }

        // If found then send ok status and the bucket in json format.
        resp.status(StatusCodes.OK).json(allTransactions)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for getting one transaction.
const getTransactionByID = async (req, resp, next) => {
    console.log("******************************************** getTransactionByID ********************************************")

    try {

        // Get the id from request body.
        let id = req.params.id

        // Create bucket for new object of transaction class for sending id.
        let tempTransaction = Transaction.createBlankTransactionWithID(id)

        // Create bucket for storing all transactions after getting it from service.
        let transaction = await getTransactionByIDService(tempTransaction)

        // If no transactions then send record not found error.
        if (!transaction) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }

        // If found then send ok status and the bucket in json format.
        resp.status(StatusCodes.OK).json(transaction)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for add one transaction.
const createTransaction = async (req, resp, next) => {
    console.log("******************************************** createTransaction ********************************************")

    try {

        // Get the type from request body.
        let type = req.body.type

        // Get the accountID from request body.
        let accountID = req.body.accountID

        // Get the toAccountID from request body.
        let toAccountID = req.body.toAccountID

        // Get the amount from request body.
        let amount = req.body.amount

        // Create bucket for new object of transaction class for adding.
        let transaction = new Transaction(type, accountID, toAccountID, amount)

        // Validate transaction.
        transaction.validateTransaction()

        // Create bucket for storing the newly created transaction.
        let newTransaction = await createTransactionService(transaction)

        // If successful send status for success and the newly created transaction.
        resp.json(newTransaction)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Export all the fucntions.
module.exports = {
    getAllTransactions,
    createTransaction,
    getTransactionByID
}

