// Cart.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Job1 from './Job1'
import { fetchJobs } from '../actions/job'
import { clearsearchstate } from '../actions/search'

class Cart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            restaurantName: '',
            restaurantId: '',
            itemName: '',
            quantity: '0',
            cost: '',
            cartTotal: 0,
            setInput: '0',
            cartChange: '0',
            editMode: false,
            selectedItems: {}, // New state property to track selected items
        }
    }

    handleInputChange = (fieldName, val) => {
        this.setState({
            [fieldName]: val,
        })
    }

    handleCartTotal = (menuItemId, totalPrice) => {
        this.setState(
            (prevState) => ({
                selectedItems: {
                    ...prevState.selectedItems,
                    [menuItemId]: totalPrice,
                },
            }),
            () => {
                // After updating selectedItems, recalculate cartTotal
                const cartTotal = Object.values(
                    this.state.selectedItems
                ).reduce((acc, price) => acc + price, 0)
                this.setState({ cartTotal })
            }
        )
    }

    componentDidMount() {
        this.props.dispatch(fetchJobs())
    }

    clearSearch = () => {
        this.props.dispatch(clearsearchstate([]))
        console.log('UNMOUNT')
    }

    render() {
        const { menu } = this.props
        return (
            <div style={{ marginLeft: '100px' , display: 'block', alignItems:'center', justifyContent:'center' }}>
                <h1>Menu and Cart</h1>
                <br />
                <div>
                    {menu?.map((menuItem) => (
                        <Job1
                            key={menuItem._id}
                            menu={menuItem}
                            handleCartTotal={this.handleCartTotal}
                        />
                    ))}
                </div>
                <div>
                    <h1 >
                        {' '}
                        Total: {this.state.cartTotal}
                    </h1>
                    <div>
                        <button
                            style={{ width:'50%' }}
                            className="button delete-btn"
                            onClick={() => {
                                this.handleInputChange('setInput', '1')
                            }}
                        >
                            Pay
                        </button>
                        <div style={{ marginTop: '20px', marginLeft: '100px' }}>
                            {this.state.setInput === '1' ? (
                                <div>
                                    <input
                                        placeholder="Amount"
                                        style={{
                                            border: '1px solid rgba(0, 0, 0, 0.12)',
                                            height: '40px',
                                            marginTop: '20px',
                                            padding: '5px',
                                            borderRadius: '6px',
                                            fontSize: '15px',
                                        }}
                                        onChange={(e) => {
                                            this.handleInputChange(
                                                'cartChange',
                                                e.target.value
                                            )
                                        }}
                                    />
                                    <h3>
                                        Get change:{' '}
                                        {this.state.cartChange -
                                            this.state.cartTotal}
                                    </h3>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        results: state.search.results,
        job: state.job,
        menu: state.menu,
    }
}

export default connect(mapStateToProps)(Cart)

