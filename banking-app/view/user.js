// Take db of index.js from models folder.
const db = require("../models/index")

// Import uuid.
const uuid = require("uuid")

// Import custom error.
const CustomError = require('../errors')

// Import Op from sequilize.
const { Op } = require("sequelize")

// Create user class with attributes and functions.
class User {
    constructor(firstName, lastName, email, totalBalance, isAdmin, password) {
        this.id = uuid.v4()
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.totalBalance = totalBalance
        this.isAdmin = isAdmin
        this.password = password
    }

    // This function is for when id is there and needs to create a blank user.
    static createBlankUserWithID(id) {
        const user = new User()
        user.id = id
        return user
    }

    // This function is for when id and other fields are there.
    static createUserWithID(id, firstName, lastName, email, totalBalance, isAdmin, password) {
        const user = new User(firstName, lastName, email, totalBalance, isAdmin, password)
        user.id = id
        return user
    }

    // This function is for when creating user for login.
    static createUserForLogin(email, password) {
        const user = new User()
        user.email = email
        user.password = password
        return user
    }

    // Validation for user.
    validateUser() {

        // First name.
        if (!this.firstName) {
            throw new CustomError.BadRequestError("First name must be specified")
        }
        if (this.firstName.length > 100) {
            throw new CustomError.BadRequestError("First name can contain upto 100 characters")
        }

        // Last name.
        if (!this.lastName) {
            throw new CustomError.BadRequestError("Last name must be specified")
        }
        if (this.lastName.length > 100) {
            throw new CustomError.BadRequestError("Last name can contain upto 100 characters")
        }

        // Email.
        if (!this.email) {
            throw new CustomError.BadRequestError("Email must be specified")
        }
        if (this.email.length > 100) {
            throw new CustomError.BadRequestError("Email can contain upto 100 characters")
        }

        // Password.
        if (!this.password) {
            throw new CustomError.BadRequestError("Password must be specified")
        }
        if (this.password.length > 100) {
            throw new CustomError.BadRequestError("Password can contain upto 100 characters")
        }

        // Total balance.
        if (this.totalBalance == null) {
            throw new CustomError.BadRequestError("Total balance must be specified")
        }
        if (this.totalBalance < 0) {
            throw new CustomError.BadRequestError("Total balance cannot be less than 0")
        }
        if (this.totalBalance > 100000000000) {
            throw new CustomError.BadRequestError("Total balance cannot be more than 100000000000")
        }
    }

    // Create function for getting all users. 
    static async getAllUsers(transaction, searchQueries) {
        try {

            // Create bucket for all users and fetch it form db.
            let allUsers = await db.user.findAll({
                where: searchQueries,
                include: [
                    {
                        model: db.account,
                    }
                ],
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return allUsers

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for getting one user by id. 
    async getUserByID(transaction) {
        try {

            // Create bucket for all users and fetch it form db.
            let user = await db.user.findOne({
                where: { id: this.id },
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return user

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for getting one user by email. 
    async getUserByEmail(transaction) {
        try {

            // Create bucket for all users and fetch it form db.
            let user = await db.user.findOne({
                where: {
                    email: this.email,
                    id: {
                        [Op.ne]: this.id
                    }
                }
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return user

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for adding one user. 
    async createUser(transaction) {
        try {

            // Create bucket for one user and add it to db.
            let newUser = await db.user.create({
                id: this.id,
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                totalBalance: this.totalBalance,
                password: this.password,
                isAdmin: this.isAdmin,
                createdBy: this.createdBy,
                updatedBy: uuid.NIL
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return newUser

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for updating one user. 
    async updateUser(transaction) {
        try {

            // Create bucket for one user and update it in db.
            let updateUser = await db.user.update({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                totalBalance: this.totalBalance,
                isAdmin: this.isAdmin,
                updatedBy: this.updatedBy
            },
                {
                    where: {
                        id: this.id
                    }
                }, {
                transaction: transaction
            })

            // Return the bucket.
            return updateUser

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for deleting one user. 
    async deleteUser(transaction) {
        try {

            // Create bucket for one user and delete it from db.
            let deleteUser = await db.user.update({
                deletedAt: new Date(),
                deletedBy: this.deletedBy
            },
                {
                    where: {
                        id: this.id
                    }
                }, {
                transaction: transaction
            })

            // Return the bucket.
            return deleteUser

        } catch (error) {

            // Return the error.
            throw error
        }
    }
}

// Export the user class.
module.exports = User