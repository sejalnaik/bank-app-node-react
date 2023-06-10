import { login as loginService } from '../../service/User/User'
import { setLocalStorage as setLocalStorageService } from '../../service/Utility/LocalStorage'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { getLocalStorage as getLocalStorageService } from '../../service/Utility/LocalStorage'

const Login = ({ setIsLoggedIn, setIsAdmin }) => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Create user object and its setter.
    const [user, setUser] = useState({})

    // Create disabled boolean for add button in form and its setter.
    const [disabled, setDisabled] = useState(true)

    // Variable for add or update object for sending to api.
    let userForLogin = {}

    // Variable for navigation.
    const navigate = useNavigate()

    // Create variable for useref.
    const registerButton = useRef()

    // ************************************ USEEFFECT FUNCTIONS ********************************************

    // Validate user.
    useEffect(() => {

        // If form has fields then validate.
        if (user.email) {
            validateForm()
        }
    }, [user])

    // Initial functions.
    useEffect(() => {

        // If local storage has isLoggedIn then redirect it to dashboard.
        if (getLocalStorageService("isLoggedIn")) {
            navigate("/dashboard")
        }

        // Initialize the user object.
        initializeUser()

    }, [])

    // ************************************ CRUD FUNCTIONS FOR USER ********************************************

    // Login.
    const login = async () => {
        try {
            formatUserBeforeAdd()
            const response = await loginService(userForLogin)
            setLocalStorageService("authorization", response.headers.authorization)
            setLocalStorageService("userID", response.data.id)
            setLocalStorageService("isAdmin", response.data.isAdmin)
            setLocalStorageService("firstName", response.data.firstName)
            setLocalStorageService("lastName", response.data.lastName)
            setLocalStorageService("isLoggedIn", true)
            setIsLoggedIn(true)
            setIsAdmin(true)
            navigate('/dashboard')
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

        // Set the user by sending function.
        setUser(values => ({ ...values, [name]: { value: value, error: null, touched: true } }))
    }

    // Validate user form.
    const validateForm = () => {

        // Remove zero values.
        removeZeroValue(user)

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
    const onLoginClick = (event) => {
        event.preventDefault()
        login()
    }

    // On hover regsiter button.
    const onHoverRegisterButton = () => {
        if (!disabled) {
            return
        }
        registerButton.current.style.left = `${Math.ceil(Math.random() * 50)}%`
        registerButton.current.style.top = `${Math.ceil(Math.random() * 50)}%`
    }

    // Format the user object before sending it through API.
    const formatUserBeforeAdd = () => {
        for (let key in user) {
            userForLogin[key] = user[key].value
        }
    }

    // Initialize user fields.
    const initializeUser = () => {
        user.email = { value: null, error: null, touched: false }
        user.password = { value: null, error: null, touched: false }
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
                <form>
                    <div className="form-group input-style">
                        <label className="form-field-label-style">Email</label>
                        <div>
                            <input type="text" className="form-control" placeholder="eg: sej@gmail.com" name="email"
                                onChange={onUserFieldChange} onClick={() => setTouchStateOnClick(user.email)} value={user.email?.value} />
                            <ShowErrorMessage field={user.email} />
                        </div>
                    </div>
                    <br />
                    <div className="form-group input-style">
                        <label className="form-field-label-style">Password</label>
                        <div>
                            <input type="text" className="form-control" name="password" placeholder="eg: abc@123"
                                onChange={onUserFieldChange} onClick={() => setTouchStateOnClick(user.password)} value={user.password?.value} />
                            <ShowErrorMessage field={user.password} />
                        </div>
                    </div>
                    <br />
                    <div className="form-group text-center">
                        <button type="submit" ref={registerButton} className="btn add-form-button-style resgiter-button-style"
                            onClick={(event) => onLoginClick(event)} onMouseOver={() => onHoverRegisterButton()}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login