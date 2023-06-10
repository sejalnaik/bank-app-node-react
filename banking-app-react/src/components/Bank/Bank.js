import React, { useState, useEffect, useRef } from 'react'
import { addBank as addBankService, getBanks as getBanksService, updateBank as updateBankService, deleteBank as deleteBankService } from '../../service/Bank/Bank'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Create from '@mui/icons-material/Create';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';

const Bank = () => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Create bank object and its setter.
    const [bank, setBank] = useState({})

    // Create disabled boolean for add button in form and its setter.
    const [disabled, setDisabled] = useState(true)

    // Create banks object and its setter.
    const [banks, setBanks] = useState([])

    // Variable for setting add or update form.
    const [isAddOperation, setIsAddOperation] = useState()

    // Variable for add or update object for sending to api.
    let bankForAddUpdate = {}

    // Variable for name search.
    const nameSearch = useRef()

    // Variable for abbrevieation search.
    const abbrevieationSearch = useRef()

    // Search varibale for sending search to api.
    let bankSearchObject = {}

    // Search boolean for saving if is searched state.
    const [isSearched, setIsSearched] = useState(false)

    // ************************************ ADD BANK MODAL POPUP ********************************************

    // Variable for open state of add bank modal.
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

    // Style for add bank modal popup.
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

    // Validate bank.
    useEffect(() => {
        if (bank.name) {
            validateForm()
        }
    }, [bank])

    // Open modal on isAddOperation value change.
    useEffect(() => {
        if (isAddOperation != undefined) {
            onModalOpen()
        }
    }, [isAddOperation])

    // Validate bank.
    useEffect(() => {
        // console.log(banks)
    }, [banks])

    // Initial functions.
    useEffect(() => {

        // Initialize the bank object.
        initializeBank()

        // Get the banks.
        getBanks()
    }, [])

    // ************************************ CRUD FUNCTIONS FOR BANK ********************************************

    // Add bank.
    const addBank = async () => {
        try {
            formatBankBeforeAdd()
            const response = await addBankService(bankForAddUpdate)
            onModalClose()
            getBanks()
            alert("Bank added successfully")
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

    // Get banks.
    const getBanks = async () => {
        try {
            const response = await getBanksService(bankSearchObject)
            setBanks(response.data)
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

    // Update bank.
    const updateBank = async () => {
        try {
            formatBankBeforeAdd()
            const response = await updateBankService(bankForAddUpdate)
            onModalClose()
            getBanks()
            alert("Bank updated successfully")
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

    // Delete bank.
    const deleteBank = async (bankID) => {
        try {
            const response = await deleteBankService(bankID)
            getBanks()
            alert("Bank deleted successfully")
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

    // On change in any bank field.
    const onBankFieldChange = (event) => {

        // Get the name and value of element.
        const name = event.target.name
        let value = event.target.value

        // Set the bank by sending function.
        setBank(values => ({ ...values, [name]: { value: value, error: null, touched: true } }))
    }

    // Validate bank form.
    const validateForm = () => {

        // Remove zero values.
        removeZeroValueFromBank(bank)

        // Validate name.
        if (!bank.name.value) {
            bank.name.error = "Name must be specified"
        }
        if (bank.name.value && bank.name.value.length > 100) {
            bank.name.error = "Name can contain upto 100 characters"
        }

        // Validate abbrevieation.
        if (!bank.abbrevieation.value) {
            bank.abbrevieation.error = "Abbrevieation must be specified"
        }
        if (bank.abbrevieation.value && bank.abbrevieation.value.length > 100) {
            bank.abbrevieation.error = "Abbrevieation can contain upto 100 characters"
        }

        // Check if bank field has any error value, if eror then keep the add button in form disabled.
        doesBankFieldHaveError()
    }

    // Does any bank field have error value.
    const doesBankFieldHaveError = () => {
        let tempDisabled = false
        for (let key in bank) {
            if (bank[key].error) {
                tempDisabled = true
                break
            }
        }
        setDisabled(tempDisabled)
    }

    // Set the touched state of bank field on its input click.
    const setTouchStateOnClick = (field) => {
        field.touched = true
    }

    // On add bank in form button click.
    const onAddUpdateBankInFormClick = (event) => {
        event.preventDefault()
        if (isAddOperation) {
            addBank()
            return
        }
        updateBank()
    }

    // Format the bank object before sending it through API.
    const formatBankBeforeAdd = () => {
        for (let key in bank) {
            bankForAddUpdate[key] = bank[key].value
        }
    }

    // On clicking bank update icon.
    const onBankUpdateIconClick = (updateBank) => {
        setIsAddOperation(false)
        let tempBank = {}
        tempBank.id = { value: updateBank.id, error: null, touched: false }
        tempBank.name = { value: updateBank.name, error: null, touched: false }
        tempBank.abbrevieation = { value: updateBank.abbrevieation, error: null, touched: false }
        tempBank.balance = { value: updateBank.balance, error: null, touched: false }
        setBank(tempBank)
    }

    // Initialize bank fields.
    const initializeBank = () => {
        bank.id = { value: null, error: null, touched: false }
        bank.name = { value: null, error: null, touched: false }
        bank.abbrevieation = { value: null, error: null, touched: false }
        bank.balance = { value: 0, error: null, touched: false }
    }

    // On clicking add bank button.
    const onAddBankButtonClick = () => {
        setIsAddOperation(true)
        initializeBank()
    }

    // On clicking delete bank icon.
    const onBankDeleteButtonClick = (bankID) => {
        if (window.confirm("Are you sure you want to delete the bank?")) {
            deleteBank(bankID)
        }
    }

    // ************************************ SEARCH DEFINITIONS ********************************************

    // On search button click.
    const onSearchClick = (event) => {
        bankSearchObject.name = nameSearch.current.value
        bankSearchObject.abbrevieation = abbrevieationSearch.current.value
        removeZeroValueFiled(bankSearchObject)
        if (Object.keys(bankSearchObject).length > 0) {
            setIsSearched(true)
        }
        if (Object.keys(bankSearchObject).length == 0) {
            setIsSearched(false)
        }
        getBanks()
    }

    // On reset search button click.
    const onResetSearchClick = () => {
        nameSearch.current.value = null
        abbrevieationSearch.current.value = null
        bankSearchObject = {}
    }

    // On view all button click.
    const onViewAllClick = () => {
        nameSearch.current.value = null
        abbrevieationSearch.current.value = null
        bankSearchObject = {}
        setIsSearched(false)
        getBanks()
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
                    Add bank
                </span>
            )
        }
        return (
            <span>
                Update bank
            </span>
        )
    }

    // Render rows of banks for banks table.
    const rowsOfBank = Object.values(banks).map((bank, index) => {
        return (
            <tr key={bank.id}>
                <td>{index + 1}</td>
                <td>{bank.name}</td>
                <td>{bank.abbrevieation}</td>
                <td>{bank.balance}</td>
                <td>{bank.accounts?.length}</td>
                <td><Create className='cursor-pointer' onClick={() => { onBankUpdateIconClick(bank) }}></Create></td>
                <td><Delete className='cursor-pointer' onClick={() => { onBankDeleteButtonClick(bank.id) }}></Delete></td>
            </tr>
        )
    })

    // ************************************ OTHER FUNCTIONS ********************************************

    // Remove zero values from fields of bank object.
    const removeZeroValueFromBank = obj => {
        for (let key in obj) {
            if (key == "balance") {
                continue
            }
            if (obj[key].value === "" || obj[key].value === 0) {
                obj[key].value = null
            }
        }
    }

    // Remove zero values from fields of object.
    const removeZeroValueFiled = obj => {
        for (let key in obj) {
            if (obj[key] === "" || obj[key] === 0) {
                delete obj[key]
            }
        }
    }

    return (
        <>
            <div className="container-fluid mt-n5 background-style standard-page-margin">

                {/* Page hedaer */}
                <div className="header-style">

                    {/* Add bank button */}
                    <button onClick={onAddBankButtonClick} className="btn btn-default add-button-style">ADD BANK</button>

                    {/* View all button */}
                    {isSearched && (
                        <>
                            &nbsp;&nbsp;&nbsp;
                            <button onClick={onViewAllClick} className="btn btn-default add-button-style">VIEW ALL</button>
                        </>
                    )}

                    {/* Pagination */}
                    <div className="header-left-style">
                        yay
                    </div>
                </div>
                <br />
                <div className="header-style">

                    {/* Search */}
                    <label className="form-field-label-style">Name: </label>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        <input type="text" className="form-control" placeholder="eg: Yes Bank" ref={nameSearch} />
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <label className="form-field-label-style">Abbrevieation: </label>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        <input type="text" className="form-control" placeholder="eg: YB" ref={abbrevieationSearch} />
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <button onClick={onSearchClick} className="btn btn-default add-button-style">SEARCH</button>
                    &nbsp;&nbsp;&nbsp;
                    <button onClick={onResetSearchClick} className="btn btn-default add-button-style">RESET</button>
                </div>
                <br /><br />

                {/* Table of banks */}
                <table className="table table-style">
                    <thead>
                        <tr>
                            <th scope="col">Sr No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Abbrevieation</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Count of accounts</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowsOfBank}
                    </tbody>
                </table>

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
                                        <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>Name</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" placeholder="eg: Yes Bank" name="name"
                                                onChange={onBankFieldChange} onClick={() => setTouchStateOnClick(bank.name)} value={bank.name?.value} />
                                            <ShowErrorMessage field={bank.name} />
                                        </div>
                                    </div>
                                    <br /><br /><br />
                                    <div className="form-group">
                                        <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>Abbrevieation</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" placeholder="eg: YB" name="abbrevieation"
                                                onChange={onBankFieldChange} onClick={() => setTouchStateOnClick(bank.abbrevieation)} value={bank.abbrevieation?.value} />
                                            <ShowErrorMessage field={bank.abbrevieation} />
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className="form-group text-center">
                                    <button type="submit" className="btn add-form-button-style" disabled={disabled}
                                        onClick={(event) => onAddUpdateBankInFormClick(event)}>
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

export default Bank