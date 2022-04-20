import React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
// import textlogo from '../images/Asset 3.png';

// import Dropdown from './Dropdown';

function Navbar(props) {
    
    return (
        <div className="navbar">
                <span id="logo">WashU Eats</span>
                {/* <img id="logo" src={textlogo} alt="WashU Eats" /> */}
            
            {/* Links: */}
            {/* Home: the nutrient breakdown of meals user ate today */}
            <NavLink className="navlink" to="/"><Button id = "home"><strong>Nutrition</strong></Button></NavLink>
            {/* Your Plate: lists the meals the user added today */}
            <NavLink className="navlink" to="/todays-meals"><Button id = "yourmeals"><strong>Meals Today</strong></Button></NavLink>
            {/* Menu: WashU's menu items filtered by location */}
            {/* <NavLink className="navlink" to="/past-meals"><Button id = "pastmeals"><strong>Past Meals</strong></Button></NavLink> */}
            <NavLink className="navlink" to="/menu"><Button id = "menu"><strong>Campus Meals</strong></Button></NavLink>

            <NavLink className="navlink" to="/settings"><Button id = "settings"><strong>Profile</strong></Button></NavLink>
            <NavLink className="navlink" to="/recurring"><Button id = "workout"><strong>Recurring workouts</strong></Button></NavLink>
            <NavLink className="navlink" onClick={() => props.logOut()} to="/"><Button id = "logout"><strong>Logout</strong></Button></NavLink>
            
            {/* <NavLink className="navlink" onClick={() => props.logOut()} to="/"><Button id = "logout"><strong>Logout {props.userEmail}</strong></Button></NavLink> */}
            {/* <NavLink className="navlink" onClick={console.log("login clicked!")} to="/login"><strong>Log in </strong></NavLink> */}

            
        </div>
    );
}

export default Navbar;