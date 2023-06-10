import React, { useState, useEffect, useRef } from 'react'
import { addUser as addUserService, getUsers as getUsersService, updateUser as updateUserService, deleteUser as deleteUserService } from '../../service/User/User'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Create from '@mui/icons-material/Create';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import { getLocalStorage as getLocalStorageService } from '../../service/Utility/LocalStorage'

const User = () => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Create user object and its setter.
    const [user, setUser] = useState({})

    // Create disabled boolean for add button in form and its setter.
    const [disabled, setDisabled] = useState(true)

    // Create users object and its setter.
    const [users, setUsers] = useState([])

    // Variable for setting add or update form.
    const [isAddOperation, setIsAddOperation] = useState()

    // Variable for add or update object for sending to api.
    let userForAddUpdate = {}

    // Variable for first name search.
    const firstNameSearch = useRef()

    // Variable for last name search.
    const lastNameSearch = useRef()

    // Variable for email search.
    const emailSearch = useRef()

    // Variable for isAdmin search.
    const isAdminSearch = useRef()

    // Search varibale for sending search to api.
    let userSearchObject = {}

    // Search boolean for saving if is searched state.
    const [isSearched, setIsSearched] = useState(false)

    // ************************************ ADD USER MODAL POPUP ********************************************

    // Variable for open state of add user modal.
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

    // Style for add user modal popup.
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

    // Validate user.
    useEffect(() => {
        if (user.firstName) {
            validateForm()
        }
    }, [user])

    // Open modal on isAddOperation value change.
    useEffect(() => {
        if (isAddOperation != undefined) {
            onModalOpen()
        }
    }, [isAddOperation])

    // Validate user.
    useEffect(() => {
        console.log(users)
    }, [users])

    // Initial functions.
    useEffect(() => {

        // Initialize the user object.
        initializeUser()

        // Get the users.
        getUsers()
    }, [])

    // ************************************ CRUD FUNCTIONS FOR USER ********************************************

    // Add user.
    const addUser = async () => {
        try {
            formatUserBeforeAdd()
            const response = await addUserService(userForAddUpdate)
            onModalClose()
            getUsers()
            alert("User added successfully")
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

    // Get users.
    const getUsers = async () => {
        try {
            const response = await getUsersService(user)
            setUsers(response.data)
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

    // Update user.
    const updateUser = async () => {
        try {
            formatUserBeforeAdd()
            const response = await updateUserService(userForAddUpdate)
            onModalClose()
            getUsers()
            alert("User updated successfully")
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

    // Delete user.
    const deleteUser = async (userID) => {
        try {
            const response = await deleteUserService(userID)
            getUsers()
            alert("User deleted successfully")
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

    // On change in any user field.
    const onUserFieldChange = (event) => {

        // Get the name and value of element.
        const name = event.target.name
        let value = event.target.value

        // If admin(checkbox) then take its checked value.
        if (name == "isAdmin") {
            value = event.target.checked
        }

        // Set the user by sending function.
        setUser(values => ({ ...values, [name]: { value: value, error: null, touched: true } }))
    }

    // Validate user form.
    const validateForm = () => {

        // Remove zero values.
        removeZeroValue(user)

        // Validate first name.
        if (!user.firstName.value) {
            user.firstName.error = "First name must be specified"
        }
        if (user.firstName.value && user.firstName.value.length > 100) {
            user.firstName.error = "First name can contain upto 100 characters"
        }

        // Validate last name.
        if (!user.lastName.value) {
            user.lastName.error = "Last name must be specified"
        }
        if (user.lastName.value && user.lastName.value.length > 100) {
            user.lastName.error = "Last name can contain upto 100 characters"
        }

        // Validate email.
        if (!user.email.value) {
            user.email.error = "Email must be specified"
        }
        if (user.email.value && user.email.value.length > 100) {
            user.email.error = "Email can contain upto 100 characters"
        }

        // Validate password.
        if (!user.password.value) {
            user.password.error = "Password must be specified"
        }
        if (user.password.value && user.password.value.length > 100) {
            user.password.error = "Password can contain upto 100 characters"
        }

        // Check if user field has any error value, if eror then keep the add button in form disabled.
        doesUserFieldHaveError()
    }

    // Does any user field have error value.
    const doesUserFieldHaveError = () => {
        let tempDisabled = false
        for (let key in user) {
            if (user[key].error) {
                tempDisabled = true
                break
            }
        }
        setDisabled(tempDisabled)
    }

    // Set the touched state of user field on its input click.
    const setTouchStateOnClick = (field) => {
        field.touched = true
    }

    // On add user in form button click.
    const onAddUpdateUserInFormClick = (event) => {
        event.preventDefault()
        if (isAddOperation) {
            addUser()
            return
        }
        updateUser()
    }

    // Format the user object before sending it through API.
    const formatUserBeforeAdd = () => {
        for (let key in user) {
            userForAddUpdate[key] = user[key].value
        }
    }

    // On clicking user update icon.
    const onUserUpdateIconClick = (updateUser) => {
        setIsAddOperation(false)
        let tempUser = {}
        tempUser.id = { value: updateUser.id, error: null, touched: false }
        tempUser.firstName = { value: updateUser.firstName, error: null, touched: false }
        tempUser.lastName = { value: updateUser.lastName, error: null, touched: false }
        tempUser.email = { value: updateUser.email, error: null, touched: false }
        tempUser.password = { value: updateUser.password, error: null, touched: false }
        tempUser.totalBalance = { value: updateUser.totalBalance, error: null, touched: false }
        tempUser.isAdmin = { value: updateUser.isAdmin, error: null, touched: false }
        setUser(tempUser)
    }

    // Initialize user fields.
    const initializeUser = () => {
        user.id = { value: null, error: null, touched: false }
        user.firstName = { value: null, error: null, touched: false }
        user.lastName = { value: null, error: null, touched: false }
        user.email = { value: null, error: null, touched: false }
        user.password = { value: null, error: null, touched: false }
        user.totalBalance = { value: 0, error: null, touched: false }
        user.isAdmin = { value: false, error: null, touched: false }
    }

    // On clicking add user button.
    const onAddUserButtonClick = () => {
        setIsAddOperation(true)
        initializeUser()
    }

    // On clicking delete user icon.
    const onUserDeleteButtonClick = (userID) => {
        if (window.confirm("Are you sure you want to delete the user?")) {
            deleteUser(userID)
        }
    }

    // ************************************ SEARCH DEFINITIONS ********************************************

    // On search button click.
    const onSearchClick = (event) => {
        userSearchObject.firstName = firstNameSearch.current.value
        userSearchObject.lastName = lastNameSearch.current.value
        userSearchObject.email = emailSearch.current.value
        userSearchObject.isAdmin = isAdminSearch.current.value
        removeZeroValueFiled(userSearchObject)
        if (Object.keys(userSearchObject).length > 0) {
            setIsSearched(true)
        }
        if (Object.keys(userSearchObject).length == 0) {
            setIsSearched(false)
        }
        getUsers()
    }

    // On reset search button click.
    const onResetSearchClick = () => {
        firstNameSearch.current.value = null
        lastNameSearch.current.value = null
        emailSearch.current.value = null
        isAdminSearch.current.value = null
        userSearchObject = {}
    }

    // On view all button click.
    const onViewAllClick = () => {
        firstNameSearch.current.value = null
        lastNameSearch.current.value = null
        emailSearch.current.value = null
        isAdminSearch.current.value = null
        userSearchObject = {}
        setIsSearched(false)
        getUsers()
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
                    Add user
                </span>
            )
        }
        return (
            <span>
                Update user
            </span>
        )
    }

    // Render rows of users for users table.
    const rowsOfUser = Object.values(users).map((user, index) => {
        return (
            <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.firstName + " " + user.lastName}</td>
                {user.isAdmin ? <td>Admin</td> : <td>Customer</td>}
                <td>{user.totalBalance}</td>
                <td>{user.accounts?.length}</td>
                <td><Create className='cursor-pointer' onClick={() => { onUserUpdateIconClick(user) }}></Create></td>
                <td><Delete className='cursor-pointer' onClick={() => { onUserDeleteButtonClick(user.id) }}></Delete></td>
            </tr>
        )
    })

    // ************************************ OTHER FUNCTIONS ********************************************

    // Remove zero values from fields of object.
    const removeZeroValue = obj => {
        for (let key in obj) {
            if (key == "totalBalance") {
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

                    {/* Add user button */}
                    <button onClick={onAddUserButtonClick} className="btn btn-default add-button-style">ADD USER</button>

                    {/* Pagination */}
                    <div className="header-left-style">
                        yay
                    </div>
                </div>
                <br />
                <div className="header-style">

                    {/* Search */}
                    <label className="form-field-label-style">First Name: </label>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        <input type="text" className="form-control" placeholder="eg: Sejal" ref={firstNameSearch} />
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <label className="form-field-label-style">Last Name: </label>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        <input type="text" className="form-control" placeholder="eg: Naik" ref={lastNameSearch} />
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <label className="form-field-label-style">Email: </label>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        <input type="text" className="form-control" placeholder="eg: sejal@gmail.com" ref={emailSearch} />
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <label className="form-field-label-style">Is Admin: </label>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        <input className="form-check-input" type="checkbox" ref={isAdminSearch} />
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <button onClick={onSearchClick} className="btn btn-default add-button-style">SEARCH</button>
                    &nbsp;&nbsp;&nbsp;
                    <button onClick={onResetSearchClick} className="btn btn-default add-button-style">RESET</button>
                </div>
                <br /><br />

                {/* Table of users */}
                <table className="table table-style">
                    <thead>
                        <tr>
                            <th scope="col">Sr No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Role</th>
                            <th scope="col">Balance</th>
                            <th scope="col">No of accounts</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowsOfUser}
                    </tbody>
                </table>

                {/* Add/update user modal */}
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
                                        <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>First Name</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" placeholder="eg: sejal" name="firstName"
                                                onChange={onUserFieldChange} onClick={() => setTouchStateOnClick(user.firstName)} value={user.firstName?.value} />
                                            <ShowErrorMessage field={user.firstName} />
                                        </div>
                                    </div>
                                    <br /><br /><br />
                                    <div className="form-group">
                                        <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>Last Name</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" placeholder="eg: naik" name="lastName"
                                                onChange={onUserFieldChange} onClick={() => setTouchStateOnClick(user.lastName)} value={user.lastName?.value} />
                                            <ShowErrorMessage field={user.lastName} />
                                        </div>
                                    </div>
                                    <br /><br /><br />
                                    <div className="form-group">
                                        <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>Email</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" placeholder="eg: sej@gmail.com" name="email"
                                                onChange={onUserFieldChange} onClick={() => setTouchStateOnClick(user.email)} value={user.email?.value} />
                                            <ShowErrorMessage field={user.email} />
                                        </div>
                                    </div>
                                    <br /><br /><br />
                                    <div className="form-group">
                                        <label className="col-sm-2 form-field-label-style"><span className='red'>*</span>Password</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" name="password" placeholder="eg: abc@123"
                                                onChange={onUserFieldChange} onClick={() => setTouchStateOnClick(user.password)} value={user.password?.value} />
                                            <ShowErrorMessage field={user.password} />
                                        </div>
                                    </div>
                                    <br /><br /><br />
                                    <div className="form-group">
                                        <div className="col-sm-2 form-field-label-style">Is Admin?</div>
                                        <div className="col-sm-10">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="isAdmin"
                                                    onClick={onUserFieldChange} value={user.isAdmin?.value} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group text-center">
                                    <button type="submit" className="btn add-form-button-style" disabled={disabled}
                                        onClick={(event) => onAddUpdateUserInFormClick(event)}>
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

export default User