import React, { useState } from "react";
import axios from "axios";
import "../styles/CaloryDetector.css";

const CaloryDetector = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [imageMimeType, setImageMimeType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [caloryItems, setCaloryItems] = useState([]);
    const [totalCalories, setTotalCalories] = useState("0");
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImageMimeType(file.type);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setImage(reader.result);
                }
            };
        }
    };

    const handlePredict = async () => {
        if (imageFile) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("image", imageFile);
            if (imageFile.type) {
                formData.append("mimeType", imageFile.type);
            }
    
            try {
                const res = await axios.post("http://127.0.0.1:5000/caloryDetector", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                // console.log("Response from backend:", res.data); // Debugging log
    
                // Safely extract data with optional chaining
                const data = res.data?.response;

                console.log(data)
                console.log(data.image_analysis)
                console.log(data.total_calories)
                const items = data?.items || [];
                const totalCalories = data?.total_calories || "0";
    
                if (!items.length) {
                    console.warn("No items found in image analysis.");
                }
    
                setCaloryItems(items);
                setTotalCalories(totalCalories);
                setPrediction(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error in prediction:", error); // Log full error details
                setIsLoading(false);
            }
        } else {
            console.error("No image file selected");
        }
    };
    

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
                            {isLoading ? "Loading..." : "Predict"}
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
                        <div className="prediction-card">
                            <p className="total-calories">Total Calories: {totalCalories}</p>
                            <div className="calory-items">
                                <h3>Food Items:</h3>
                                {caloryItems.map((item, index) => (
                                    <p key={index} className="food-item">
                                        {item.name}: {item.calories} calories
                                    </p>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CaloryDetector;
