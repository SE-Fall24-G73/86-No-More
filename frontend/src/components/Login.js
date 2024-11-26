import React, { Component } from 'react';
import { clearAuthState, login, loginGoogle } from '../actions/auth';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom'; // Import Link for navigation
import GoogleLogin from 'react-google-login';
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  componentWillUnmount() {
    this.props.dispatch(clearAuthState());
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (email && password) {
      this.props.dispatch(login(email, password));
    }
  };

  responseGoogle = (response) => {
    console.log(response);
    console.log(response.profileObj);
    this.props.dispatch(
      login(response.profileObj.email, response.profileObj.googleId)
    );
  };

  render() {
    const { error, inProgress, isLoggedIn } = this.props.auth;
    const { from } = this.props.location.state || {
      from: { pathname: '/' },
    };

    if (isLoggedIn) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <form className="login-form">
          <span className="login-signup-header">Login</span>
          {error && <div className="alert error-dailog">{error}</div>}
          <div className="field">
            <input
              type="email"
              placeholder="Email"
              required
              onChange={this.handleEmailChange}
              value={this.state.email}
            />
          </div>
          <div className="field">
            <input
              type="password"
              placeholder="Password"
              required
              onChange={this.handlePasswordChange}
              value={this.state.password}
            />
          </div>
          {/* Forgot Password Link */}
          <div className="forgot-password-link">
            <Link to="/forgotpassword" className="forgot-password-text">
              Forgot Password?
            </Link>
          </div>
          <div className="field">
            {inProgress ? (
              <button
                onClick={this.handleFormSubmit}
                disabled={inProgress}
              >
                Logging in...
              </button>
            ) : (
              <button
                onClick={this.handleFormSubmit}
                disabled={inProgress}
              >
                Log In
              </button>
            )}
            <div>
              <GoogleLogin
                clientId="890765322406-8kjk4ckk7rna07elrdugioj1elvdo3vo.apps.googleusercontent.com"
                buttonText="Login with Google "
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}
export default connect(mapStateToProps)(Login);
