// Notification.js

import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import emailjs from 'emailjs-com'

import { fetchJobs } from '../actions/job'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { API_ROOT, APIURLS } from '../helpers/urls'

const useStyles = makeStyles({
    root: {
        maxWidth: 800,
        marginLeft: 20,
        marginTop: 50,
        justifyContent: 'center',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
})

const Notification = (props) => {
    const classes = useStyles()
    const [inventoryData, setInventoryData] = useState([])
    const [itemsExpiringToday, setItemsExpiringToday] = useState([])
    const [itemsBelowThreshold, setItemsBelowThreshold] = useState([])

    const { error } = props.auth
    const { user } = props.auth
    const jobs = props.job || []

    const fetchInventoryHistory = async () => {
        try {
            const restaurantId = user._id

            const data = await axios.post(
                `${API_ROOT}/users/fetchinventoryHistory`,
                {
                    restaurantId,
                }
            )

            // console.log(data.data.inventoryhistory)

            setInventoryData(data.data.inventoryhistory)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchInventoryHistory()
    }, [])

    useEffect(() => {
        if (inventoryData.length > 0) {
            const today = new Date()
            today.setHours(0, 0, 0, 0) // Normalize to midnight

            // Items expiring today
            const expiringToday = inventoryData.filter((item) => {
                const expirationDate = new Date(item.dateexpired)
                expirationDate.setHours(0, 0, 0, 0) // Normalize to midnight
                return expirationDate.getTime() === today.getTime()
            })

            // Items with quantity below threshold
            const quantityThreshold = 10 // Set your threshold here
            const lowQuantityItems = inventoryData.filter(
                (item) => item.quantity < quantityThreshold
            )

            setItemsExpiringToday(expiringToday)
            setItemsBelowThreshold(lowQuantityItems)

            // For debugging
            console.log('Items expiring today:', expiringToday)
            console.log('Items below threshold:', lowQuantityItems)
        }
    }, [inventoryData])

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                {itemsExpiringToday.length > 0 ||
                itemsBelowThreshold.length > 0 ? (
                    <Box flexDirection="row-reverse">
                        {itemsExpiringToday.map((item) => (
                            <Card key={item._id} className={classes.root}>
                                <CardContent>
                                    <Typography color="secondary" gutterBottom>
                                        Expiration Alert!
                                    </Typography>
                                    <Typography
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        {item.dateexpired}
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        {item.itemName} has expired on{' '}
                                        {item.dateexpired}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {item.quantity} unit
                                        {item.quantity > 1
                                            ? 's have'
                                            : ' has'}{' '}
                                        gone bad. Please order more.
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}

                        {itemsBelowThreshold.map((item) => (
                            <Card key={item._id} className={classes.root}>
                                <CardContent>
                                    <Typography color="primary" gutterBottom>
                                        Low Inventory Alert!
                                    </Typography>
                                    <Typography
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        Only {item.quantity} unit
                                        {item.quantity > 1
                                            ? 's are'
                                            : ' is'}{' '}
                                        left in stock.
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        It looks like some of your inventory is
                                        getting low
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        color="textSecondary"
                                    >
                                        {item.itemName} quantity is low. Try
                                        checking quantity or restricting use.
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            width: '100vw',
                            height: '90vh',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ fontSize: '3rem' }}>All caught up!✔</div>
                    </div>
                )}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        results: state.search.results,
        job: state.job,
    }
}

export default connect(mapStateToProps)(Notification)
