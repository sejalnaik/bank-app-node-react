import axios from "axios";
import * as constants from "../../config/constant"
import { getLocalStorage as getLocalStorageService } from "../Utility/LocalStorage"

// Add transaction.
export const addTransaction = async (transaction) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.post(`${constants.BASE_URL}/transaction`, transaction, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Get transactions.
export const getTransactions = async (params) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.get(`${constants.BASE_URL}/transaction`, {
            headers: { "Content-type": "application/json", "authorization": authorization }, params: params
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}