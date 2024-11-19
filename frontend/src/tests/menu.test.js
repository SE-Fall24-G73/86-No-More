import menus from './menu' // Adjust the import path as needed

// Mock the action types and actions
const UPDATE_MENU = 'UPDATE_MENU'
const EDIT_ITEM_SUCCESSFULL = 'EDIT_ITEM_SUCCESSFULL'
const ADD_MENU = 'ADD_MENU'

const initialState = []

describe('menus reducer', () => {
    it('should return the initial state', () => {
        expect(menus(undefined, {})).toEqual(initialState)
    })

    it('should handle UPDATE_MENU', () => {
        const action = {
            type: UPDATE_MENU,
            menu: ['menu item 1', 'menu item 2'],
        }
        expect(menus(initialState, action)).toEqual(action.menu)
    })

    it('should handle EDIT_ITEM_SUCCESSFULL', () => {
        const action = {
            type: EDIT_ITEM_SUCCESSFULL,
            inventories: ['inventory item 1', 'inventory item 2'],
        }
        expect(menus(initialState, action)).toEqual(action.inventories)
    })

    it('should handle ADD_MENU', () => {
        const action = {
            type: ADD_MENU,
            menu: 'new menu item',
        }
        const expectedState = ['new menu item', ...initialState]
        expect(menus(initialState, action)).toEqual(expectedState)
    })
})
