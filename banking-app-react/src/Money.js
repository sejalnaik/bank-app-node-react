import React from 'react'
import { useDispatch } from 'react-redux'
import moneySlice from './state2/slice/MoneySlice'

const Money = () => {
    const dispatch = useDispatch()
    const increaseMoneyHook = (money) => { dispatch(moneySlice.actions.increaseMoney(money)) }
    const decreaseMoneyHook = (money) => { dispatch(moneySlice.actions.decreaseMoney(money)) }

    return (
        <>
            <hr />
            <div>Money</div>
            <button onClick={() => {
                increaseMoneyHook(50)
            }}>
                Add
            </button>
            <button onClick={() => {
                decreaseMoneyHook(50)
            }}>
                Minus
            </button>
            <hr />
        </>
    )
}

export default Money