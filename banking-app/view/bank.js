// Take db of index.js from models folder.
const db = require("../models/transaction")

// Import uuid.
const uuid = require("uuid")

// Import custom error.
const CustomError = require('../errors')

// Import Op from sequilize.
const { Op } = require("sequelize");

// Create bank class with attributes and functions.
class Bank {
    constructor(name, abbrevieation) {
        this.id = uuid.v4()
        this.name = name
        this.abbrevieation = abbrevieation
    }

    // This function is for when id is there and needs to create a blank bank.
    static createBlankBankWithID(id) {
        const bank = new Bank()
        bank.id = id
        return bank
    }

    // This function is for when id and other fields are there.
    static createBankWithID(id, name, abbrevieation) {
        const bank = new Bank(name, abbrevieation)
        bank.id = id
        return bank
    }

    // Validation for bank.
    validateBank() {

        // Name.
        if (!this.name) {
            throw new CustomError.BadRequestError("Name must be specified")
        }
        if (this.name.length > 100) {
            throw new CustomError.BadRequestError("Name can contain upto 100 characters")
        }

        // Abbrevieation.
        if (!this.abbrevieation) {
            throw new CustomError.BadRequestError("Abbrevieation must be specified")
        }
        if (this.abbrevieation.length > 100) {
            throw new CustomError.BadRequestError("Abbrevieation can contain upto 100 characters")
        }
    }

    // Create function for getting all banks. 
    static async getAllBanks(transaction) {
        try {

            // Create bucket for all banks and fetch it form db.
            let allBanks = await db.bank.findAll({
                include: [
                    {
                        model: db.account,
                    },
                ],
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return allBanks

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for getting one bank by id. 
    async getBankByID(transaction) {
        try {

            // Create bucket for all banks and fetch it form db.
            let bank = await db.bank.findOne({
                where: { id: this.id },
                include: [
                    {
                        model: db.account,
                    },
                ],
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return bank

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for getting one bank by name. 
    async getBankByName(transaction) {
        try {

            // Create bucket for all banks and fetch it form db.
            let bank = await db.bank.findOne({
                where: {
                    name: this.name,
                    id: {
                        [Op.ne]: this.id
                    }
                }
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return bank

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for getting one bank by abbrevieation. 
    async getBankByAbbrevieation(transaction) {
        try {

            // Create bucket for all banks and fetch it form db.
            let bank = await db.bank.findOne({
                where: {
                    abbrevieation: this.abbrevieation,
                    id: {
                        [Op.ne]: this.id
                    }
                }
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return bank

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for adding one bank. 
    async createBank(transaction) {
        try {

            // Create bucket for one bank and add it to db.
            let newBank = await db.bank.create({
                id: this.id,
                name: this.name,
                abbrevieation: this.abbrevieation,
                createdBy: uuid.NIL,
                updatedBy: uuid.NIL
            }, {
                transaction: transaction
            })

            // Return the bucket.
            return newBank

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for updating one bank. 
    async updateBank(transaction) {
        try {

            // Create bucket for one bank and update it in db.
            let updateBank = await db.bank.update({
                name: this.name,
                abbrevieation: this.abbrevieation
            },
                {
                    where: {
                        id: this.id
                    }
                }, {
                transaction: transaction
            })

            // Return the bucket.
            return updateBank

        } catch (error) {

            // Return the error.
            throw error
        }
    }

    // Create function for deleting one bank. 
    async deleteBank(transaction) {
        try {

            // Create bucket for one bank and delete it from db.
            let deleteBank = await db.bank.destroy(
                {
                    where: {
                        id: this.id
                    }
                }
            )

            // Return the bucket.
            return deleteBank

        } catch (error) {

            // Return the error.
            throw error
        }
    }
}

// Export the bank class.
module.exports = Bank