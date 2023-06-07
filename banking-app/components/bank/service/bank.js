// Take bank class of index.js from bank folder.
const Bank = require('../../../view/bank');

// Take db of index.js from models folder.
const db = require("../../../models/transaction")

// Take exports of index.js from error folder.
const CustomError = require('../../../errors')

// Create function for get all banks.
const getAllBanks = async () => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing all banks after getting it from view.
        const allBanks = await Bank.getAllBanks(transaction)

        // If no banks found then send error.
        if (!allBanks || (allBanks && allBanks.length == 0)) {
            throw new CustomError.BadRequestError("Banks not found")
        }

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return allBanks

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for getting one bank.
const getBankByID = async (bankObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing all banks after getting it from view.
        const bank = await bankObj.getBankByID(transaction)

        // If no bank found then send error.
        if (!bank) {
            throw new CustomError.BadRequestError("Bank not found")
        }

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return bank

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for adding one bank.
const createBank = async (bankObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Check if bank name exists.
        const bankForName = await bankObj.getBankByName(transaction)
        if (bankForName) {
            throw new CustomError.BadRequestError("Bank name already exists")
        }

        // Check if bank abbrevieation exists.
        const bankForAbbrevieation = await bankObj.getBankByAbbrevieation(transaction)
        if (bankForAbbrevieation) {
            throw new CustomError.BadRequestError("Bank abbrevieation already exists")
        }

        // Create bucket for storing new bank after getting it from view.
        let newBank = await bankObj.createBank(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return newBank

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for updating one bank.
const updateBank = async (bankObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Check if bank name exists.
        const bankForName = await bankObj.getBankByName(transaction)
        if (bankForName) {
            throw new CustomError.BadRequestError("Bank name already exists")
        }

        // Check if bank abbrevieation exists.
        const bankForAbbrevieation = await bankObj.getBankByAbbrevieation(transaction)
        if (bankForAbbrevieation) {
            throw new CustomError.BadRequestError("Bank abbrevieation already exists")
        }

        // Create bucket for storing updated bank after getting it from view.
        let updateBank = await bankObj.updateBank(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return updateBank

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Create function for deleting one bank.
const deleteBank = async (bankObj) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Create bucket for storing deleted bank after getting it from view.
        let deleteBank = await bankObj.deleteBank(transaction)

        // Commit the transaction.
        await transaction.commit()

        // Return bucket.
        return deleteBank

    } catch (error) {

        // Rollback the transaction.
        await transaction.rollback()

        // Return error.
        throw error
    }
}

// Export all the functions.
module.exports = {
    getAllBanks,
    createBank,
    updateBank,
    deleteBank,
    getBankByID
}