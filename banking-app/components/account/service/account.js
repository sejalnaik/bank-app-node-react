// Take account class of index.js from account folder.
const Account = require('../../../view/account');

// Take bank class of index.js from account folder.
const Bank = require('../../../view/bank');

// Take user class of index.js from account folder.
const User = require('../../../view/user');

// Take exports of index.js from error folder.
const CustomError = require('../../../errors')

// Take db of index.js from models folder.
const db = require("../../../models/transaction");

// Create function for get all accounts.
const getAllAccounts = async () => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing all accounts after getting it from view.
        const allAccounts = await Account.getAllAccounts(transaction)

        // If no accounts found then send error.
        if (!allAccounts || (allAccounts && allAccounts.length == 0)) {
            throw new CustomError.BadRequestError("Accounts not found")
        }

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return allAccounts

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for getting one account.
const getAccountByID = async (accountObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing all accounts after getting it from view.
        const account = await accountObj.getAccountByID(transaction)

        // If no account found then send error.
        if (!account) {
            throw new CustomError.BadRequestError("Account not found")
        }

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return account

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for adding one account.
const createAccount = async (accountObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Check if bank exists in db.
        const bank = Bank.createBlankBankWithID(accountObj.bankID)
        const bankForExists = await bank.getBankByID(transaction)
        if (!bankForExists) {
            throw new CustomError.BadRequestError("Bank not found")
        }

        // Check if user exists in db.
        const user = User.createBlankUserWithID(accountObj.userID)
        const userForExists = await user.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // For loop till account number is unique.
        createAccountNumberLabel: {
            // for (let i = 0; ; i++) {

            // Create a random number for account number.
            let accountNumber = Math.floor((Math.random() * 10000) + 1)

            // Give the account number to the account object.
            accountObj.accountNumber = accountNumber

            // Check if the account number already exists.
            const account = await accountObj.getAccountByAccountNumber(transaction)
            if (account) {
                break createAccountNumberLabel
            }
            // if (!account) {
            //     break
            // }
            // }
        }

        // Create bucket for storing new account after getting it from view.
        let newAccount = await accountObj.createAccount(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return newAccount

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for updating one account.
const updateAccount = async (accountObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Check if bank exists in db.
        const bank = Bank.createBlankBankWithID(accountObj.bankID)
        const bankForExists = await bank.getBankByID(transaction)
        if (!bankForExists) {
            throw new CustomError.BadRequestError("Bank not found")
        }

        // Check if user exists in db.
        const user = User.createBlankUserWithID(accountObj.userID)
        const userForExists = await user.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // Create bucket for storing updated account after getting it from view.
        let updateAccount = await accountObj.updateAccount(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return updateAccount

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for deleting one account.
const deleteAccount = async (accountObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing deleted account after getting it from view.
        let deleteAccount = await accountObj.deleteAccount(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return deleteAccount

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Export all the functions.
module.exports = {
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountByID
}