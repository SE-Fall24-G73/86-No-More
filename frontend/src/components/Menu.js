// Menu.js

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { searchUsers, clearsearchstate } from '../actions/search'
import { clearAuthState, editItem } from '../actions/auth'
import { createJob, fetchJobs, createMenu } from '../actions/job'

const Menu = () => {
    const [restname, setRestname] = useState('')
    const [restid, setRestid] = useState('')
    const [menuname, setMenuname] = useState('')
    const [quantity, setQuantity] = useState('0')
    const [costmenu, setCostmenu] = useState('')
    const [selectedProductTypes, setSelectedProductTypes] = useState([])
    const [editMode, setEditMode] = useState(false)

    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)
    const menu = useSelector((state) => state.menu)
    const job = useSelector((state) => state.job)
    const results = useSelector((state) => state.search.results)

    useEffect(() => {
        dispatch(fetchJobs())
        // Cleanup function equivalent to componentWillUnmount
        return () => {
            dispatch(clearsearchstate([]))
            console.log('UNMOUNT')
        }
    }, [dispatch])

    const handleSearch = (e) => {
        const searchText = e.target.value
        console.log(searchText)
        dispatch(searchUsers(searchText))
    }

    const handleSave1 = () => {
        const { user } = auth
        console.log(menuname)
        dispatch(editItem(menuname, quantity))
    }

    const handleInputChange = (fieldName, val) => {
        switch (fieldName) {
            case 'menuname':
                setMenuname(val)
                break
            case 'quantity':
                setQuantity(val)
                break
            case 'costmenu':
                setCostmenu(val)
                break
            default:
                break
        }
    }

    const handleProductTypeChange = (selectedOptions) => {
        setSelectedProductTypes(selectedOptions.map((option) => option.value))
        console.log(selectedProductTypes)
    }

    const handleSave = () => {
        const { user } = auth
        setRestname(user.restname)
        setRestid(user._id)

        dispatch(
            createMenu(
                user.restname,
                user._id,
                menuname,
                quantity,
                costmenu,
                selectedProductTypes
            )
        )
        alert(`${menuname} added!`)
    }

    const { error } = auth

    return (
        <div>
            <div
                className="goal-form"
                style={{
                    width: '650px',
                    height: '300px',
                    marginLeft: '100px',
                }}
            >
                <span className="login-signup-header">Add Menu Item</span>
                {error && <div className="alert error-dailog">{error}</div>}

                <div className="field">
                    <input
                        placeholder="Item Name"
                        type="text"
                        required
                        onChange={(e) =>
                            handleInputChange('menuname', e.target.value)
                        }
                    />
                </div>

                <div className="field">
                    <input
                        id="quan"
                        placeholder="Quantity"
                        type="text"
                        required
                        onChange={(e) =>
                            handleInputChange('quantity', e.target.value)
                        }
                    />
                </div>

                <div className="field">
                    <input
                        id="cost"
                        placeholder="Price"
                        type="text"
                        required
                        onChange={(e) =>
                            handleInputChange('costmenu', e.target.value)
                        }
                    />
                </div>

                <div className="field">
                    <label>Select Product Types:</label>
                    <Select
                        isMulti
                        options={[
                            { value: 'Beef', label: 'Beef' },
                            { value: 'Pork', label: 'Pork' },
                            { value: 'Chicken', label: 'Chicken' },
                            { value: 'Milk', label: 'Milk' },
                            { value: 'Egg', label: 'Egg' },
                            { value: 'Vegan', label: 'Vegan' },
                            { value: 'Vegetarian', label: 'Vegetarian' },
                            { value: 'Glutten-Free', label: 'Glutten-Free' },
                            { value: 'Fish', label: 'Fish' },
                            { value: 'Others', label: 'Others' },
                        ]}
                        onChange={handleProductTypeChange}
                    />
                </div>

                <div className="field">
                    <button className="button save-btn" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Menu
