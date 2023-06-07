import React from 'react'
import { useDispatch } from 'react-redux'
import markSlice from './state2/slice/MarkSlice'

const Mark = () => {
    const dispatch = useDispatch()
    const increaseMarkHook = () => { dispatch(markSlice.actions.increaseMark()) }
    const decreaseMarkHook = () => { dispatch(markSlice.actions.decreaseMark()) }

    return (
        <>
            <hr />
            <div>Mark</div>
            <button onClick={() => {
                increaseMarkHook()
            }}>
                Add
            </button>
            <button onClick={() => {
                decreaseMarkHook()
            }}>
                Minus
            </button>
            <hr />
        </>
    )
}

export default Mark