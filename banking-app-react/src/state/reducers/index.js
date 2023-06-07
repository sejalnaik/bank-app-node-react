import { combineReducers } from "redux";
import AmountReducer from "./AmountReducer";
import CountReducer from "./CountReducer";

const reducers = combineReducers({
    amount: AmountReducer,
    count: CountReducer
})

export default reducers