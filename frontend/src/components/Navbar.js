import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import React from 'react'
import { logoutUser } from '../actions/auth'

import { searchUsers } from '../actions/search'
import CameraIndoorIcon from '@mui/icons-material/CameraIndoor'
import ListAltIcon from '@material-ui/icons/ListAlt'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import StarIcon from '@material-ui/icons/Star'
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu'
import InventoryIcon from '@material-ui/icons/InsertDriveFile'
import TimelineIcon from '@material-ui/icons/Timeline'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'

class Navbar extends React.Component {
    logOut = () => {
        localStorage.removeItem('token')
        this.props.dispatch(logoutUser())
    }

    handleSearch = (e) => {
        const searchText = e.target.value

        this.props.dispatch(searchUsers(searchText))
    }

    render() {
        const { auth } = this.props
        const { user } = this.props.auth

        return (
            <nav className="header">
                <div
                    className="header__left"
                    style={{ display: 'flex', justifyContent: 'space-evenly' }}
                >
                    <Link to="/">
                        <img
                            alt="logo"
                            src="/images/WhatsApp Image 2021-12-04 at 4.31.50 PM.jpeg"
                            style={{ height: '50px' }}
                        />
                    </Link>
                </div>
                {auth.isLoggedIn && (
                    <div
                        className="header__middle"
                        style={{ marginLeft: '20px' }}
                    >
                        {user.role === 'owner' && (
                            <>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/create-menu">
                                        <RestaurantMenuIcon fontSize="large" />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>
                                        Create Menu
                                    </p>
                                </div>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/cart">
                                        <ShoppingCartIcon fontSize="large" />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>Cart</p>
                                </div>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/goal">
                                        <ListAltIcon
                                            fontSize="large"
                                            style={{ marginLeft: '13px' }}
                                        />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>
                                        Inventory
                                    </p>
                                </div>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/update">
                                        <InventoryIcon
                                            fontSize="large"
                                            style={{ marginLeft: '5px' }}
                                        />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>Predict</p>
                                </div>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/history">
                                        <TimelineIcon fontSize="large" />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>Graph</p>
                                </div>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/notification">
                                        <NotificationsActiveIcon
                                            fontSize="large"
                                            style={{ marginLeft: '20px' }}
                                        />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>
                                        Notification
                                    </p>
                                </div>
                            </>
                        )}

                        {user.role === 'customer' && (
                            <>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/menu">
                                        <RestaurantMenuIcon fontSize="large" />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>Menu</p>
                                </div>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/ratings">
                                        <StarIcon
                                            fontSize="large"
                                            style={{ marginLeft: '17px' }}
                                        />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>Feedback</p>
                                </div>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/awareness">
                                        <CameraIndoorIcon
                                            fontSize="large"
                                            style={{ marginLeft: '17px' }}
                                        />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>
                                        Awareness
                                    </p>
                                </div>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/caloryDetector">
                                        <CameraIndoorIcon
                                            fontSize="large"
                                            style={{ marginLeft: '17px' }}
                                        />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>
                                        Calory Detector
                                    </p>
                                </div>
                                <div
                                    className="header__option "
                                    style={{ display: 'block' }}
                                >
                                    <Link to="/healthAdvisor">
                                        <CameraIndoorIcon
                                            fontSize="large"
                                            style={{ marginLeft: '17px' }}
                                        />
                                    </Link>
                                    <p style={{ marginTop: '0px' }}>
                                        Health Advisor
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
                <div className="header__right">
                    <div className="header__info">
                        {auth.isLoggedIn && (
                            <div className="user">
                                <Link to="/settings">
                                    <img
                                        src="/images/contact-person-red-icon-free-png.png"
                                        alt="user-dp"
                                        id="user-dp"
                                        style={{
                                            marginLeft: '0px',
                                            height: '30px',
                                            width: '30px',
                                        }}
                                    />
                                </Link>
                                <span
                                    style={{
                                        color: 'gray',
                                        marginLeft: '10px',
                                        fontWeight: 'bolder',
                                    }}
                                >
                                    {auth.user.name}
                                </span>
                            </div>
                        )}

                        <div className="nav-links">
                            <ul>
                                {!auth.isLoggedIn && (
                                    <li>
                                        <Link
                                            to="/login"
                                            style={{
                                                color: 'gray',
                                                marginLeft: '10px',
                                                fontWeight: 'bolder',
                                            }}
                                        >
                                            Login
                                        </Link>
                                    </li>
                                )}

                                {auth.isLoggedIn && (
                                    <li
                                        onClick={this.logOut}
                                        style={{
                                            color: 'gray',
                                            marginLeft: '0px',
                                            fontWeight: 'bolder',
                                        }}
                                    >
                                        Logout
                                    </li>
                                )}
                                {!auth.isLoggedIn && (
                                    <li>
                                        <Link
                                            to="/signup"
                                            style={{
                                                color: 'gray',
                                                marginLeft: '10px',
                                                fontWeight: 'bolder',
                                            }}
                                        >
                                            Register
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    }
}

export default connect(mapStateToProps)(Navbar)
