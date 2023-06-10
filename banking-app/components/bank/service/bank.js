// Take bank class of index.js from bank folder.
const Bank = require('../../../view/bank');

// Take user class of index.js from user folder.
const User = require('../../../view/user');

// Take db of index.js from models folder.
const db = require("../../../models/index")

// Take exports of index.js from error folder.
const CustomError = require('../../../errors')

// Import Op from sequilize.
const { Op } = require("sequelize");

// Create function for get all banks.
const getAllBanks = async (params) => {

    // Start new transaction.
    const transaction = await db.sequelize.transaction()

    try {

        // Format the search queries.
        const searchQueries = addSearchQueries(params)

        // Create bucket for storing all banks after getting it from view.
        const allBanks = await Bank.getAllBanks(transaction, searchQueries)

        // If no banks found then send empty array.
        if (!allBanks) {
            allBanks = []
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

        // Check if created by exists in db.
        const checkUser = User.createBlankUserWithID(bankObj.createdBy)
        const userForExists = await checkUser.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
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

        // Check if updated by exists in db.
        const checkUser = User.createBlankUserWithID(bankObj.updatedBy)
        const userForExists = await checkUser.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
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

        // Check if deleted by exists in db.
        const checkUser = User.createBlankUserWithID(bankObj.deletedBy)
        const userForExists = await checkUser.getUserByID(transaction)
        if (!userForExists) {
            throw new CustomError.BadRequestError("User not found")
        }

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

// Add search queries to  query.
const addSearchQueries = (params) => {

    // Create bucket for where query.
    let where = {}

    // Name.
    if (params.name) {
        where.name = {
            [Op.iLike]: "%" + params.name.toLowerCase() + "%"
        }
    }

    // Abbrevieation.
    if (params.abbrevieation) {
        where.abbrevieation = {
            [Op.iLike]: "%" + params.abbrevieation + "%"
        }
    }
    return where
}

// Export all the functions.
module.exports = {
    getAllBanks,
    createBank,
    updateBank,
    deleteBank,
    getBankByID
}