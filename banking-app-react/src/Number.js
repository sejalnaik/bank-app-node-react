import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Number = () => {

    const [users, setUsers] = useState([])

    const getUsers = async () => {
        let response = await axios.get("https://jsonplaceholder.typicode.com/posts")
        console.log(response.data)
        if (response.data) {
            setUsers(response.data)
            console.log(users)
        }
    }

    const rowOfUser = Object.values(users).map(user => {
        return (
            <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td>{user.userId}</td>
                <td>{user.title}</td>
                <td>{user.body}</td>
            </tr>
        )
    })

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Uody</th>
                    </tr>
                </thead>
                <tbody>
                   {rowOfUser}
                     
                </tbody>
            </table>
        </>
    )
}

export default Number