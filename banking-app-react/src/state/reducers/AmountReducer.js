const reducer = (state = 0, action) => {
    if (action.type == "deposit") {
        state = state + action.payload
        return state
    }

    if (action.type == "withdraw") {
        state = state - action.payload
        return state
    }

    else {
        return state
    }
}

export default reducer