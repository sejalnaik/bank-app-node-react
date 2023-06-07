import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react'

const Redirect = () => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Variable for navigation.
    const navigate = useNavigate()

    // ************************************ USEEFFECT FUNCTIONS ********************************************

    // Initial operations.
    useEffect(() => {

        // Navigate to login.
        navigate("/login")

    }, [])

    return (
        <></>
    )
}

export default Redirect