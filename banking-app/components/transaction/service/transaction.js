// Take transaction class of index.js from transaction folder.
const Transaction = require('../../../view/transaction');

// Take bank class of index.js from transaction folder.
const Bank = require('../../../view/bank');

// Take user class of index.js from transaction folder.
const User = require('../../../view/user');

// Take exports of index.js from error folder.
const CustomError = require('../../../errors')

// Take db of index.js from models folder.
const db = require("../../../models/transaction");

// Create function for get all transactions.
const getAllTransactions = async () => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing all transactions after getting it from view.
        const allTransactions = await Transaction.getAllTransactions(transaction)

        // If no transactions found then send error.
        if (!allTransactionss || (allTransactionss && allTransactionss.length == 0)) {
            throw new CustomError.BadRequestError("Transactions not found")
        }

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return allTransactions

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for getting one transaction.
const getTransactionByID = async (transactionObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing all transactions after getting it from view.
        const oneTransaction = await transactionObj.getTransactionByID(transaction)

        // If no transaction found then send error.
        if (!oneTransaction) {
            throw new CustomError.BadRequestError("Transaction not found")
        }

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return oneTransaction

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for adding one transaction.
const createTransaction = async (transactionObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Check if bank exists in db.
        const bank = Bank.createBlankBankWithID(transactionObj.bankID)
        const bankForExists = await bank.getBankByID(transaction)
        if (!bankForExists) {
            throw new CustomError.BadRequestError("Bank not found")
        }

        // Check if user exists in db.
        const user = User.createBlankUserWithID(transactionObj.userID)
        const userForExists = await user.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // Create bucket for storing new transaction after getting it from view.
        let newTransaction = await transactionObj.createTransaction(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return newTransaction

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Export all the functions.
module.exports = {
    getAllTransactions,
    createTransaction,
    getTransactionByID
}