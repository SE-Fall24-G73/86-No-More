// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPassword.css'; // Import the CSS file

const ResetPassword = () => {
  const { token } = useParams();
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8000/resetpassword', {
        token,
        newPassword: password,
      });
      setMessage(response.data.message);
      setTimeout(() => history.push('/login'), 3000); // Redirect after success
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'Something went wrong');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2 className="reset-password-title">Reset Password</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="reset-password-input"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
        </form>
        {message && <div className="success-message">{message}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default ResetPassword;
