// UserMenu.js

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { clearsearchstate } from '../actions/search'
import toast from 'react-hot-toast'
import { APIURLS } from '../helpers/urls'
import axios from 'axios'
import '../styles/UserMenu.css'
import UserCardMenu from './UserCardMenu'

const UserMenu = (props) => {
    const [cartTotal, setCartTotal] = useState(0)
    const [setInput, setSetInput] = useState('0')
    const [cartChange, setCartChange] = useState('0')
    const [selectedItems, setSelectedItems] = useState({})
    const [menu, setMenu] = useState([])
    const [filteredMenu, setFilteredMenu] = useState([]) // State for filtered menu
    const [loading, setLoading] = useState(false)

    // State variables for filters
    const [dishFilter, setDishFilter] = useState('')
    const [productTypeFilter, setProductTypeFilter] = useState('')
    const [priceRange, setPriceRange] = useState([0, 100]) // Price range filter
    const [restaurantFilter, setRestaurantFilter] = useState('') // Restaurant name filter

    const handleCartTotal = (menuItemId, totalPrice) => {
        setSelectedItems((prevSelectedItems) => {
            const newSelectedItems = {
                ...prevSelectedItems,
                [menuItemId]: totalPrice,
            }

            // Recalculate cartTotal
            const newCartTotal = Object.values(newSelectedItems).reduce(
                (acc, price) => acc + price,
                0
            )
            setCartTotal(newCartTotal)

            return newSelectedItems
        })
    }

    const fetchAllMenu = async () => {
        try {
            setLoading(true)
            const data = await axios.get(APIURLS.fetchAllMenus())
            setMenu(data.data.data.menu)
            setFilteredMenu(data.data.data.menu) // Initialize filteredMenu
        } catch (error) {
            console.log('error', error)
            toast.error('Failed to fetch menu')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllMenu()
    }, [])

    // Function to handle filtering
    const handleFilter = () => {
        let updatedMenu = menu

        if (dishFilter) {
            updatedMenu = updatedMenu.filter((item) =>
                item.itemName.toLowerCase().includes(dishFilter.toLowerCase())
            )
        }

        if (productTypeFilter) {
            updatedMenu = updatedMenu.filter((item) =>
                item.productType.includes(productTypeFilter)
            )
        }

        if (restaurantFilter) {
            updatedMenu = updatedMenu.filter((item) =>
                item.restaurantName
                    .toLowerCase()
                    .includes(restaurantFilter.toLowerCase())
            )
        }

        if (priceRange) {
            updatedMenu = updatedMenu.filter(
                (item) =>
                    item.cost >= priceRange[0] && item.cost <= priceRange[1]
            )
        }

        setFilteredMenu(updatedMenu)
    }

    // Handle changes in filters
    useEffect(() => {
        handleFilter()
    }, [dishFilter, productTypeFilter, priceRange, restaurantFilter, menu])

    return (
        <div className="user-menu">
            <h1 className="title">Menu and Cart</h1>
            <div className="filter-section">
                <input
                    type="text"
                    placeholder="Search by Dish"
                    value={dishFilter}
                    onChange={(e) => setDishFilter(e.target.value)}
                    className="filter-input"
                />
                <input
                    type="text"
                    placeholder="Search by Restaurant"
                    value={restaurantFilter}
                    onChange={(e) => setRestaurantFilter(e.target.value)}
                    className="filter-input"
                />
                <select
                    value={productTypeFilter}
                    onChange={(e) => setProductTypeFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Product Types</option>
                    {/* Generate options dynamically based on available product types */}
                    {Array.from(
                        new Set(menu.flatMap((item) => item.productType))
                    ).map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <div className="price-range-filter">
                    <span>Price Range:</span>
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) =>
                            setPriceRange([
                                Number(e.target.value),
                                priceRange[1],
                            ])
                        }
                        className="price-input"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) =>
                            setPriceRange([
                                priceRange[0],
                                Number(e.target.value),
                            ])
                        }
                        className="price-input"
                    />
                </div>
            </div>
            <div className="content">
                <div className="menu-section">
                    {loading && <h1>Loading...</h1>}
                    {filteredMenu?.map((menuItem) => (
                        <UserCardMenu
                            key={menuItem._id}
                            menu={menuItem}
                            handleCartTotal={handleCartTotal}
                        />
                    ))}
                </div>
                <div className="cart-section">
                    <h1 className="cart-total">Total: {cartTotal}</h1>
                    <button
                        className="pay-button"
                        onClick={() => setSetInput('1')}
                    >
                        Pay
                    </button>
                    {setInput === '1' && (
                        <div className="payment-input">
                            <input
                                type="number"
                                placeholder="Amount"
                                onChange={(e) => setCartChange(e.target.value)}
                            />
                            <h3>Get change: {cartChange - cartTotal}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserMenu
