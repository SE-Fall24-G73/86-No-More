import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/auth';
import { searchUsers } from '../actions/search';
import CameraIndoorIcon from '@mui/icons-material/CameraIndoor';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StarIcon from '@material-ui/icons/Star';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import InventoryIcon from '@material-ui/icons/InsertDriveFile';
import TimelineIcon from '@material-ui/icons/Timeline';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function Navbar(props) {
    const [menuOpen, setMenuOpen] = useState(false);

    const logOut = () => {
        localStorage.removeItem('token');
        props.dispatch(logoutUser());
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const { auth } = props;
    const { user } = auth;

    return (
        <nav className="header">
            {/* Left Section */}
            <div className="header__left">
                <Link to="/">
                    <img className='logo-nav'
                        alt="logo"
                        src="/images/WhatsApp Image 2021-12-04 at 4.31.50 PM.jpeg"
                        style={{ height: '50px' }}
                    />
                </Link>
            </div>

            {/* Middle Section */}
            <div className={`header__middle ${menuOpen ? 'show' : ''}`}>
                {auth.isLoggedIn ? (
                    <>
                        {user.role === 'owner' && (
                            <>
                                <div className="header__option">
                                    <Link to="/create-menu">
                                        <RestaurantMenuIcon fontSize="large" className="icon-red" />
                                    </Link>
                                    <p>Create Menu</p>
                                </div>
                                <div className="header__option">
                                    <Link to="/cart">
                                        <ShoppingCartIcon fontSize="large" />
                                    </Link>
                                    <p>Cart</p>
                                </div>
                                <div className="header__option">
                                    <Link to="/goal">
                                        <ListAltIcon fontSize="large" />
                                    </Link>
                                    <p>Inventory</p>
                                </div>
                                <div className="header__option">
                                    <Link to="/update">
                                        <InventoryIcon fontSize="large" />
                                    </Link>
                                    <p>Predict</p>
                                </div>
                                <div className="header__option">
                                    <Link to="/history">
                                        <TimelineIcon fontSize="large" />
                                    </Link>
                                    <p>Graph</p>
                                </div>
                                <div className="header__option">
                                    <Link to="/notification">
                                        <NotificationsActiveIcon fontSize="large" />
                                    </Link>
                                    <p>Notification</p>
                                </div>
                            </>
                        )}

                        {user.role === 'customer' && (
                            <>
                                <div className="header__option">
                                    <Link to="/menu">
                                        <RestaurantMenuIcon fontSize="large" />
                                    </Link>
                                    <p>Menu</p>
                                </div>
                                <div className="header__option">
                                    <Link to="/ratings">
                                        <StarIcon fontSize="large" />
                                    </Link>
                                    <p>Feedback</p>
                                </div>
                                <div className="header__option">
                                    <Link to="/awareness">
                                        <CameraIndoorIcon fontSize="large" />
                                    </Link>
                                    <p>Awareness</p>
                                </div>
                                <div className="header__option">
                                    <Link to="/caloryDetector">
                                        <FastfoodIcon fontSize="large" />
                                    </Link>
                                    <p>Calory Detector</p>
                                </div>
                                <div className="header__option">
                                    <Link to="/healthAdvisor">
                                        <HealthAndSafetyIcon fontSize="large" />
                                    </Link>
                                    <p>Health Advisor</p>
                                </div>
                            </>
                        )}
                    </>
                ):(<div className="auth-links">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Register</Link>
                </div>)}
            </div>

            {/* Right Section */}
            <div className="header__right">
    {auth.isLoggedIn ? (
        <>
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
                        color: 'red',
                        marginLeft: '10px',
                        fontWeight: 'bolder',
                    }}
                >
                    {auth.user.name}
                </span>
            </div>
            <div className="header__option">
                <Link to="#" onClick={logOut}>
                    Logout
                </Link>
            </div>
        </>
    ) : (
        <div className="auth-links large-screen">
            <Link to="/login">Login</Link>
            <Link to="/signup">Register</Link>
        </div>
    )}
    <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
    </div>
</div>

        </nav>
    );
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

export default connect(mapStateToProps)(Navbar);
