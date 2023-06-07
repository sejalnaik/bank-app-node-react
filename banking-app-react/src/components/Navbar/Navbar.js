import React from 'react'
import { getLocalStorage as getLocalStorageService } from '../../service/Utility/LocalStorage'

const Navbar = ({ isShow }) => {

    // ************************************ VARIABLE DEFINITIONS ********************************************

    // Variable for isLoggedIn.
    let isAdmin = getLocalStorageService("isAdmin")

    if (isShow) {
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
                            <li className="nav-item">
                                <a className="nav-link nav-bar-link-style" href="/account">Account</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </>
        )
    }
    return <></>
}

export default Navbar