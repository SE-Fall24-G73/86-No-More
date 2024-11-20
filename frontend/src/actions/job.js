import toast from 'react-hot-toast'
import { APIURLS } from '../helpers/urls'
import { getFormBody } from '../helpers/utils'
import {
    ADD_JOB,
    UPDATE_JOB,
    ADD_MENU,
    UPDATE_MENU,
    DELETE_MENU,
    ADD_INVENTORY_HISTORY,
    UPDATE_INVENTORY_HISTORY,
    DELETE_INVENTORY_ITEM,
    FETCH_REDUCTION,
} from './actionTypes'

export function createJob(
    restname,
    restid,
    itemname,
    quantity,
    costperitem,
    datebought,
    dateexpired,
    metric
) {
    return (dispatch) => {
        const url = APIURLS.createJob()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: getFormBody({
                restname,
                id: restid,
                itemname,
                quantity,
                costperitem,
                datebought,
                dateexpired,
                metric,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log('data', data);
                if (data.success) {
                    // do something
                    localStorage.setItem('token', data.data.token)
                    dispatch(jobSuccess(data.data.job))
                    return
                }
                // dispatch(signupFailed(data.message));
            })
    }
}

export function deleteInventoryItem(id) {
    console.log('inside delete frontend ' + id)
    return (dispatch) => {
        const url = APIURLS.deleteInventoryItem()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: getFormBody({
                id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('data', data)
                if (data.success) {
                    // do something
                    localStorage.setItem('token', data.data.token)
                    dispatch(deleteInventoryItemSuccess(data.data.job))
                    return
                }
                // dispatch(signupFailed(data.message));
            })
    }
}

export function createMenu(
    restaurantName,
    restaurantId,
    itemName,
    quantity,
    cost,
    selectedProductTypes
) {
    return (dispatch) => {
        const url = APIURLS.createMenu()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: getFormBody({
                restaurantName: restaurantName,
                restaurantId: restaurantId,
                itemName: itemName,
                quantity: quantity,
                cost: cost,
                productType: selectedProductTypes,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log('data', data);
                if (data.success) {
                    // do something
                    toast.success(data.message)
                    localStorage.setItem('token', data.data.token)
                    dispatch(menuSuccess(data.data.menu))
                    return
                }
                // dispatch(signupFailed(data.message));
            })
    }
}

export function deleteMenu(id) {
    console.log('inside delete frontend ' + id)
    return (dispatch) => {
        const url = APIURLS.deleteMenu()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: getFormBody({
                id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('data', data)
                if (data.success) {
                    // do something
                    localStorage.setItem('token', data.data.token)
                    dispatch(deleteMenuSuccess(data.data.menu))
                    return
                }
                // dispatch(signupFailed(data.message));
            })
    }
}

export function createInventoryHistory(itemname, quantity, metric) {
    return (dispatch) => {
        const url = APIURLS.createInventoryHistory()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: getFormBody({
                itemname,
                quantity,
                metric,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('data', data)
                if (data.success) {
                    // do something
                    localStorage.setItem('token', data.data.token)
                    dispatch(
                        inventoryHistorySuccess(data.data.inventoryhistory)
                    )
                    return
                }
                // dispatch(signupFailed(data.message));
            })
    }
}

export function jobSuccess(job) {
    return {
        type: ADD_JOB,
        job,
    }
}

export function menuSuccess(menu) {
    return {
        type: ADD_MENU,
        menu,
    }
}

export function inventoryHistorySuccess(inventoryhistory) {
    return {
        type: ADD_INVENTORY_HISTORY,
        inventoryhistory,
    }
}

export function fetchJobs() {
    return (dispatch) => {
        const url = APIURLS.fetchJobs()

        fetch(url)
            .then((response) => {
                console.log('Response', response)
                return response.json()
            })
            .then((data) => {
                console.log('dsssdsds', data)
                dispatch(updateJobs(data.jobs))
            })
    }
}

export function fetchReductionEstimate() {
    return (dispatch) => {
        const url = APIURLS.fetchReductionEstimate()

        fetch(url)
            .then((response) => {
                console.log('Response', response)
                return response.json
            })
            .then((data) => {
                console.log('HERE2', data)
                dispatch(updateReductionEstimate(data.reductions))
            })
    }
}

export function fetchMenus() {
    return (dispatch) => {
        const url = APIURLS.fetchMenus()

        fetch(url)
            .then((response) => {
                console.log('Response', response)
                return response.json()
            })
            .then((data) => {
                console.log('menusssssss', data)
                dispatch(updateMenu(data.menu))
            })
    }
}

export function fetchInventoryHistory() {
    return (dispatch) => {
        const url = APIURLS.fetchInventoryHistory()

        fetch(url)
            .then((response) => {
                console.log('Response', response)
                return response.json()
            })
            .then((data) => {
                dispatch(updateInventoryHistory(data.inventoryhistory))
            })
    }
}

export function updateJobs(jobs) {
    return {
        type: UPDATE_JOB,
        jobs,
    }
}

export function updateReductionEstimate(reductions) {
    return {
        type: FETCH_REDUCTION,
        reductions,
    }
}

export function updateMenu(menu) {
    return {
        type: UPDATE_MENU,
        menu,
    }
}

export function deleteMenuSuccess(menu) {
    return {
        type: DELETE_MENU,
        menu,
    }
}

export function deleteInventoryItemSuccess(job) {
    return {
        type: DELETE_INVENTORY_ITEM,
        job,
    }
}

export function updateInventoryHistory(inventoryhistory) {
    return {
        type: UPDATE_INVENTORY_HISTORY,
        inventoryhistory,
    }
}
