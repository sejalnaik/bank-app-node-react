import { createSlice } from "@reduxjs/toolkit";

const markSlice = createSlice({
    name: "mark",
    initialState: 1000,
    reducers: {
        increaseMark(state) {
            state = state + 1
            return state
        },
        decreaseMark(state) {
            state = state - 1
            return state
        }
    }
})

export default markSlice