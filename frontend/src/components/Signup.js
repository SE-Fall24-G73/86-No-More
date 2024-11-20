import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Redirect } from 'react-router-dom'
import '../styles/signup.css'
import { clearAuthState, signup, startSingup } from '../actions/auth'
import toast from 'react-hot-toast'

const Signup = () => {
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [restaurantName, setRestaurantName] = useState('')
    const [role, setRole] = useState('customer')

    useEffect(() => {
        // Equivalent to componentWillUnmount
        return () => {
            dispatch(clearAuthState())
        }
    }, [dispatch])

    const onFormSubmit = (e) => {
        e.preventDefault()

        // console.log(email, password, confirmPassword, fullName, role)

        if (!email || !password || !confirmPassword || !fullName || !role) {
            toast.error('All fields are required')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (email && password && confirmPassword && fullName && role) {
            console.log(restaurantName)
            dispatch(startSingup())
            dispatch(
                signup(
                    email,
                    password,
                    confirmPassword,
                    fullName,
                    restaurantName,
                    role
                )
            )
        } else {
            toast.error('Please fill in all required fields')
        }
    }

    if (auth.isLoggedIn) {
        return <Redirect to="/" />
    }

    return (
        <div className="signup-container">
            <form className="signup-form">
                <h2 className="signup-header">Signup</h2>
                {auth.error && (
                    <div className="alert error-dialog">{auth.error}</div>
                )}
                <div className="field">
                    <input
                        placeholder="Full Name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div className="field">
                    <input
                        placeholder="Email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="field">
                    <select
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Select Role</option>
                        <option value="customer">Customer</option>
                        <option value="owner">Restaurant Owner</option>
                    </select>
                </div>
                {role === 'owner' && (
                    <div className="field">
                        <input
                            placeholder="Restaurant Name"
                            type="text"
                            required
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                        />
                    </div>
                )}
                <div className="field">
                    <input
                        placeholder="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="field">
                    <input
                        placeholder="Confirm Password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="field">
                    <button
                        className="signup-button"
                        onClick={onFormSubmit}
                        disabled={auth.inProgress}
                    >
                        Signup
                    </button>
                </div>
                <div className="divider">
                    <span>or</span>
                </div>
                <div className="field">
                    <button className="google-button">
                        <svg
                            className="w-4 h-4 me-2"
                            style={{
                                width: '20px',
                                height: '20px',
                                marginRight: '8px',
                            }}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 19"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Sign up with Google
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Signup
