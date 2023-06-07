// Import the status codes.
const { StatusCodes } = require('http-status-codes')

// Import the bank class from view.
const Bank = require('../../../view/bank');

// Import the functions from bank service.
const {
    getAllBanks: getAllBanksService,
    createBank: createBankService,
    updateBank: updateBankService,
    deleteBank: deleteBankService,
    getBankByID: getBankByIDService
} = require("../service/bank");

// Create function for get all banks.
const getAllBanks = async (req, resp, next) => {
    console.log("******************************************** getAllBanks ********************************************")

    try {

        // Create bucket for storing all banks after getting it from service.
        let allBanks = await getAllBanksService()

        // If no banks then send record not found error.
        if (!allBanks) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }

        // If found then send ok status and the bucket in json format.
        resp.status(StatusCodes.OK).json(allBanks)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for getting one bank.
const getBankByID = async (req, resp, next) => {
    console.log("******************************************** getBankByID ********************************************")

    try {

        // Get the id from request body.
        let id = req.params.id

        // Create bucket for new object of bank class for sending id.
        let tempBank = Bank.createBlankBankWithID(id)

        // Create bucket for storing all banks after getting it from service.
        let bank = await getBankByIDService(tempBank)

        // If no banks then send record not found error.
        if (!bank) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }

        // If found then send ok status and the bucket in json format.
        resp.status(StatusCodes.OK).json(bank)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for add one bank.
const createBank = async (req, resp, next) => {
    console.log("******************************************** createBank ********************************************")

    try {

        // Get the name form request body.
        let name = req.body.name

        // Get the abbrevieation from request body.
        let abbrevieation = req.body.abbrevieation

        // Create bucket for new object of bank class for adding.
        let bank = new Bank(name, abbrevieation)

        // Validate bank.
        bank.validateBank()

        // Create bucket for storing the newly created bank.
        let newBank = await createBankService(bank)

        // If successful send status for success and the newly created bank.
        resp.json(newBank)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for update one bank.
const updateBank = async (req, resp, next) => {
    console.log("******************************************** updateBank ********************************************")

    try {

        // Get the id from request body.
        let id = req.body.id

        // Get the name from request body.
        let name = req.body.name

        // Get the abbrevieation from request body.
        let abbrevieation = req.body.abbrevieation

        // Create bucket for new object of bank class for updating.
        let bank = Bank.createBankWithID(id, name, abbrevieation)

        // Validate bank.
        bank.validateBank()

        // Create bucket for storing the newly updated bank.
        let updateBank = await updateBankService(bank)

        // If successful send status for success and the newly updated bank.
        resp.json(updateBank)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for delete one bank.
const deleteBank = async (req, resp, next) => {
    console.log("******************************************** deleteBank ********************************************")

    try {

        // Get the id from request body.
        let id = req.params.id

        // Create bucket for new object of bank class for updating.
        let bank = Bank.createBlankBankWithID(id)

        // Create bucket for storing the newly deleted bank.
        let deleteBank = await deleteBankService(bank)

        // If successful send status for success and the newly deleted bank.
        resp.status(StatusCodes.CREATED).json(deleteBank)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Export all the fucntions.
module.exports = {
    getAllBanks,
    createBank,
    updateBank,
    deleteBank,
    getBankByID
}

