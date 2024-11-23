// UserCardMenu.js

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { deleteMenu, fetchMenus } from '../actions/job'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import '../styles/UserCardMenu.css'

const UserCardMenu = (props) => {
    const [quantity, setQuantity] = useState(0)

    const handleInputChange = (val) => {
        setQuantity(val)
        const totalPrice = val * props.menu.cost
        props.handleCartTotal(props.menu._id, totalPrice)
    }

    const deleteItem = (menuname) => {
        if (
            window.confirm(
                `Are you sure you want to delete ${menuname} from your menu?`
            )
        ) {
            props.dispatch(deleteMenu(menuname))
            props.dispatch(fetchMenus())
        }
    }

    const { menu } = props

    return (
        <div className="user-card-menu">
            <div className="card-header">
                <div className="header-info">
                    {/* <h4>Restaurant Name:</h4> */}
                    <span>{menu.restaurantName}</span>
                </div>
                <button
                    className="delete-button"
                    onClick={() => deleteItem(menu.itemName)}
                >
                    Delete <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <div className="card-body">
                <div className="card-row">
                    <h4>Dish:</h4>
                    <span>{menu.itemName}</span>
                </div>
                <div className="card-row">
                    <h4>Price:</h4>
                    <span>{menu.cost}</span>
                </div>
                <div className="card-row">
                    <h4>Available Quantity:</h4>
                    <span>{menu.quantity}</span>
                </div>
                <div className="card-row product-types">
                    <h4>Product Types:</h4>
                    <div className="types-container">
                        {menu.productType &&
                            menu.productType.map((type, index) => (
                                <span key={index} className="type-badge">
                                    {type}
                                </span>
                            ))}
                    </div>
                </div>
                <div className="card-row">
                    <h4>Select Quantity:</h4>
                    <select
                        className="quantity-select"
                        value={quantity}
                        onChange={(e) =>
                            handleInputChange(parseInt(e.target.value, 10))
                        }
                    >
                        {[...Array(11).keys()].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="card-row total-price">
                    <h4>Total Price:</h4>
                    <span>{quantity * menu.cost}</span>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps({ auth, job, application }) {
    return {
        auth,
        application,
    }
}

export default connect(mapStateToProps)(UserCardMenu)
