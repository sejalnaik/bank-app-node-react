import React from 'react'
import { useSelector } from 'react-redux'

const Navbar = () => {
    const amount = useSelector((state) => state.amount)
    const count = useSelector((state) => state.count)
    return (
        <>
            <hr />
            <div>Navbar</div>
            <div>
                Amount :
                {amount}
            </div>
            <div>
                Count :
                {count}
            </div>
            <hr />
        </>
    )
}

export default Navbar