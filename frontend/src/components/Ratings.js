import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Rating from '@material-ui/lab/Rating'
import '../styles/Ratings.css'
import { APIURLS } from '../helpers/urls'
import axios from 'axios'
import toast from 'react-hot-toast'
import auth from '../reducers/auth'

const Ratings = () => {
    const [ratings, setRatings] = useState({})
    const [loadingStates, setLoadingStates] = useState({})
    const [menu, setMenu] = useState([])
    const [loading, setLoading] = useState(false)
    const auth = useSelector((state) => state.auth)

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

    // Handler for rating changes
    const handleRatingChange = (menuItemId, newValue) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [menuItemId]: newValue,
        }))
    }

    console.log('submit', auth.user)

    const handleSubmit = async (menuItemId) => {
        const ratingValue = ratings[menuItemId]
        if (!ratingValue) {
            toast.error('Please select a rating before submitting.')
            return
        }

        setLoadingStates((prevLoading) => ({
            ...prevLoading,
            [menuItemId]: true,
        }))

        try {
            const response = await axios.post(APIURLS.submitRating(), {
                foodItemId: menuItemId,
                rating: ratingValue,
                customerId: auth.user._id,
            })

            toast.success('Rating submitted successfully!')

            setRatings((prevRatings) => ({
                ...prevRatings,
                [menuItemId]: 0,
            }))
        } catch (error) {
            console.error('Error submitting rating:', error)
            toast.error('Failed to submit rating. Please try again.')
        } finally {
            setLoadingStates((prevLoading) => ({
                ...prevLoading,
                [menuItemId]: false,
            }))
        }
    }

    return (
        <div className="ratings-container">
            <div className="ratings-content">
                {menu?.map((menuItem) => (
                    <div
                        className="post"
                        key={menuItem._id}
                        style={{ width: '50vw', margin: '20px auto' }}
                    >
                        <div className="post-header">
                            <div className="restaurant-info">
                                <h4 className="label">Restaurant Name:</h4>
                                <span className="value">
                                    {menuItem.restaurantName}
                                </span>
                            </div>
                            <div className="rating-section">
                                <Rating
                                    className="rating-component"
                                    name={`rating-${menuItem._id}`}
                                    value={ratings[menuItem._id] || 0}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        handleRatingChange(
                                            menuItem._id,
                                            newValue
                                        )
                                    }}
                                />
                                <button
                                    className="submit-button"
                                    onClick={() => handleSubmit(menuItem._id)}
                                    disabled={
                                        !ratings[menuItem._id] ||
                                        loadingStates[menuItem._id]
                                    }
                                >
                                    {loadingStates[menuItem._id]
                                        ? 'Submitting...'
                                        : 'Submit'}
                                </button>
                            </div>
                            <div className="dish-info">
                                <h4 className="label">Dish:</h4>
                                <span className="value">
                                    {menuItem.itemName}
                                </span>
                            </div>
                            <div className="price-info">
                                <h4 className="label">Price:</h4>
                                <span className="value">{menuItem.cost}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Ratings
