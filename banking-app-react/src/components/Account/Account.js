import React, { useState, useEffect } from 'react'
import { addAccount as addAccountService, getAccounts as getAccountsService, updateAccount as updateAccountService, deleteAccount as deleteAccountService } from '../../service/Account/Account'
import { getBanks as getBanksService } from '../../service/Bank/Bank'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Create from '@mui/icons-material/Create';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import { getLocalStorage as getLocalStorageService } from '../../service/Utility/LocalStorage'

const Account = () => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Create account object and its setter.
    const [account, setAccount] = useState({})

    // Create disabled boolean for add button in form and its setter.
    const [disabled, setDisabled] = useState(true)

    // Create accounts object and its setter.
    const [accounts, setAccounts] = useState([])

    // Variable for setting add or update form.
    const [isAddOperation, setIsAddOperation] = useState()

    // Variable for bank list add and its setter.
    const [bankList, setBankList] = useState([])

    // Variable for add or update object for sending to api.
    let accountForAddUpdate = {}

    // Create user id after getting it from local storage.
    let userID = getLocalStorageService("userID")

    // Create isAdmin after getting it from local storage.
    let isAdmin = getLocalStorageService("isAdmin")

    // ************************************ ADD ACCOUNT MODAL POPUP ********************************************

    // Variable for open state of add account modal.
    const [openModal, setOpenModal] = useState(false)

    // Open add modal popup.
    const onModalOpen = () => {
        setOpenModal(true)
    }

    // Close add modal popup.
    const onModalClose = () => {
        setOpenModal(false)
        setIsAddOperation(null)
    }

    // Style for add account modal popup.
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 2,
        borderRadius: '10px',
        borderColor: "#57148b"
    }

    // ************************************ USEEFFECT FUNCTIONS ********************************************

    // Validate account.
    useEffect(() => {
        if (account.bankID) {
            validateForm()
        }
    }, [account])

    // Open modal on isAddOperation value change.
    useEffect(() => {
        if (isAddOperation != undefined) {
            onModalOpen()
        }
    }, [isAddOperation])

    // Print accounts.
    useEffect(() => {
        // console.log(accounts)
    }, [accounts])

    // Initial functions.
    useEffect(() => {

        // Initialize the account object.
        initializeAccount()

        // Get the accounts.
        getAccounts()

        // Get bank list.
        getBankList()
    }, [])

    // ************************************ CRUD FUNCTIONS FOR ACCOUNT ********************************************

    // Add account.
    const addAccount = async () => {
        try {
            formatAccountBeforeAdd()
            const response = await addAccountService(accountForAddUpdate)
            onModalClose()
            getAccounts()
            alert("Account added successfully")
        } catch (error) {
            console.error(error)
            if ((error && error.message && error.message.response && error.message.response.data && error.message.response.data.error)) {
                alert(error.message.response.data.error)
            }
            if (error && error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error)
            }
        }
    }

    // Get accounts.
    const getAccounts = async () => {
        try {
            const response = await getAccountsService(account)
            setAccounts(response.data)
        } catch (error) {
            console.error(error)
            if ((error && error.message && error.message.response && error.message.response.data && error.message.response.data.error)) {
                // alert(error.message.response.data.error)
            }
            if (error && error.response && error.response.data && error.response.data.error) {
                // alert(error.response.data.error)
            }
        }
    }

    // Update account.
    const updateAccount = async () => {
        try {
            formatAccountBeforeAdd()
            const response = await updateAccountService(accountForAddUpdate)
            onModalClose()
            getAccounts()
            alert("Account updated successfully")
        } catch (error) {
            console.error(error)
            if ((error && error.message && error.message.response && error.message.response.data && error.message.response.data.error)) {
                alert(error.message.response.data.error)
            }
            if (error && error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error)
            }
        }
    }

    // Delete account.
    const deleteAccount = async (accountID) => {
        try {
            const response = await deleteAccountService(accountID)
            getAccounts()
            alert("Account deleted successfully")
        } catch (error) {
            console.error(error)
            if ((error && error.message && error.message.response && error.message.response.data && error.message.response.data.error)) {
                alert(error.message.response.data.error)
            }
            if (error && error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error)
            }
        }
    }

    // ************************************ FORM FUNCTIONS ********************************************

    // On change in any account field.
    const onAccountFieldChange = (event) => {

        // Get the name and value of element.
        const name = event.target.name
        let value = event.target.value

        // Set the account by sending function.
        setAccount(values => ({ ...values, [name]: { value: value, error: null, touched: true } }))
    }

    // Validate account form.
    const validateForm = () => {

        // Remove zero values.
        removeZeroValue(account)

        // Validate bankID.
        if (!account.bankID.value) {
            account.bankID.error = "Bank must be specified"
        }

        // Validate balance.
        if (!account.balance.value) {
            account.balance.error = "Balance must be specified"
        }

        // If balance exists then convert balance from string to number and validate.
        if (account.balance.value) {
            account.balance.value = +account.balance.value
            if (account.balance.value < 500) {
                account.balance.error = "Balance cannot be less than 500"
            }
            if (account.balance.value > 100000000000) {
                account.balance.error = "Balance cannot be more than 100000000000"
            }
        }

        // Check if account field has any error value, if eror then keep the add button in form disabled.
        doesAccountFieldHaveError()
    }

    // Does any account field have error value.
    const doesAccountFieldHaveError = () => {
        let tempDisabled = false
        for (let key in account) {
            if (account[key].error) {
                tempDisabled = true
                break
            }
        }
        setDisabled(tempDisabled)
    }

    // Set the touched state of account field on its input click.
    const setTouchStateOnClick = (field) => {
        field.touched = true
    }

    // On add account in form button click.
    const onAddUpdateAccountInFormClick = (event) => {
        event.preventDefault()
        if (isAddOperation) {
            addAccount()
            return
        }
        updateAccount()
    }

    // Format the account object before sending it through API.
    const formatAccountBeforeAdd = () => {
        for (let key in account) {
            accountForAddUpdate[key] = account[key].value
        }

        // Give the user id from local storage.
        accountForAddUpdate.userID = userID
    }

    // On clicking account update icon.
    const onAccountUpdateIconClick = (updateAccount) => {
        setIsAddOperation(false)
        let tempAccount = {}
        tempAccount.id = { value: updateAccount.id, error: null, touched: false }
        tempAccount.bankID = { value: updateAccount.bank.id, error: null, touched: false }
        tempAccount.balance = { value: updateAccount.balance, error: null, touched: false }
        setAccount(tempAccount)
    }

    // Initialize account fields.
    const initializeAccount = () => {
        account.id = { value: null, error: null, touched: false }
        account.bankID = { value: null, error: null, touched: false }
        account.balance = { value: null, error: null, touched: false }
    }

    // On clicking add account button.
    const onAddAccountButtonClick = () => {
        setIsAddOperation(true)
        initializeAccount()
    }

    // On clicking delete account icon.
    const onAccountDeleteButtonClick = (accountID) => {
        if (window.confirm("Are you sure you want to delete the account?")) {
            deleteAccount(accountID)
        }
    }

    // ************************************ GET FUNCTIONS ********************************************

    // Get banks.
    const getBankList = async () => {
        try {
            const response = await getBanksService()
            response.data.unshift({ id: "", name: "Select" })
            setBankList(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    // ************************************ COMPONENT RENDER FUNCTIONS ********************************************

    // Show error message.
    const ShowErrorMessage = ({ field }) => {
        if (field && field.touched && field.error) {
            return (
                <div className="alert alert-danger">
                    {field.error}
                </div>
            )
        }
        return (
            <>
            </>
        )
    }

    // Show form hedaer.
    const ShowFormHeader = () => {
        if (isAddOperation) {
            return (
                <span>
                    Add Account
                </span>
            )
        }
        return (
            <span>
                Update Account
            </span>
        )
    }

    // Render rows of accounts for accounts table.
    const rowsOfAccount = Object.values(accounts).map((account, index) => {
        return (
            <tr key={account.id}>
                <td>{index + 1}</td>
                <td>{account.accountNumber}</td>
                <td>{account.bank?.name}</td>
                <td>{account.user?.firstName + " " + account.user?.lastName}</td>
                <td>{account.balance}</td>
                {isAdmin == "false" ? <td>lala</td> : <></>}
                {isAdmin == "true" ? <td><Delete className='cursor-pointer' onClick={() => { onAccountDeleteButtonClick(account.id) }}></Delete></td> : <></>}
                {/* <td><Create className='cursor-pointer' onClick={() => { onAccountUpdateIconClick(account) }}></Create></td> */}
            </tr>
        )
    })

    // Render options of select for bank list.
    const optionsForBankList = Object.values(bankList).map((bank, index) => {
        return (
            <option key={bank.id} value={bank.id}>{bank.name}</option>
        )
    })

    // ************************************ OTHER FUNCTIONS ********************************************

    // Remove zero values from fields of object.
    const removeZeroValue = obj => {
        for (let key in obj) {
            if (obj[key].value === "" || obj[key].value === 0) {
                obj[key].value = null
            }
        }
    }

    return (
        <>
            <div className="container-fluid mt-n5 background-style standard-page-margin">

                {/* Page hedaer */}
                <div className="header-style">

                    {/* Add account button */}
                    {isAdmin == "false" ? <button onClick={onAddAccountButtonClick} className="btn btn-default add-button-style">ADD ACCOUNT</button> : <></>}

                    {/* Pagination */}
                    <div className="header-left-style">
                        yay
                    </div>
                </div>
                <br /><br />

                {/* Table of accounts */}
                <table className="table table-style">
                    <thead>
                        <tr>
                            <th scope="col">Sr No</th>
                            <th scope="col">Account Number</th>
                            <th scope="col">Bank</th>
                            <th scope="col">User</th>
                            <th scope="col">Balance</th>
                            {isAdmin == "false" ? <th scope="col">Show Passbook</th> : <></>}
                            {/* <th scope="col">Update</th> */}
                            {isAdmin == "true" ? <th scope="col">Delete</th> : <></>}
                        </tr>
                    </thead>
                    <tbody>
                        {rowsOfAccount}
                    </tbody>
                </table>

                {/* Add/update account modal */}
                <Modal
                    open={openModal}
                    onClose={onModalClose}
                    hideBackdrop={true}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className="modal-body">
                            <div className="form-header-style">
                                <ShowFormHeader></ShowFormHeader> &nbsp;&nbsp;
                                {/* <span className='cursor-pointer'>
                                    <Create />
                                </span> */}
                                <div onClick={onModalClose} className="close-modal-popup-style">
                                    <Close />
                                </div>
                            </div>
                            <div className="marked-fields-style"><span className="red"><strong>*</strong></span> marked fields are
                                mandatory</div>
                            <br />
                            <form>
                                <div className='row'>
                                    <div className="form-group">
                                        <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>Bank</label>
                                        <div className="col-sm-10">
                                            <select className="form-control" name="bankID" onChange={onAccountFieldChange} value={account.bankID?.value}
                                                onClick={() => setTouchStateOnClick(account.bankID)}>
                                                {/* <option value={null} disabled>Select</option> */}
                                                {optionsForBankList}
                                            </select>
                                            <ShowErrorMessage field={account.bankID} />
                                        </div>
                                    </div>
                                    <br /><br /><br />
                                    <div className="form-group">
                                        <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>Balance</label>
                                        <div className="col-sm-10">
                                            <input type="number" className="form-control" placeholder="eg: 500" name="balance"
                                                onChange={onAccountFieldChange} onClick={() => setTouchStateOnClick(account.balance)} value={account.balance?.value} />
                                            <ShowErrorMessage field={account.balance} />
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className="form-group text-center">
                                    <button type="submit" className="btn add-form-button-style" disabled={disabled}
                                        onClick={(event) => onAddUpdateAccountInFormClick(event)}>
                                        <ShowFormHeader></ShowFormHeader>
                                    </button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button type="submit" className="btn add-form-button-style" onClick={onModalClose}>
                                        Close
                                    </button>
                                </div>
                            </form >
                        </div >
                    </Box >
                </Modal >
            </div >
        </>
    )
}

export default Account