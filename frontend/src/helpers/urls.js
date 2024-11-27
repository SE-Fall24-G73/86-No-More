export const API_ROOT = 'http://localhost:8000/api/v1'

export const APIURLS = {
    login: () => `${API_ROOT}/users/create-session`,
    signup: () => `${API_ROOT}/users/signup`,
    fetchJobs: () => `${API_ROOT}/users/`,
    editProfile: () => `${API_ROOT}/users/edit`,
    editItem: () => `${API_ROOT}/users/edititem`,

    createJob: () => `${API_ROOT}/users/createjob`,
    createMenu: () => `${API_ROOT}/users/createmenu`,

    fetchMenus: () => `${API_ROOT}/users/fetchmenus`,
    fetchAllMenus: () => `${API_ROOT}/users/fetchallmenus`,
    submitRating: () => `${API_ROOT}/users/submitrating`,

    forgotPassword: () => `${API_ROOT}/users/forgotpassword`,
    resetPassword: () => `${API_ROOT}/users/resetPassword`,

    createInventoryHistory: () => `${API_ROOT}/users/createinventoryHistory`,

    fetchInventoryHistory: () => `${API_ROOT}/users/fetchinventoryHistory`,

    deleteMenu: () => `${API_ROOT}/users/deleteMenu`,
    deleteInventoryItem: () => `${API_ROOT}/users/deleteInventoryItem`,

    fetchReductionEstimate: () => `${API_ROOT}/users/fetchReductionEstimate`,
}
