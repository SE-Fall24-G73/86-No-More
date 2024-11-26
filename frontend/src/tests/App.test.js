import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router since App uses it
import App from './App'; // Import your App component

test('App component renders without crashing', () => {
  // Render the App component wrapped in Router
  render(
    <Router>
      <App />
    </Router>
  );
  // If there is no crash, this test will pass automatically
});
