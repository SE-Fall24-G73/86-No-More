import React, { Component } from 'react'
import { connect, useDispatch } from 'react-redux'
import {
    createApplication,
    closeJob,
    fetchInventoryHistory,
    fetchJobs,
    deleteInventoryItem,
} from '../actions/job'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faTrash } from '@fortawesome/free-solid-svg-icons'

class Job extends Component {
    predictItem = (itemname) => {
        //const dispatch = useDispatch();
        const inventoryhistory = this.props.inventoryhistory
        const filteredInventories = inventoryhistory.filter(
            (inventory) => inventory.itemname === itemname
        )
        console.log(filteredInventories)
        // Calculate the sum of quantities
        const sumOfQuantities = filteredInventories.reduce(
            (total, inventory) => total + inventory.quantity,
            0
        )
        // Calculate the average
        const averageQuantity = sumOfQuantities / filteredInventories.length
        console.log(averageQuantity)
        alert(
            'Based on your usage, you might need ' +
                averageQuantity +
                ' of ' +
                itemname +
                ' for the next month'
        )
    }
    deleteItem = (itemname) => {
        this.props.dispatch(deleteInventoryItem(itemname))
        alert(
            'Are sure, you want to delete ' + itemname + ' from your inventory?'
        )
        this.props.dispatch(fetchJobs())
    }
    componentDidMount() {
        this.props.dispatch(fetchInventoryHistory())
    }
    //this.props.dispatch(fetchInventoryHistory())

    render() {
        const { job } = this.props
        const { user } = this.props.auth
        return (
            <div
                className="post"
                key={job._id}
                style={{ width: '50vw', marginLeft: '50px' }}
            >
                {user.restname == job.restname ? (
                    <div className="post-header">
                        <div>
                            <h4 style={{ display: 'inline-block' }}>
                                Restaurant Name :{' '}
                            </h4>
                            <span style={{ marginLeft: '10px' }}>
                                {job.restname}
                            </span>
                            <button
                                style={{
                                    marginLeft: '10px',
                                    marginRight: '10px',
                                }}
                                className="button delete-btn"
                                onClick={() => this.deleteItem(job.itemname)}
                            >
                                Delete &nbsp;
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    style={{ color: '#f9fafa' }}
                                />
                            </button>
                            <button
                                style={{ marginLeft: '10px' }}
                                className="button predict-btn"
                                onClick={() => this.predictItem(job.itemname)}
                            >
                                Predict &nbsp;
                                <FontAwesomeIcon
                                    icon={faChartBar}
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
                                Item :{' '}
                            </h4>
                            <span style={{ marginLeft: '10px' }}>
                                {job.itemname}
                            </span>
                        </div>

                        <div>
                            <h4
                                style={{
                                    display: 'inline-block',
                                    marginTop: '-12px',
                                }}
                            >
                                Cost Per Item :{' '}
                            </h4>
                            <span style={{ marginLeft: '10px' }}>
                                {job.costperitem}
                            </span>
                        </div>

                        <div>
                            <h4
                                style={{
                                    display: 'inline-block',
                                    marginTop: '-12px',
                                }}
                            >
                                Expiration Date :{' '}
                            </h4>
                            <span style={{ marginLeft: '10px' }}>
                                {job.dateexpired}
                            </span>
                        </div>

                        <div>
                            <h4
                                style={{
                                    display: 'inline-block',
                                    marginTop: '-12px',
                                }}
                            >
                                Date Bought :{' '}
                            </h4>
                            <span style={{ marginLeft: '10px' }}>
                                {job.datebought}
                            </span>
                        </div>
                        <div>
                            <h4
                                style={{
                                    display: 'inline-block',
                                    marginTop: '-12px',
                                }}
                            >
                                Quantity :{' '}
                            </h4>
                            <span style={{ marginLeft: '10px' }}>
                                {job.quantity}
                            </span>
                        </div>
                    </div>
                ) : (
                    []
                )}
            </div>
        )
    }
}

function mapStateToProps({ auth, job, application, inventoryhistory }) {
    return {
        auth,
        application,
        inventoryhistory,
    }
}

export default connect(mapStateToProps)(Job)
