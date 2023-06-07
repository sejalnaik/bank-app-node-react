import React from 'react'
import { useSelector } from 'react-redux'

const Navbar2 = () => {
    const mark = useSelector((state) => state.mark)
    const money = useSelector((state) => state.money)

    return (
        <>
            <hr />
            <div>Navbar</div>
            <div>
                Mark :
                {mark}
            </div>
            <div>
                Money :
                {money}
            </div>
            <hr />
        </>
    )
}

export default Navbar2