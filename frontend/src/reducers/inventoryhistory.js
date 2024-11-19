import {
    UPDATE_INVENTORY_HISTORY,
    ADD_INVENTORY_HISTORY,
} from '../actions/actionTypes'

export default function inventoryhistory(state = [], action) {
    // { posts : [] }

    switch (action.type) {
        case UPDATE_INVENTORY_HISTORY:
            return action.inventoryhistory

        case ADD_INVENTORY_HISTORY:
            return [action.inventoryhistory, ...state]

        default:
            return state
    }
}
