// Take user class of index.js from user folder.
const User = require('../../../view/user');

// Take db of index.js from models folder.
const db = require("../../../models")

// Import custom error.
const CustomError = require('../../../errors')

// Import Op from sequilize.
const { Op } = require("sequelize");

// Import bcrypt.
const bcrypt = require('bcryptjs');

// Take account class of index.js from account folder.
const Account = require('../../../view/account');

// Take user class of index.js from account folder.
const Transaction = require('../../../view/transaction');

// Take bank class of index.js from account folder.
const Bank = require('../../../view/bank');

// Import the functions from account service.
const {
    getAllAccounts: getAllAccountsService,
    addSearchQueries: addSearchQueriesAccountService
} = require("../../account/service/account");

// Create function for get all users.
const getAllUsers = async (params) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Format the search queries.
        const searchQueries = addSearchQueries(params)

        // Create bucket for storing all users after getting it from view.
        const allUsers = await User.getAllUsers(transaction, searchQueries)

        // If no users found then send empty array.
        if (!allUsers) {
            allUsers = []
        }

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return allUsers

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for getting one user.
const getUserByID = async (userObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing all banusers after getting it from view.
        const user = await userObj.getUserByID(transaction)

        // If no user found then send error.
        if (!user) {
            throw new CustomError.BadRequestError("User not found")
        }

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return user

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for adding one user.
const createUser = async (userObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Hash the password.
        userObj.password = await hashPassword(userObj.password)

        // Check if user email exists.
        const user = await userObj.getUserByEmail(transaction)
        if (user) {
            throw new CustomError.BadRequestError("User email already exists")
        }

        // Check if created by exists in db.
        const checkUser = User.createBlankUserWithID(userObj.createdBy)
        const userForExists = await checkUser.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // Create bucket for storing new user after getting it from view.
        let newUser = await userObj.createUser(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return newUser

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for updating one user.
const updateUser = async (userObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Check if user email exists.
        const user = await userObj.getUserByEmail(transaction)
        if (user) {
            throw new CustomError.BadRequestError("User email already exists")
        }

        // Check if updated by exists in db.
        const checkUser = User.createBlankUserWithID(userObj.updatedBy)
        const userForExists = await checkUser.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // Create bucket for storing updated user after getting it from view.
        let updateUser = await userObj.updateUser(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return updateUser

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for deleting one user.
const deleteUser = async (userObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Check if deleted by exists in db.
        const checkUser = User.createBlankUserWithID(userObj.deletedBy)
        const userForExists = await checkUser.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // Get all the accounts for user.
        const searchQueries = addSearchQueriesAccountService({ userID: userObj.id })
        const allAccounts = await Account.getAllAccounts(transaction, searchQueries)

        // Collect all the account ids in an array.
        const accountIDs = []
        for (let i = 0; i < allAccounts.length; i++) {
            accountIDs.push(allAccounts[i].id)
        }

        // Iterate the accounts.
        for (let i = 0; i < allAccounts.length; i++) {

            // Get the bank for the account id.
            let bank = Bank.createBlankBankWithID(allAccounts[i].bank_id)
            let bankForExists = await bank.getBankByID(transaction)
            if (!bankForExists) {
                throw new CustomError.BadRequestError("Bank not found")
            }

            // Deduct the balance of account from the balance of bank.
            const bankForUpdate = Bank.createBankWithID(bankForExists.id, bankForExists.name, bankForExists.abbrevieation, bankForExists.balance - allAccounts[i].balance)
            bankForUpdate.updatedBy = userObj.deletedBy
            await bankForUpdate.updateBank(transaction)
        }

        // Delete the transactions.
        await Transaction.deleteTransactions(transaction, accountIDs, userObj.deletedBy)

        // Delete the accounts.
        await Account.deleteAccountsForUsers(transaction, [userObj.id], userObj.deletedBy)

        // Create bucket for storing deleted user after getting it from view.
        let deleteUser = await userObj.deleteUser(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return deleteUser

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for login.
const login = async (userObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing user after login from view.
        const user = await userObj.getUserByEmail(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return user

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Add search queries to  query.
const addSearchQueries = (params) => {

    // Create bucket for where query.
    let where = {}

    // First name.
    if (params.firstName) {
        where.firstName = {
            [Op.iLike]: "%" + params.firstName.toLowerCase() + "%"
        }
    }

    // Last name.
    if (params.lastName) {
        where.lastName = {
            [Op.iLike]: "%" + params.lastName.toLowerCase() + "%"
        }
    }

    // Email.
    if (params.email) {
        where.email = {
            [Op.iLike]: "%" + params.email.toLowerCase() + "%"
        }
    }

    // Is Admin.
    if (params.isAdmin) {
        where.isAdmin = {
            [Op.eq]: params.isAdmin
        }
    }

    return where
}

// Encrypt the password.
async function hashPassword(passowrdToBeEncrypted) {
    const hash = await bcrypt.hash(passowrdToBeEncrypted, 10)
    return hash
}

// Export all the functions.
module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserByID,
    login
}