import { createSlice } from "@reduxjs/toolkit";

const moneySlice = createSlice({
    name: "money",
    initialState: 1000,
    reducers: {
        increaseMoney(state, action) {
            state = state + action.payload
            return state
        },
        decreaseMoney(state, action) {
            state = state - action.payload
            return state
        }
    }
})

export default moneySlice