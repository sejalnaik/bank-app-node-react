import React, { createContext, useContext, useState } from 'react'
import Father from './Father'
import Son from './Son'
import UserNameContext from './UserNameContext'
import FirstNameContext from './FirstNameContext'
// export const UserNameContext = createContext()
const GrandFather = () => {
    const [userName, setUserName] = useState()
    const [firstName, setFirstName] = useState()
    const [parentToChild, setParentToChild] = useState()
    const updateUserName = (userName) => {
        setUserName(userName)
    }
    const user = {
        userName: userName,
        setUserName: setUserName
    }
    const first = {
        firstName: firstName,
        setFirstName: setFirstName
    }
    return (
        <>
            <FirstNameContext.Provider value={first}>
                <UserNameContext.Provider value={user}>
                    <h1>
                        Grand Father
                    </h1>
                    <h2>
                        {userName}
                    </h2>
                    <label>UserName</label>
                    <input type="text" className="form-control"
                        value={userName} onChange={(event) => setUserName(event.target.value)} />
                    <h2>
                        {userName}
                    </h2>
                    <label>FirstName</label>
                    <input type="text" className="form-control"
                        value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                        <button onClick={parentToChild}>lala</button>
                    {/* <Son setParentToChild={setParentToChild}></Son> */}
                    <Father></Father>
                </UserNameContext.Provider>
            </FirstNameContext.Provider>
        </>
    )
}

export default GrandFather