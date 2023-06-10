import React from 'react'
import { getLocalStorage as getLocalStorageService } from '../../service/Utility/LocalStorage'

const Dashboard = () => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Variable for user name.
    let fullName = getLocalStorageService("firstName") + " " + getLocalStorageService("lastName")

    return (
        <>
            <div className="container-fluid mt-n5 background-style standard-page-margin">
                <div className='dashboard-welcome-style'>
                    Welcome, {fullName}
                </div>
            </div>
        </>
    )
}

export default Dashboard