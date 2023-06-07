// Take db of index.js from models folder.
const db = require("../models/transaction")

// Import uuid.
const uuid = require("uuid")

// Import custom error.
const CustomError = require('../errors')

// Create account class with attributes and functions.
class Account {
    constructor(accountNumber, balance, bankID, userID) {
        this.id = uuid.v4()
        this.accountNumber = accountNumber
        this.balance = balance
        this.bankID = bankID
        this.userID = userID
    }

    // This function is for when id is there and needs to create a blank account.
    static createBlankAccountWithID(id) {
        const account = new Account()
        account.id = id
        return account
    }

    // This function is for when id and other fields are there.
    static createAccountWithID(id, accountNumber, balance, bankID, userID) {
        const account = new Account(accountNumber, balance, bankID, userID)
        account.id = id
        return account
    }

    // Validation for account.
    validateAccount() {

        // Bank id.
        if (!this.bankID) {
            throw new CustomError.BadRequestError("Bank id must be specified")
        }
        if (this.bankID == uuid.NIL) {
            throw new CustomError.BadRequestError("Bank id cannot be nil")
        }

        // User id.
        if (!this.userID) {
            throw new CustomError.BadRequestError("User id must be specified")
        }
        if (this.userID == uuid.NIL) {
            throw new CustomError.BadRequestError("User id cannot be nil")
        }

        // Balance.
        if (!this.balance) {
            throw new CustomError.BadRequestError("Balance must be specified")
        }
        if (this.balance < 500) {
            throw new CustomError.BadRequestError("Balance cannot be less than 500")
        }
        if (this.balance > 100000000000) {
            throw new CustomError.BadRequestError("Balance cannot be more than 100000000000")
        }
    }

    // Create function for getting all accounts. 
    static async getAllAccounts(transaction) {
        try {

            // Create bucket for all accounts and fetch it form db.
            let allAccounts = await db.account.findAll({
                include: [
                    {
                        model: db.bank,
                    },
                    {
                        model: db.user,
                    },
                ],
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return allAccounts

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for getting one account by id. 
    async getAccountByID(transaction) {
        try {

            // Create bucket for all accounts and fetch it form db.
            let account = await db.account.findOne({
                where: { id: this.id },
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return account

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for getting one account by account number. 
    async getAccountByAccountNumber(transaction) {
        try {

            // Create bucket for all accounts and fetch it form db.
            let account = await db.account.findOne({
                where: { accountNumber: this.accountNumber },
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return account

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for adding one account. 
    async createAccount(transaction) {
        try {

            // Create bucket for one account and add it to db.
            let newAccount = await db.account.create({
                id: this.id,
                accountNumber: this.accountNumber,
                balance: this.balance,
                bank_id: this.bankID,
                user_id: this.userID,
                createdBy: uuid.NIL,
                updatedBy: uuid.NIL
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return newAccount

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for updating one account. 
    async updateAccount(transaction) {
        try {

            // Create bucket for one account and update it in db.
            let updateAccount = await db.account.update({
                accountNumber: this.accountNumber,
                balance: this.balance,
                bank_id: this.bankID,
                user_id: this.userID,
            },
                {
                    where: {
                        id: this.id
                    }
                }, {
                transaction: transaction
            })

            // Return the bucket.
            return updateAccount

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for deleting one account. 
    async deleteAccount(transaction) {
        try {

            // Create bucket for one account and delete it from db.
            let deleteAccount = await db.account.destroy(
                {
                    where: {
                        id: this.id
                    }
                }
            )

            // Return the bucket.
            return deleteAccount

        } catch (error) {

            // Return the error.
            throw error
        }
    }
}

// Export the account class.
module.exports = Account