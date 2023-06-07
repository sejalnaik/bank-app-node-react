
// Set the local storage item.
export const setLocalStorage = (key, item) => {
    localStorage.setItem(key, item)
}

// Get the local storage item.
export const getLocalStorage = (key) => {
   return localStorage.getItem(key)
}
