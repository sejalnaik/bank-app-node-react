// Take transaction class of index.js from transaction folder.
const Transaction = require('../../../view/transaction');

// Take bank class of index.js from transaction folder.
const Bank = require('../../../view/bank');

// Take user class of index.js from transaction folder.
const User = require('../../../view/user');

// Take exports of index.js from error folder.
const CustomError = require('../../../errors')

// Take db of index.js from models folder.
const db = require("../../../models/index");
const Account = require('../../../view/account');

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

        // Check if account exists in db.
        const account = Account.createBlankAccountWithID(transactionObj.accountID)
        const accountForExists = await account.getAccountByID(transaction)
        if (!accountForExists) {
            throw new CustomError.BadRequestError("Sender account not found")
        }

        // Check if created by exists in db.
        const loggedInUser = User.createBlankUserWithID(transactionObj.createdBy)
        const loggedInUserForExists = await loggedInUser.getUserByID(transaction)
        if (!loggedInUserForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

        // Create variable for storing amount of transaction.
        let amount = transactionObj.amount

        // If transaction type is not deposit then make it negative.
        if (transactionObj.type != "Deposit") {
            amount = transactionObj.amount * (-1)
        }

        // Add the amount of the transaction to the balance of account.
        const accountForUpdate = Account.createAccountWithID(accountForExists.id, accountForExists.accountNumber,
            +accountForExists.balance + amount, accountForExists.bank_id, accountForExists.user_id)

        // Give updated by to account.
        accountForUpdate.updatedBy = transactionObj.createdBy

        // Update the account.
        await accountForUpdate.updateAccount(transaction)

        // Get bank from db.
        const bank = Bank.createBlankBankWithID(accountForUpdate.bankID)
        const bankForExists = await bank.getBankByID(transaction)

        // Add the amount of the transaction to the balance of bank.
        const bankForUpdate = Bank.createBankWithID(bankForExists.id, bankForExists.name, bankForExists.abbrevieation,
            +bankForExists.balance + amount)

        // Give updated by to bank.
        bankForUpdate.updatedBy = transactionObj.createdBy

        // Update the bank.
        await bankForUpdate.updateBank(transaction)

        // Get user from db.
        const user = User.createBlankUserWithID(accountForUpdate.userID)
        const userForExists = await user.getUserByID(transaction)

        // Add the amount of the transaction to the balance of user.
        const userForUpdate = User.createUserWithID(userForExists.id, userForExists.firstName,
            userForExists.lastName, userForExists.email, +userForExists.totalBalance + amount,
            userForExists.isAdmin, userForExists.password)

        // Give updated by to user.
        userForUpdate.updatedBy = transactionObj.createdBy

        // Update the user.
        await userForUpdate.updateUser(transaction)

        // Give balance of account as closing balance of transaction.
        transactionObj.closingBalance = accountForUpdate.balance

        // Create bucket for storing new transaction after getting it from view.
        let newTransaction = await transactionObj.createTransaction(transaction)

        // If transaction type is transfer then make changes in the bank, account ans user associated with the to account.
        if (transactionObj.type == "Transfer") {

            // Check if to account exists in db.
            const toAccount = Account.createBlankAccountWithID(transactionObj.toAccountID)
            const toAccountForExists = await toAccount.getAccountByID(transaction)
            if (!toAccountForExists) {
                throw new CustomError.BadRequestError("Receiver account not found")
            }

            // Add the amount of the transaction to the balance of account.
            const toAccountForUpdate = Account.createAccountWithID(toAccountForExists.id, toAccountForExists.accountNumber,
                +toAccountForExists.balance + transactionObj.amount, toAccountForExists.bank_id, toAccountForExists.user_id)

            // Give updated by to account.
            toAccountForUpdate.updatedBy = transactionObj.createdBy

            // Update the account.
            await toAccountForUpdate.updateAccount(transaction)

            // Get bank from db.
            const toBank = Bank.createBlankBankWithID(toAccountForUpdate.bankID)
            const toBankForExists = await toBank.getBankByID(transaction)

            // Add the amount of the transaction to the balance of bank.
            const toBankForUpdate = Bank.createBankWithID(toBankForExists.id, toBankForExists.name, toBankForExists.abbrevieation,
                +toBankForExists.balance + transactionObj.amount)

            // Give updated by to bank.
            toBankForUpdate.updatedBy = transactionObj.createdBy

            // Update the bank.
            await toBankForUpdate.updateBank(transaction)

            // Get user from db.
            const toUser = User.createBlankUserWithID(toAccountForUpdate.userID)
            const toUserForExists = await toUser.getUserByID(transaction)

            // Add the amount of the transaction to the balance of user.
            const toUserForUpdate = User.createUserWithID(toUserForExists.id, toUserForExists.firstName,
                toUserForExists.lastName, toUserForExists.email, +toUserForExists.totalBalance + transactionObj.amount,
                toUserForExists.isAdmin, toUserForExists.password)

            // Give updated by to user.
            toUserForUpdate.updatedBy = transactionObj.createdBy

            // Update the user.
            await toUserForUpdate.updateUser(transaction)

            // Create to transaction.
            const toTransaction = new Transaction(transactionObj.type, transactionObj.toAccountID, null, transactionObj.amount)

            // Give balance of to account as closing balance of to transaction.
            toTransaction.closingBalance = toAccountForUpdate.balance

            // Give created by to to transaction.
            toTransaction.createdBy = transactionObj.createdBy

            // Add to transaction.
            let newToTransaction = await toTransaction.createTransaction(transaction)
        }

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