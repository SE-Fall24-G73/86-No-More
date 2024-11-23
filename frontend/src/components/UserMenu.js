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
    const [loading, setLoading] = useState(false)

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

    return (
        <div className="user-menu">
            <h1 className="title">Menu and Cart</h1>
            <div className="content">
                <div className="menu-section">
                    {loading && <h1>Loading...</h1>}
                    {menu?.map((menuItem) => (
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
