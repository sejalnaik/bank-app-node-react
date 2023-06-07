import { configureStore } from "@reduxjs/toolkit";
import markSlice from "./slice/MarkSlice";
import moneySlice from "./slice/MoneySlice";

const store = configureStore({
    reducer: {
        mark: markSlice.reducer,
        money: moneySlice.reducer
    }
})

export default store
