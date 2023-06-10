// Take db of index.js from models folder.
const db = require("../models/index")

// Import uuid.
const uuid = require("uuid")

// Import custom error.
const CustomError = require('../errors')

// Create transaction class with attributes and functions.
class Transaction {
    constructor(type, accountID, toAccountID, amount) {
        this.id = uuid.v4()
        this.type = type
        this.accountID = accountID
        this.toAccountID = toAccountID
        this.amount = amount
    }

    // This function is for when id is there and needs to create a blank transaction.
    static createBlankTransactionWithID(id) {
        const transaction = new Transaction()
        transaction.id = id
        return transaction
    }

    // This function is for when id and other fields are there.
    static createTransactionWithID(id, type, accountID, toAccountID, amount) {
        const transaction = new Transaction(type, accountID, toAccountID, amount)
        transaction.id = id
        return transaction
    }

    // Validation for transaction.
    validateTransaction() {

        // Type.
        if (!this.type) {
            throw new CustomError.BadRequestError("Type must be specified")
        }
        if (this.type != "Deposit" && this.type != "Withdraw" && this.type != "Transfer") {
            throw new CustomError.BadRequestError("Type is not appropriate")
        }

        // Account id.
        if (!this.accountID) {
            throw new CustomError.BadRequestError("Account id must be specified")
        }
        if (this.accountID == uuid.NIL) {
            throw new CustomError.BadRequestError("Account id cannot be nil")
        }

        // To account id.
        if (this.type == "Transfer" && !this.toAccountID) {
            throw new CustomError.BadRequestError("To account id cannot be nil if transaction type is transfer")
        }
        if (this.toAccountID == uuid.NIL) {
            throw new CustomError.BadRequestError("To account id cannot be nil")
        }

        // Amount.
        if (!this.amount) {
            throw new CustomError.BadRequestError("Amount must be specified")
        }
        if (this.amount < 1) {
            throw new CustomError.BadRequestError("Amount cannot be less than 1")
        }
        if (this.amount > 100000000000) {
            throw new CustomError.BadRequestError("Amount cannot be more than 100000000000")
        }

        // Account id and to account id cannot be same.
        if (this.accountID == this.toAccountID) {
            throw new CustomError.BadRequestError("Send and receiver account cannot be same")
        }
    }

    // Create function for getting all transactions. 
    static async getAllTransactions(transaction) {
        try {

            // Create bucket for all transactions and fetch it form db.
            let allTransactions = await db.transaction.findAll({
                // include: [
                //     {
                //         model: db.account,
                //     },
                // ],
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return allTransactions

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for getting one transaction by id. 
    async getTransactionByID(transaction) {
        try {

            // Create bucket for transaction and fetch it form db.
            let oneTransaction = await db.transaction.findOne({
                where: { id: this.id },
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return oneTransaction

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for adding one transaction. 
    async createTransaction(transaction) {
        try {

            // Create bucket for one transaction and add it to db.
            let newTransaction = await db.transaction.create({
                id: this.id,
                type: this.type,
                account_id: this.accountID,
                to_account_id: this.toAccountID,
                amount: this.amount,
                closingBalance: this.closingBalance,
                createdBy: this.createdBy,
                updatedBy: uuid.NIL
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return newTransaction

        } catch (error) {

            // Return the error.
            throw error
        }
    }
}

// Export the transaction class.
module.exports = Transaction