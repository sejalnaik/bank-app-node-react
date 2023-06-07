const reducer = (state = 100, action) => {
    if (action.type == "increment") {
        state = state + 1
        return state
    }

    if (action.type == "decrement") {
        state = state - 1
        return state
    }

    else {
        return state
    }
}

export default reducer