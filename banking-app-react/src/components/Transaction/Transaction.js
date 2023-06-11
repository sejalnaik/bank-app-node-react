import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Create from '@mui/icons-material/Create';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import { addTransaction as addTransactionService } from '../../service/Transaction/Transaction'
import { getAccounts as getAccountsService } from '../../service/Account/Account'
import { getLocalStorage as getLocalStorageService } from '../../service/Utility/LocalStorage'

const Transaction = () => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Create transaction object and its setter.
    const [transaction, setTransaction] = useState({})

    // Create disabled boolean for add button in form and its setter.
    const [disabled, setDisabled] = useState(true)

    // Create account list object and its setter.
    const [accountList, setAccountList] = useState([])

    // Variable for setting add or update form.
    const [operation, setOperation] = useState()

    // Variable for setting selected account.
    const [selectedAccount, setSelectedAccount] = useState()

    // Variable for add or update object for sending to api.
    let transactionForAdd = {}

    // ************************************ ADD TRANSACTION MODAL POPUP ********************************************

    // Variable for open state of add  modal.
    const [openModal, setOpenModal] = useState(false)

    // Open add modal popup.
    const onModalOpen = () => {
        setOpenModal(true)
    }

    // Close add modal popup.
    const onModalClose = () => {
        setOpenModal(false)
        setOperation(null)
    }

    // Style for add transaction modal popup.
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

    // Validate transaction.
    useEffect(() => {
        if (transaction.type) {
            validateForm()
        }
    }, [transaction])

    // Open modal on isAddOperation value change.
    useEffect(() => {
        if (operation != undefined) {
            onModalOpen()
        }
    }, [operation])

    // Print accounts.
    useEffect(() => {
        // console.log(accountList)
    }, [accountList])

    // Initial functions.
    useEffect(() => {

        // Initialize the transaction object.
        initializeTransaction()

        // Get account list.
        getAccountList()
    }, [])

    // ************************************ CRUD FUNCTIONS FOR TRANSACTION ********************************************

    // Add transaction.
    const addTransaction = async () => {
        try {
            formatTransactionBeforeAdd()
            const response = await addTransactionService(transactionForAdd)
            onModalClose()
            alert("Transaction added successfully")
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

    // On change in any transaction field.
    const onTransactionFieldChange = (event) => {

        // If field is account id then set the selected account.
        if (event.target.name == "accountID") {
            setSelectedAccountOnAccountChange(event.target.value)
        }

        // Get the name and value of element.
        const name = event.target.name
        let value = event.target.value

        // Set the transaction by sending function.
        setTransaction(values => ({ ...values, [name]: { value: value, error: null, touched: true } }))
    }

    // On account change set the selected account.
    const setSelectedAccountOnAccountChange = (accountID) => {
        for (let i = 0; i < accountList.length; i++) {
            if (accountList[i].id == accountID) {
                setSelectedAccount(accountList[i])
                return
            }
        }
    }

    // Validate transaction form.
    const validateForm = () => {

        // Remove zero values.
        removeZeroValue(transaction)

        // Validate account id.
        if (!transaction.accountID.value) {
            transaction.accountID.error = "Account must be specified"
        }

        // Validate to account id.
        if (transaction.type.value == "Transfer" && !transaction.toAccountID.value) {
            transaction.toAccountID.error = "Receiver account must be specified"
        }

        // Validate amount.
        if (!transaction.amount.value) {
            transaction.amount.error = "Amount must be specified"
        }

        // If amount exists then convert amount from string to number and validate.
        if (transaction.amount.value) {
            transaction.amount.value = +transaction.amount.value

            if (transaction.amount.value < 1) {
                transaction.amount.error = "Amount cannot be less than 1"
            }
            if (transaction.amount.value > 100000000000) {
                transaction.amount.error = "Amount cannot be more than 100000000000"
            }
            if ((transaction.type.value == "Withdraw" || transaction.type.value == "Transfer") && transaction.amount.value > selectedAccount.balance) {
                transaction.amount.error = "Amount exceeding balance"
            }
        }

        // If account is and to account id are same then give error.
        if (transaction.accountID.value == transaction.toAccountID.value) {
            transaction.toAccountID.value = null
            transaction.toAccountID.error = "Sender and receiver account cannot be same"
        }

        // Check if transaction field has any error value, if eror then keep the add button in form disabled.
        doesTransactionFieldHaveError()
    }

    // Does any transaction field have error value.
    const doesTransactionFieldHaveError = () => {
        let tempDisabled = false
        for (let key in transaction) {
            if (transaction[key].error) {
                tempDisabled = true
                break
            }
        }
        setDisabled(tempDisabled)
    }

    // Set the touched state of transaction field on its input click.
    const setTouchStateOnClick = (field) => {
        field.touched = true
    }

    // On add transaction in form button click.
    const onAddTransactionInFormClick = (event) => {
        event.preventDefault()
        addTransaction()
    }

    // Format the transaction object before sending it through API.
    const formatTransactionBeforeAdd = () => {
        for (let key in transaction) {
            transactionForAdd[key] = transaction[key].value
        }
    }

    // Initialize transaction fields.
    const initializeTransaction = () => {
        transaction.id = { value: null, error: null, touched: false }
        transaction.type = { value: null, error: null, touched: false }
        transaction.accountID = { value: null, error: null, touched: false }
        transaction.toAccountID = { value: null, error: null, touched: false }
        transaction.amount = { value: null, error: null, touched: false }
    }

    // Format transaction on type click.
    const formatTransactionOnTypeClick = () => {
        transaction.toAccountID = { value: null, error: null, touched: false }
        transaction.amount = { value: null, error: null, touched: false }
    }

    // On clicking transaction type button.
    const onTransactionTypeButtonClick = (type) => {
        if (!transaction.accountID.value) {
            alert("First select account")
            return
        }
        setOperation(type)
        transaction.type.value = type
        formatTransactionOnTypeClick()
    }

    // ************************************ GET FUNCTIONS ********************************************

    // Get accounts.
    const getAccountList = async () => {
        try {
            const response = await getAccountsService()
            response.data.unshift({ id: "", accountNumber: "Select" })
            setAccountList(response.data)
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
        if (operation == "Deposit") {
            return (
                <span>
                    Deposit
                </span>
            )
        }
        if (operation == "Withdraw") {
            return (
                <span>
                    Withdraw
                </span>
            )
        }
        return (
            <span>
                Transfer
            </span>
        )
    }

    // Render options of select for account list.
    const optionsForAccountList = Object.values(accountList).map((account) => {
        if (!account.bank) {
            return (
                <option key={account.id} value={account.id}>{account.accountNumber}</option>
            )
        }
        if (operation == null && account.bank && account.user?.id == getLocalStorageService("userID")) {
            return (
                <option key={account.id} value={account.id}>{account.accountNumber} - {account.bank?.name} - {account.user?.firstName + " " + account.user?.lastName}</option>
            )
        }
        if (operation != null && account.bank) {
            return (
                <option key={account.id} value={account.id}>{account.accountNumber} - {account.bank?.name} - {account.user?.firstName + " " + account.user?.lastName}</option>
            )
        }
        return (
            <></>
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

                {/* Transaction type group */}
                <div className='transaction-button-group-style'>
                    <div className='transaction-button-style' onClick={() => onTransactionTypeButtonClick("Deposit")}>
                        DEPOSIT
                    </div>
                    <div className='transaction-button-style' onClick={() => onTransactionTypeButtonClick("Withdraw")}>
                        WITHDRAW
                    </div>
                    <div className='transaction-button-style' onClick={() => onTransactionTypeButtonClick("Transfer")}>
                        TRANSFER
                    </div>
                </div>
                <br />

                {/* Select account */}
                <div>
                    <form>
                        <div className="form-group">
                            <label className="form-field-label-style account-text-style">Account</label>
                            {(selectedAccount && selectedAccount.id != "") && (
                                <>
                                    &nbsp;&nbsp;&nbsp;
                                    <label className="form-field-label-style account-text-style">: {selectedAccount?.balance}</label>
                                </>
                            )}

                            <div className="input-style">
                                <select className="form-control" name="accountID" onChange={onTransactionFieldChange} value={transaction.accountID?.value}
                                    onClick={() => setTouchStateOnClick(transaction.accountID)}>
                                    {optionsForAccountList}
                                </select>
                                <ShowErrorMessage field={transaction.accountID} />
                            </div>
                        </div>
                        <br /><br /><br />
                    </form >
                </div>

                {/* Add/update bank modal */}
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
                                <div onClick={onModalClose} className="close-modal-popup-style">
                                    <Close />
                                </div>
                            </div>
                            <div className="marked-fields-style"><span className="red"><strong>*</strong></span> marked fields are
                                mandatory</div>
                            <form>
                                <div className='row'>
                                    <div className="form-group">
                                        <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>Amount</label>
                                        <div className="col-sm-10">
                                            <input type="number" className="form-control" placeholder="eg: 500" name="amount"
                                                onChange={onTransactionFieldChange} onClick={() => setTouchStateOnClick(transaction.amount)} value={transaction.amount?.value} />
                                            <ShowErrorMessage field={transaction.amount} />
                                        </div>
                                    </div>
                                    {transaction.type?.value == "Transfer" && (
                                        <>
                                            <br /><br /><br />
                                            <div className="form-group">
                                                <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>To Account</label>
                                                <div className="col-sm-10">
                                                    <select className="form-control" name="toAccountID" onChange={onTransactionFieldChange} value={transaction.toAccountID?.value}
                                                        onClick={() => setTouchStateOnClick(transaction.toAccountID)}>
                                                        {optionsForAccountList}
                                                    </select>
                                                    <ShowErrorMessage field={transaction.toAccountID} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <br />
                                <div className="form-group text-center">
                                    <button type="submit" className="btn add-form-button-style" disabled={disabled}
                                        onClick={(event) => onAddTransactionInFormClick(event)}>
                                        <ShowFormHeader></ShowFormHeader>
                                    </button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button type="submit" className="btn add-form-button-style" onClick={onModalClose}>
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div >
                    </Box >
                </Modal >
            </div >
        </>
    )
}

export default Transaction