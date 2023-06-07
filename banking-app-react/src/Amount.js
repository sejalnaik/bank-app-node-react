import React from 'react'
import { useDispatch } from 'react-redux'
import { actionCreator } from './state'

const Amount = () => {
    const dispatch = useDispatch()

    return (
        <>
            <hr />
            <div>Amount</div>
            <button onClick={() => {
                dispatch(actionCreator.deposit(50))
            }}>
                Deposit
            </button>
            <button onClick={() => {
                dispatch(actionCreator.withdraw(50))
            }}>
                Withdraw
            </button>
            <hr />
        </>
    )
}

export default Amount