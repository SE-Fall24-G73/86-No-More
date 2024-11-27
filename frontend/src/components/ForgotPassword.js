// src/pages/ForgotPassword.js
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import '../styles/ForgotPassword.css' // Import CSS for styling
import { APIURLS } from '../helpers/urls'

const ForgotPassword = () => {
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        // console.log(data)

        // console.log(APIURLS.forgotPassword)
        try {
            const response = await axios.post(APIURLS.forgotPassword(), data)

            setMessage(response.data.message)
        } catch (error) {
            setErrorMessage(error.response?.data.message)
        }
    }

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2 className="forgot-password-title">Forgot Password</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="forgot-password-form"
                >
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="forgot-password-input"
                        {...register('email', {
                            required: 'Email is required',
                        })}
                    />
                    {errors.email && (
                        <p className="forgot-password-error">
                            {errors.email.message}
                        </p>
                    )}
                    <button type="submit" className="forgot-password-button">
                        Send Reset Email
                    </button>
                </form>
                {message && <div className="success-message">{message}</div>}
                {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
