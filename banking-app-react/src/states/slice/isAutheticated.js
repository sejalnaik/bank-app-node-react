import { createSlice } from "@reduxjs/toolkit";

const isAutheticatedSlice = createSlice({
    name: "isAutheticated",
    initialState: false,
    reducers: {
        setIsAutheticated(state, action) {
            state = action.payload
            return state
        }
    }
})

export default isAutheticatedSlice