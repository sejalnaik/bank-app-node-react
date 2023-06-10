// Take user class of index.js from user folder.
const User = require('../../../view/user');

// Take db of index.js from models folder.
const db = require("../../../models")

// Import custom error.
const CustomError = require('../../../errors')

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

// Export all the functions.
module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserByID,
    login
}