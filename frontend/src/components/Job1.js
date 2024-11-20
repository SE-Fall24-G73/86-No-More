// Job1.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { deleteMenu, fetchMenus } from '../actions/job'

class Job1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Total: '0',
        }
    }

    handleInputChange = (fieldName, val) => {
        this.setState(
            {
                [fieldName]: val,
            },
            () => {
                if (fieldName === 'Total') {
                    const quantity = parseInt(this.state.Total, 10)
                    const totalPrice = quantity * this.props.menu.cost
                    this.props.handleCartTotal(this.props.menu._id, totalPrice)
                }
            }
        )
    }

    deleteItem = (menuname) => {
        this.props.dispatch(deleteMenu(menuname))
        alert(
            'Are you sure you want to delete ' + menuname + ' from your menu?'
        )
        this.props.dispatch(fetchMenus())
    }

    render() {
        const { menu } = this.props
        return (
            <div
                className="post"
                key={menu._id}
                style={{ width: '50vw', marginLeft: '50px' }}
            >
                <div className="post-header">
                    <div>
                        <h4 style={{ display: 'inline-block' }}>
                            Restaurant Name:
                        </h4>
                        <span style={{ marginLeft: '10px' }}>
                            {menu.restaurantName}
                        </span>
                        <button
                            style={{ marginLeft: '300px' }}
                            className="button delete-btn"
                            onClick={() => this.deleteItem(menu.itemName)}
                        >
                            Delete &nbsp;
                            <FontAwesomeIcon
                                icon={faTrash}
                                style={{ color: '#f9fafa' }}
                            />
                        </button>
                    </div>

                    <div>
                        <h4
                            style={{
                                display: 'inline-block',
                                marginTop: '-12px',
                            }}
                        >
                            Dish:
                        </h4>
                        <span style={{ marginLeft: '10px' }}>
                            {menu.itemName}
                        </span>
                        <select
                            style={{
                                marginLeft: '455px',
                                width: '56px',
                                height: '37px',
                                padding: '5px',
                                border: '2px solid #0000ee',
                                borderRadius: '6px',
                                fontSize: '15px',
                            }}
                            onChange={(e) =>
                                this.handleInputChange('Total', e.target.value)
                            }
                        >
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>
                    </div>

                    <div>
                        <h4
                            style={{
                                display: 'inline-block',
                                marginTop: '-12px',
                            }}
                        >
                            Price:
                        </h4>
                        <span style={{ marginLeft: '10px' }}>{menu.cost}</span>
                    </div>

                    <div>
                        <h4
                            style={{
                                display: 'inline-block',
                                marginTop: '-12px',
                            }}
                        >
                            Quantity:
                        </h4>
                        <span style={{ marginLeft: '10px' }}>
                            {menu.quantity}
                        </span>
                    </div>

                    <div>
                        <h4
                            style={{
                                display: 'inline-block',
                                marginTop: '-12px',
                            }}
                        >
                            Product Types:
                        </h4>
                        <div
                            style={{
                                marginLeft: '10px',
                                display: 'flex',
                                flexWrap: 'wrap',
                            }}
                        >
                            {menu.productType &&
                                menu.productType.map((type, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            marginRight: '8px',
                                            marginBottom: '8px',
                                            padding: '6px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: '#f9f9f9',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {type}
                                    </span>
                                ))}
                        </div>
                    </div>
                    <div>Total Price: {this.state.Total * menu.cost}</div>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ auth, job, application }) {
    return {
        auth,
        application,
    }
}

export default connect(mapStateToProps)(Job1)
