import axios from "axios";
import * as constants from "../../config/constant"
import { getLocalStorage as getLocalStorageService } from "../Utility/LocalStorage"

// Add account.
export const addAccount = async (account) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.post(`${constants.BASE_URL}/account`, account, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Get accounts.
export const getAccounts = async () => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.get(`${constants.BASE_URL}/account`, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Update account.
export const updateAccount = async (account) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.put(`${constants.BASE_URL}/account`, account, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Delete account.
export const deleteAccount = async (accountID) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.delete(`${constants.BASE_URL}/account/id/${accountID}`, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}