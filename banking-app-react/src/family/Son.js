import React, { useContext, useEffect } from 'react'
// import { UserNameContext } from './GrandFather'
import UserNameContext from './UserNameContext'
import FirstNameContext from './FirstNameContext'
const Son = ({ setParentToChild }) => {
    const user = useContext(UserNameContext)
    const fisrt = useContext(FirstNameContext)
    const setUserName = user.setUserName
    const userName = user.userName
    const firstName = fisrt.firstName
    const setFirstName = fisrt.setFirstName
    const haha = () => {
        alert("owfjemflemgjorg")
    }
    useEffect(() => {
        setParentToChild(haha)
    })

    return (
        <>
            <h1>
                Son
            </h1>
            <h2>
                {user.userName}
            </h2>
            <label>UserName</label>
            <input type="text" className="form-control"
                value={userName} onChange={(event) => setUserName(event.target.value)} />
            <h2>
                {firstName}
            </h2>
            <label>FirstName</label>
            <input type="text" className="form-control"
                value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        </>
    )
}

export default Son