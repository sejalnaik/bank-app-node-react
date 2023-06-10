import React from 'react'
import { getLocalStorage as getLocalStorageService, clearLocalStorage as clearLocalStorageService } from '../../service/Utility/LocalStorage'

const Navbar = ({ setIsLoggedIn, setIsAdmin, isLoggedIn }) => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Variable for isLoggedIn.
    let isAdmin = getLocalStorageService("isAdmin")

    // Variable for user name.
    let fullName = getLocalStorageService("firstName") + " " + getLocalStorageService("lastName")

    // ************************************ FUNCTIONS ********************************************

    // Logout
    const logout = () => {
        setIsAdmin(null)
        setIsLoggedIn(null)
        clearLocalStorageService()
    }

    if (isLoggedIn) {
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-light bg-light nav-bar-style">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link nav-bar-link-style" href="/dashboard">Home</a>
                            </li>
                            {isAdmin == "true" && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link nav-bar-link-style" href="/bank">Bank</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link nav-bar-link-style" href="/user">User</a>
                                    </li>
                                </>
                            )}
                            {isAdmin == "false" && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link nav-bar-link-style" href="/transaction">Transaction</a>
                                    </li>
                                </>
                            )}
                            <li className="nav-item">
                                <a className="nav-link nav-bar-link-style" href="/account">Account</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link nav-bar-link-style cursor-pointer" onClick={() => logout()}>Logout</a>
                            </li>
                        </ul>
                    </div>
                    <div className="menu-text-style">
                        Hi, {fullName}
                    </div>
                </nav>
            </>
        )
    }
    return <></>
}

export default Navbar