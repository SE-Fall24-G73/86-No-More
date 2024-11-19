import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'; 
import { searchUsers } from '../actions/search'
import { clearAuthState, editItem } from '../actions/auth'
import { clearsearchstate } from '../actions/search'

import Widgets from './Widgets.js'
import { createJob } from '../actions/job'
import { fetchJobs, createMenu } from '../actions/job'
import Job1 from './Job1'

class Menu extends Component {
    constructor(props) {
        super(props)

        this.state = {
            restname: '',
            restid: '',
            menuname: '',
            quantity: '0',
            costmenu: '',
            selectedProductTypes: [],
            editMode: false,
        }
    }

    handleSearch = (e) => {
        const searchText = e.target.value
        console.log(searchText)

        this.props.dispatch(searchUsers(searchText))
    }
    handleSave1 = () => {
        const {
            restname,
            restid,
            itemname,
            quantity,
            costperitem,
            datebought,
            dateexpired,
        } = this.state

        const { user } = this.props.auth
        const { job } = this.props
        console.log(itemname)

        this.props.dispatch(editItem(itemname, quantity))
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

    handleProductTypeChange = (selectedOptions) => {
        this.setState({
            selectedProductTypes: selectedOptions.map(option => option.value),
        });
        console.log(this.selectedProductTypes);
    }

    handleSave = () => {
        const { restname, restid, menuname, quantity, costmenu, selectedProductTypes } = this.state

        const { user } = this.props.auth

        this.setState({
            restname: user.restname,
            restid: user._id,
        })

        this.props.dispatch(
            createMenu(user.restname, user._id, menuname, quantity, costmenu, selectedProductTypes)
        )
        alert(menuname + ' added!')
    }
    componentDidMount() {
        this.props.dispatch(fetchJobs())
    }

    render() {
        const { error } = this.props.auth

        const { menu } = this.props

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
                                this.handleInputChange(
                                    'menuname',
                                    e.target.value
                                )
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
                                this.handleInputChange(
                                    'quantity',
                                    e.target.value
                                )
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
                                this.handleInputChange(
                                    'costmenu',
                                    e.target.value
                                )
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
                            { value: 'Others', label: 'Others'}
                        ]}
                        onChange={this.handleProductTypeChange}
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

export default connect(mapStateToProps)(Menu)
