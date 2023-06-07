export const deposit = (amount) => {
    return (dispatch) => dispatch({
        type: "deposit",
        payload: amount
    })
}

export const withdraw = (amount) => {
    return (dispatch) => dispatch({
        type: "withdraw",
        payload: amount
    })
}

export const increment = () => {
    return (dispatch) => dispatch({
        type: "increment"
    })
}

export const decrement = () => {
    return (dispatch) => dispatch({
        type: "decrement"
    })
} 