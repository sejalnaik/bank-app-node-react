import React from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreator } from './state'

const Count = () => {
    const dispatch = useDispatch()
    const { increment, decrement } = bindActionCreators(actionCreator, dispatch)

    return (
        <>
            <hr />
            <div>Count</div>
            <button onClick={() => { increment() }}>
                Increment
            </button>
            <button onClick={() => { decrement() }}>
                Decrement
            </button>
            <hr />
        </>
    )
}

export default Count