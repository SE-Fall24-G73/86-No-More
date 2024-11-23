// Goal.js

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { searchUsers } from '../actions/search'
import { editItem } from '../actions/auth'
import { clearsearchstate } from '../actions/search'

import 'react-datepicker/dist/react-datepicker.css'

import {
    createJob,
    createInventoryHistory,
    fetchReductionEstimate,
} from '../actions/job'
import { fetchJobs } from '../actions/job'

import { APIURLS } from '../helpers/urls'
import toast from 'react-hot-toast'

class Goal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            restaurantName: '',
            restaurantId: '',
            itemName: '',
            quantity: 0,
            costperitem: '',
            datebought: '',
            dateexpired: '',
            editMode: false,
            metric: 'Items',
            reductionData: '',
            // Additional state variables for reduction estimates
            itemAmount: 0,
            itemTotal: 0,
            tonsAmount: 0,
            tonsTotal: 0,
            gallonsAmount: 0,
            gallonsTotal: 0,
            kilogramsAmount: 0,
            kilogramsTotal: 0,
        }
    }

    handleSave1 = () => {
        const { itemName, quantity, metric } = this.state

        // Dispatch action with only available parameters
        this.props.dispatch(createInventoryHistory(itemName, quantity, metric))

        this.setState({
            itemName: '',
            quantity: 0,
            metric: 'Items',
        })

        alert('Updated the quantity of ' + itemName)

        // It's better to control input values via state
    }

    getReduction = () => {
        this.props.dispatch(fetchReductionEstimate())
    }

    clearSearch = () => {
        this.props.dispatch(clearsearchstate([]))
        console.log('UNMOUNT')
    }

    handleInputChange = (fieldName, val) => {
        this.setState({
            [fieldName]: val,
        })
    }

    handleSave = () => {
        const {
            itemName,
            quantity,
            costperitem,
            datebought,
            dateexpired,
            metric,
        } = this.state

        const { user } = this.props.auth

        // Set restaurant information
        this.setState({
            restaurantName: user.restaurantName,
            restaurantId: user._id,
        })

        // Dispatch createJob action
        this.props.dispatch(
            createJob(
                user.restaurantName,
                user._id,
                itemName,
                quantity,
                costperitem,
                datebought,
                dateexpired,
                metric
            )
        )

        // Dispatch createInventoryHistory with all required parameters
        this.props.dispatch(
            createInventoryHistory(
                itemName,
                quantity,
                metric,
                costperitem,
                datebought,
                dateexpired,
                user.restaurantName,
                user._id
            )
        )

        // Reset state variables
        this.setState({
            itemName: '',
            quantity: 0,
            costperitem: '',
            datebought: '',
            dateexpired: '',
            metric: 'Items',
        })

        // Display a success message
        toast.success(itemName + ' added to the inventory!')
    }

    resetEstimate = async () => {
        try {
            const response = await fetch(APIURLS.fetchReductionEstimate())
            const data = await response.json()

            this.setState({
                itemAmount: data.reduction[0].amount,
                itemTotal: data.reduction[0].total,
                tonsAmount: data.reduction[1].amount,
                tonsTotal: data.reduction[1].total,
                gallonsAmount: data.reduction[2].amount,
                gallonsTotal: data.reduction[2].total,
                kilogramsAmount: data.reduction[3].amount,
                kilogramsTotal: data.reduction[3].total,
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    async componentDidMount() {
        this.props.dispatch(fetchJobs())

        try {
            const response = await fetch(APIURLS.fetchReductionEstimate())
            const data = await response.json()

            this.setState({
                itemAmount: data.reduction[0].amount,
                itemTotal: data.reduction[0].total,
                tonsAmount: data.reduction[1].amount,
                tonsTotal: data.reduction[1].total,
                gallonsAmount: data.reduction[2].amount,
                gallonsTotal: data.reduction[2].total,
                kilogramsAmount: data.reduction[3].amount,
                kilogramsTotal: data.reduction[3].total,
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    render() {
        const { error } = this.props.auth
        const { user } = this.props.auth
        const { job } = this.props

        return (
            <div>
                {/* Add Inventory Form */}
                <div
                    className="goal-form"
                    style={{
                        width: '600px',
                        height: '500px',
                        marginLeft: '100px',
                    }}
                >
                    <span className="login-signup-header">Add Inventory</span>
                    {error && <div className="alert error-dailog">{error}</div>}

                    <div className="field">
                        <input
                            id="itname"
                            placeholder="Item Name"
                            type="text"
                            required
                            value={this.state.itemName}
                            onChange={(e) =>
                                this.handleInputChange(
                                    'itemName',
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="field" style={{ display: 'flex' }}>
                        <input
                            id="quan"
                            placeholder="Quantity"
                            type="number"
                            required
                            value={this.state.quantity}
                            onChange={(e) =>
                                this.handleInputChange(
                                    'quantity',
                                    Number(e.target.value)
                                )
                            }
                        />
                        <select
                            id="metric"
                            name="selected"
                            value={this.state.metric}
                            style={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                height: '40px',
                                marginTop: '20px',
                                padding: '5px',
                                borderRadius: '6px',
                                fontSize: '15px',
                            }}
                            onChange={(e) =>
                                this.handleInputChange('metric', e.target.value)
                            }
                        >
                            <option value="Items">Items</option>
                            <option value="Tons">Tons</option>
                            <option value="Gallons">Gallons</option>
                            <option value="KiloGrams">KiloGrams</option>
                        </select>
                    </div>

                    <div className="field">
                        <input
                            id="cost"
                            placeholder="Cost per Unit"
                            type="text"
                            required
                            value={this.state.costperitem}
                            onChange={(e) =>
                                this.handleInputChange(
                                    'costperitem',
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="field">
                        <input
                            id="bdate"
                            placeholder="Date Bought"
                            type="date"
                            required
                            value={this.state.datebought}
                            onChange={(e) =>
                                this.handleInputChange(
                                    'datebought',
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="field">
                        <input
                            id="edate"
                            placeholder="Expiration Date"
                            type="date"
                            required
                            value={this.state.dateexpired}
                            onChange={(e) =>
                                this.handleInputChange(
                                    'dateexpired',
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="field">
                        <button
                            className="button save-btn"
                            onClick={this.handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* Update Item Form */}
                <div
                    className="goal-form"
                    style={{
                        width: '600px',
                        height: '300px',
                        marginLeft: '100px',
                    }}
                >
                    <span className="login-signup-header">Update Item</span>
                    {error && <div className="alert error-dailog">{error}</div>}

                    <div className="field">
                        <input
                            id="itnameupdate"
                            placeholder="Item Name"
                            type="text"
                            required
                            value={this.state.itemName}
                            onChange={(e) =>
                                this.handleInputChange(
                                    'itemName',
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="field" style={{ display: 'flex' }}>
                        <input
                            id="quanupdate"
                            placeholder="Quantity"
                            type="number"
                            required
                            value={this.state.quantity}
                            onChange={(e) =>
                                this.handleInputChange(
                                    'quantity',
                                    Number(e.target.value)
                                )
                            }
                        />

                        <select
                            id="metric"
                            name="selected"
                            value={this.state.metric}
                            style={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                height: '40px',
                                marginTop: '20px',
                                padding: '5px',
                                borderRadius: '6px',
                                fontSize: '15px',
                            }}
                            onChange={(e) =>
                                this.handleInputChange('metric', e.target.value)
                            }
                        >
                            <option value="Items">Items</option>
                            <option value="Tons">Tons</option>
                            <option value="Gallons">Gallons</option>
                            <option value="KiloGrams">KiloGrams</option>
                        </select>
                    </div>

                    <div className="field">
                        <button
                            className="button save-btn"
                            onClick={this.handleSave1}
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* Estimated Waste Reduction */}
                <div
                    className="goal-form"
                    style={{
                        width: '600px',
                        height: '550px',
                        marginLeft: '100px',
                    }}
                >
                    <span className="login-signup-header">
                        Estimated Waste Reduction
                    </span>
                    <div className="field">
                        <p>
                            According to the USDA, between 30 and 40 percent of
                            food supply in the US is wasted. View the reports
                            below to see what percent of each metric is wasted
                            at your restaurant.
                        </p>
                        <p>Items:</p>
                        <p>
                            {this.state.itemTotal !== 0
                                ? `${(
                                      (100 * this.state.itemAmount) /
                                      this.state.itemTotal
                                  ).toFixed(2)}% loss`
                                : '0% loss'}
                        </p>
                        <p>Tons:</p>
                        <p>
                            {this.state.tonsTotal !== 0
                                ? `${(
                                      (100 * this.state.tonsAmount) /
                                      this.state.tonsTotal
                                  ).toFixed(2)}% loss`
                                : '0% loss'}
                        </p>
                        <p>Gallons:</p>
                        <p>
                            {this.state.gallonsTotal !== 0
                                ? `${(
                                      (100 * this.state.gallonsAmount) /
                                      this.state.gallonsTotal
                                  ).toFixed(2)}% loss`
                                : '0% loss'}
                        </p>
                        <p>Kilograms:</p>
                        <p>
                            {this.state.kilogramsTotal !== 0
                                ? `${(
                                      (100 * this.state.kilogramsAmount) /
                                      this.state.kilogramsTotal
                                  ).toFixed(2)}% loss`
                                : '0% loss'}
                        </p>
                    </div>
                    <div className="field">
                        <button
                            className="button save-btn"
                            onClick={this.resetEstimate} // Updated to use resetEstimate
                        >
                            Reset Estimate
                        </button>
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
    }
}

export default connect(mapStateToProps)(Goal)
