import { configureStore } from "@reduxjs/toolkit";
import isAutheticatedSlice from "./slice/isAutheticated";

const store = configureStore({
    reducer: {
        isAutheticated: isAutheticatedSlice.reducer,
    }
})

export default store
