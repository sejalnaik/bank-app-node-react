// Take account class of index.js from account folder.
const Account = require('../../../view/account');

// Take bank class of index.js from account folder.
const Bank = require('../../../view/bank');

// Take user class of index.js from account folder.
const User = require('../../../view/user');

// Take user class of index.js from account folder.
const Transaction = require('../../../view/transaction');

// Take exports of index.js from error folder.
const CustomError = require('../../../errors')

// Take db of index.js from models folder.
const db = require("../../../models/index");

// Import Op from sequilize.
const { Op } = require("sequelize");

// Create function for get all accounts.
const getAllAccounts = async (params) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Format the search queries.
        const searchQueries = addSearchQueries(params)

        // Create bucket for storing all accounts after getting it from view.
        const allAccounts = await Account.getAllAccounts(transaction, searchQueries)

        // If no accounts found then send empty array.
        if (!allAccounts) {
            allAccounts = []
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

        // Check if created by exists in db.
        const loggedInUser = User.createBlankUserWithID(accountObj.createdBy)
        const loggedInUserForExists = await loggedInUser.getUserByID(transaction)
        if (!loggedInUserForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // For loop till account number is unique.
        createAccountNumberLabel: {

            // Create a random number for account number.
            let accountNumber = Math.floor((Math.random() * 10000) + 1)

            // Give the account number to the account object.
            accountObj.accountNumber = accountNumber

            // Check if the account number already exists.
            const account = await accountObj.getAccountByAccountNumber(transaction)
            if (account) {
                break createAccountNumberLabel
            }
        }

        // Add the balance of the account to the total balance of user.
        const userForUpdate = User.createUserWithID(userForExists.id, userForExists.firstName,
            userForExists.lastName, userForExists.email, +userForExists.totalBalance + accountObj.balance,
            userForExists.isAdmin, userForExists.password)

        // Give updated by to user.
        userForUpdate.updatedBy = accountObj.createdBy

        // Update the user.
        await userForUpdate.updateUser(transaction)

        // Create bucket for storing new account after getting it from view.
        let newAccount = await accountObj.createAccount(transaction)

        // Create transaction bucket.
        let transactionBucket = new Transaction("Deposit", accountObj.id, null, accountObj.balance)

        // Give closing balance to transaction.
        transactionBucket.closingBalance = accountObj.balance

        // Give created by to transaction.
        transactionBucket.createdBy = accountObj.createdBy

        // Create the transaction.
        await transactionBucket.createTransaction(transaction)

        // Add the balance of the account to the total balance of bank.
        const bankForUpdate = Bank.createBankWithID(bankForExists.id, bankForExists.name,
            bankForExists.abbrevieation, +bankForExists.balance + accountObj.balance)

        // Give updated by to bank.
        bankForUpdate.updatedBy = accountObj.createdBy

        // Update the user.
        await bankForUpdate.updateBank(transaction)

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

        // Check if updated by exists in db.
        const checkUser = User.createBlankUserWithID(bankObj.updatedBy)
        const loggedInuUserForExists = await checkUser.getUserByID(transaction)
        if (!loggedInuUserForExists) {
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

        // Check if deleted by exists in db.
        const checkUser = User.createBlankUserWithID(accountObj.deletedBy)
        const loggedInuUserForExists = await checkUser.getUserByID(transaction)
        if (!loggedInuUserForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // Get the account from db.
        const account = Account.createBlankAccountWithID(accountObj.id)
        const accountForExists = await account.getAccountByID(transaction)
        if (!accountForExists) {
            throw new CustomError.BadRequestError("Account not found")
        }

        // Delete the transactions.
        let accountIDs = [accountObj.id]
        await Transaction.deleteTransactions(transaction, accountIDs, accountObj.deletedBy)

        // Get the bank.
        const bank = Bank.createBlankBankWithID(accountForExists.bank_id)
        const bankForExists = await bank.getBankByID(transaction)
        if (!bankForExists) {
            throw new CustomError.BadRequestError("Bank not found")
        }

        // Update the bank by deducting the balance of the account.
        const bankForUpdate = Bank.createBankWithID(bankForExists.id, bankForExists.name, bankForExists.abbrevieation, bankForExists.balance - accountForExists.balance)
        bankForUpdate.updatedBy = accountObj.deletedBy
        await bankForUpdate.updateBank(transaction)

        // Get the user.
        const user = User.createBlankUserWithID(accountForExists.user_id)
        const userForExists = await user.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // Update the user by deducting the balance of the account.
        const userForUpdate = User.createUserWithID(userForExists.id, userForExists.firstName, userForExists.lastName,
            userForExists.email, userForExists.totalBalance - accountForExists.balance, userForExists.isAdmin, userForExists.password)
        userForUpdate.updatedBy = accountObj.deletedBy
        await userForUpdate.updateUser(transaction)

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

// Add search queries to query.
const addSearchQueries = (params) => {

    // Create bucket for where query.
    let where = {}

    // Bank id.
    if (params.bankID) {
        where.bank_id = {
            [Op.eq]: params.bankID
        }
    }

    // User id.
    if (params.userID) {
        where.user_id = {
            [Op.eq]: params.userID
        }
    }

    return where
}

// Export all the functions.
module.exports = {
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountByID,
    addSearchQueries
}