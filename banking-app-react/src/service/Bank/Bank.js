import axios from "axios";
import * as constants from "../../config/constant"
import { getLocalStorage as getLocalStorageService } from "../Utility/LocalStorage"

// Add bank.
export const addBank = async (bank) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.post(`${constants.BASE_URL}/bank`, bank, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Get banks.
export const getBanks = async (params) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.get(`${constants.BASE_URL}/bank`, {
            headers: { "Content-type": "application/json", "authorization": authorization }, params: params
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Update bank.
export const updateBank = async (bank) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.put(`${constants.BASE_URL}/bank`, bank, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Delete bank.
export const deleteBank = async (bankID) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.delete(`${constants.BASE_URL}/bank/id/${bankID}`, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}