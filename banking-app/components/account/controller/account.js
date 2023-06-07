// Import the status codes.
const { StatusCodes } = require('http-status-codes')

// Import the account class from view.
const Account = require('../../../view/account');

// Import the functions from account service.
const {
    getAllAccounts: getAllAccountsService,
    createAccount: createAccountService,
    updateAccount: updateAccountService,
    deleteAccount: deleteAccountService,
    getAccountByID: getAccountByIDService
} = require("../service/account");

// Create function for get all accounts.
const getAllAccounts = async (req, resp, next) => {
    console.log("******************************************** getAllAccounts ********************************************")

    try {

        // Create bucket for storing all accounts after getting it from service.
        let allAccounts = await getAllAccountsService()

        // If no accounts then send record not found error.
        if (!allAccounts) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }

        // If found then send ok status and the bucket in json format.
        resp.status(StatusCodes.OK).json(allAccounts)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for getting one account.
const getAccountByID = async (req, resp, next) => {
    console.log("******************************************** getAccountByID ********************************************")

    try {

        // Get the id from request body.
        let id = req.params.id

        // Create bucket for new object of account class for sending id.
        let tempAccount = Account.createBlankAccountWithID(id)

        // Create bucket for storing all accounts after getting it from service.
        let account = await getAccountByIDService(tempAccount)

        // If no accounts then send record not found error.
        if (!account) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }

        // If found then send ok status and the bucket in json format.
        resp.status(StatusCodes.OK).json(account)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for add one account.
const createAccount = async (req, resp, next) => {
    console.log("******************************************** createAccount ********************************************")

    try {

        // Get the balance from request body.
        let balance = req.body.balance

        // Get the bankID from request body.
        let bankID = req.body.bankID

        // Get the userID from request body.
        let userID = req.body.userID

        // Create bucket for new object of account class for adding.
        let account = new Account(null, balance, bankID, userID)

        // Validate account.
        account.validateAccount()

        // Create bucket for storing the newly created account.
        let newAccount = await createAccountService(account)

        // If successful send status for success and the newly created account.
        resp.json(newAccount)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for update one account.
const updateAccount = async (req, resp, next) => {
    console.log("******************************************** updateAccount ********************************************")

    try {

        // Get the id from request body.
        let id = req.body.id

        // Get the account number from request body.
        let accountNumber = req.body.accountNumber

        // Get the balance from request body.
        let balance = req.body.balance

        // Get the bankID from request body.
        let bankID = req.body.bankID

        // Get the userID from request body.
        let userID = req.body.userID

        // Create bucket for new object of account class for updating.
        let account = Account.createAccountWithID(id, accountNumber, balance, bankID, userID)

        // Validate account.
        account.validateAccount()

        // Create bucket for storing the newly updated account.
        let updateAccount = await updateAccountService(account)

        // If successful send status for success and the newly updated account.
        resp.json(updateAccount)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Create function for delete one account.
const deleteAccount = async (req, resp, next) => {
    console.log("******************************************** deleteAccount ********************************************")

    try {

        // Get the id from request body.
        let id = req.params.id

        // Create bucket for new object of account class for updating.
        let account = Account.createBlankAccountWithID(id)

        // Create bucket for storing the newly deleted account.
        let deleteAccount = await deleteAccountService(account)

        // If successful send status for success and the newly deleted account.
        resp.status(StatusCodes.CREATED).json(deleteAccount)

    } catch (error) {

        // If not successful send error.
        console.log(error)
        next(error)
    }
}

// Export all the fucntions.
module.exports = {
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountByID
}

