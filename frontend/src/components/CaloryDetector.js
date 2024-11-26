import React, { useState } from 'react'
import axios from 'axios'
import '../styles/CaloryDetector.css'

const CaloryDetector = () => {
    const [image, setImage] = useState(null)
    const [prediction, setPrediction] = useState(null)
    const [imageMimeType, setImageMimeType] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [caloryItems, setCaloryItems] = useState([])
    const [totalCalories, setTotalCalories] = useState('0')
    const [imageFile, setImageFile] = useState(null)
    const [weeklyPlan, setWeeklyPlan] = useState({})

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImageMimeType(file.type)
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setImage(reader.result)
                }
            }
        }
    }

    const handlePredict = async () => {
        if (imageFile) {
            setIsLoading(true)
            const formData = new FormData()
            formData.append('image', imageFile)
            if (imageFile.type) {
                formData.append('mimeType', imageFile.type)
            }

            try {
                const res = await axios.post(
                    'http://127.0.0.1:5000/caloryDetector',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )

                const data = JSON.parse(res.data?.response)

                console.log('Backend Response:', data)

                const items = data?.image_analysis?.items || []
                const totalCalories =
                    data?.image_analysis?.total_calories || '0'
                const weeklyMealPlan = data?.seven_day_meal_plan || {}

                if (!items.length) {
                    console.warn('No items found in image analysis.')
                }

                setCaloryItems(items)
                setTotalCalories(totalCalories)
                setPrediction(data)
                setWeeklyPlan(weeklyMealPlan)
                setIsLoading(false)
            } catch (error) {
                console.error('Error in prediction:', error)
                setIsLoading(false)
            }
        } else {
            console.error('No image file selected')
        }
    }

    return (
        <div className="calory-detector-container">
            <div className="upload-label">Upload Image</div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
            />
            <div className="preview-container">
                {image && (
                    <>
                        <img
                            src={image}
                            alt="Preview"
                            className="image-preview"
                        />
                        <button
                            onClick={handlePredict}
                            disabled={isLoading}
                            className="predict-button"
                        >
                            {isLoading ? 'Loading...' : 'Predict'}
                        </button>
                    </>
                )}
            </div>
            <div className="results-container">
                {isLoading ? (
                    <div className="loading-container">
                        <img
                            src="/GIF/loading6.gif"
                            alt="Loading..."
                            className="loading-gif"
                        />
                    </div>
                ) : (
                    prediction && (
                        <>
                            <div className="prediction-card">
                                <p className="total-calories">
                                    Total Calories: {totalCalories}
                                </p>
                                <div className="calory-items">
                                    <h3>Food Items:</h3>
                                    {caloryItems.length > 0 ? (
                                        caloryItems.map((item, index) => (
                                            <p
                                                key={index}
                                                className="food-item"
                                            >
                                                {item.name}: {item.calories}{' '}
                                                calories
                                            </p>
                                        ))
                                    ) : (
                                        <p>No food items detected.</p>
                                    )}
                                </div>
                            </div>
                            <div className="weekly-plan-container">
                                <h2>Suggested Weekly Meal Plan</h2>
                                <div className="weekly-plan-grid">
                                    {weeklyPlan &&
                                        Object.keys(weeklyPlan).length > 0 ? (
                                        Object.entries(weeklyPlan).map(
                                            ([day, meals]) => (
                                                <div
                                                    key={day}
                                                    className="meal-card"
                                                >
                                                    <h3>
                                                        {day
                                                            .replace('_', ' ')
                                                            .toUpperCase()}
                                                    </h3>
                                                    <div className="meal-section">
                                                        <h4>Breakfast</h4>
                                                        <p>
                                                            {meals.breakfast ||
                                                                'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="meal-section">
                                                        <h4>Lunch</h4>
                                                        <p>
                                                            {meals.lunch ||
                                                                'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="meal-section">
                                                        <h4>Dinner</h4>
                                                        <p>
                                                            {meals.dinner ||
                                                                'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="meal-section">
                                                        <h4>Snacks</h4>
                                                        {Array.isArray(
                                                            meals.snacks
                                                        ) &&
                                                            meals.snacks.length >
                                                            0 ? (
                                                            <ul>
                                                                {meals.snacks.map(
                                                                    (
                                                                        snack,
                                                                        idx
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            {
                                                                                snack
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <p>
                                                                No snacks
                                                                listed.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p>No weekly meal plan available.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    )
}

export default CaloryDetector
