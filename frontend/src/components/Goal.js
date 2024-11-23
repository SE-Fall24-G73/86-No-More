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
        }
    }

    handleSave1 = () => {
        const { itemname, quantity, metric } = this.state

        console.log(itemname)

        this.props.dispatch(editItem(itemname, quantity, metric))
        this.props.dispatch(createInventoryHistory(itemname, quantity, metric))
        this.setState({
            itemname: '',
        })

        alert('updated the quantity of ' + itemname)
        document.getElementById('itnameupdate').value = ''
        document.getElementById('quanupdate').value = ''
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
            restaurantName,
            restaurantId,
            itemName,
            quantity,
            costperitem,
            datebought,
            dateexpired,
            metric,
        } = this.state

        const { user } = this.props.auth

        this.setState({
            restaurantName: user.restaurantName,
            restaurantId: user._id,
        })

        this.props.dispatch(
            createJob(
                user.restname,
                user._id,
                itemName,
                quantity,
                costperitem,
                datebought,
                dateexpired,
                metric
            )
        )
        this.props.dispatch(createInventoryHistory(itemname, quantity, metric))
        this.setState({
            itemname: '',
        })

        // alert(itemName + ' added to the inventory!')
        toast.success(itemName + ' added to the inventory!')
        document.getElementById('itname').value = ''
        document.getElementById('quan').value = ''
        document.getElementById('cost').value = ''
        document.getElementById('edate').value = ''
        document.getElementById('bdate').value = ''
    }

    async componentDidMount() {
        this.props.dispatch(fetchJobs())
        // this.props.dispatch(fetchReductionEstimate())
        // const data = fetchReductionEstimate();
        // this.setState(() => ({
        //     reductionData: data
        // }))
        // console.log(data)
        // console.log("HERE123")

        try {
            const response = await fetch(APIURLS.fetchReductionEstimate()) // replace with actual endpoint
            const data = await response.json()
            console.log(data.reduction[0].amount)
            console.log('Howdy')
            // this.setState({ apiData: data })
            this.setState(() => ({
                itemAmount: data.reduction[0].amount,
                itemTotal: data.reduction[0].total,
                tonsAmount: data.reduction[1].amount,
                tonsTotal: data.reduction[1].total,
                gallonsAmount: data.reduction[2].amount,
                gallonsTotal: data.reduction[2].total,
                kilogramsAmount: data.reduction[3].amount,
                kilogramsTotal: data.reduction[3].total,
            }))
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
                            onChange={(e) =>
                                this.handleInputChange(
                                    'itemname',
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="field" style={{ display: 'flex' }}>
                        <input
                            id="quan"
                            placeholder="Quantity"
                            type="text"
                            required
                            onChange={(e) =>
                                this.handleInputChange(
                                    'quantity',
                                    e.target.value
                                )
                            }
                        />
                        <select
                            id="metric"
                            name="selected"
                            defaultValue={'Items'}
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
                            onChange={(e) =>
                                this.handleInputChange(
                                    'costperunit',
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="field">
                        <input
                            id="bdate"
                            placeholder="Date Bought (mm/dd/yyyy)"
                            type="text"
                            required
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
                            placeholder="Expiration Date (mm/dd/yyyy)"
                            type="text"
                            required
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
                            onChange={(e) =>
                                this.handleInputChange(
                                    'itemname',
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="field" style={{ display: 'flex' }}>
                        <input
                            id="quanupdate"
                            placeholder="Quantity"
                            type="text"
                            required
                            onChange={(e) =>
                                this.handleInputChange(
                                    'quantity',
                                    e.target.value
                                )
                            }
                        />

                        <select
                            id="metric"
                            name="selected"
                            defaultValue={'Tons'}
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
                            {JSON.stringify(
                                this.state.itemTotal != 0
                                    ? (100 * this.state.itemAmount) /
                                          this.state.itemTotal
                                    : 0
                            )}
                            % loss
                        </p>
                        <p>Tons:</p>
                        <p>
                            {JSON.stringify(
                                this.state.tonsTotal != 0
                                    ? (100 * this.state.tonsAmount) /
                                          this.state.tonsTotal
                                    : 0
                            )}
                            % loss
                        </p>
                        <p>Gallons:</p>
                        <p>
                            {JSON.stringify(
                                this.state.gallonsTotal != 0
                                    ? (100 * this.state.gallonsAmount) /
                                          this.state.gallonsTotal
                                    : 0
                            )}
                            % loss
                        </p>
                        <p>Kilograms:</p>
                        <p>
                            {JSON.stringify(
                                this.state.kilogramsTotal != 0
                                    ? (100 * this.state.kilogramsAmount) /
                                          this.state.kilogramsTotal
                                    : 0
                            )}
                            % loss
                        </p>
                    </div>
                    <div className="field">
                        <button
                            className="button save-btn"
                            onClick={this.handleSave1}
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
