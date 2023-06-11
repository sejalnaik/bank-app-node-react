import axios from "axios";
import * as constants from "../../config/constant"
import { getLocalStorage as getLocalStorageService } from "../Utility/LocalStorage"

// Add user.
export const addUser = async (user) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.post(`${constants.BASE_URL}/user`, user, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Get users.
export const getUsers = async (params) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.get(`${constants.BASE_URL}/user`, {
            headers: { "Content-type": "application/json", "authorization": authorization }, params: params
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Update user.
export const updateUser = async (user) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.put(`${constants.BASE_URL}/user`, user, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Delete user.
export const deleteUser = async (userID) => {
    try {
        const authorization = getLocalStorageService("authorization")
        const response = await axios.delete(`${constants.BASE_URL}/user/id/${userID}`, {
            headers: { "Content-type": "application/json", "authorization": authorization }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}

// Login.
export const login = async (user) => {
    try {
        const response = await axios.post(`${constants.BASE_URL}/user/login`, user, {
            headers: { "Content-type": "application/json" }
        })
        return response
    } catch (error) {
        throw error
    }
}

// Logout.
export const logout = async () => {
    try {
        const response = await axios.get(`${constants.BASE_URL}/user/logout`, {
            headers: { "Content-type": "application/json" }
        })
        return response
    } catch (error) {
        throw new axios.AxiosError(error)
    }
}