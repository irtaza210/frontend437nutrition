import React, { Component } from 'react';
import logo from '../images/app_logo.png';
import './LoginPage.css';
import firebase from "../fire";
import {db} from '../fire';
import Checkbox from "@material-ui/core/Checkbox";
// Login Form template taken from https://codepen.io/Devel0per95/pen/rjOpdx 
// Handles display of Login or Register pages 
class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRegisterPage: false,    
            email: "",
            password: "",
            confirmPassword: ""
        }
        this.loginClicked = this.loginClicked.bind(this);
        this.registerClicked = this.registerClicked.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.showRegisterForm = this.showRegisterForm.bind(this);
        this.setConfirmPassword = this.setConfirmPassword.bind(this);
        this.showRegisterForm = this.showRegisterForm.bind(this);

        // firebase.auth().onAuthStateChanged(user => {
        //     user
        //       ? localStorage.setItem('loggedinuser', JSON.stringify(user))
        //       : localStorage.removeItem('loggedinuser');
        // });
    }
    
    render() {
        if (!this.state.showRegisterPage) {
            // Show login form
            return (
                <div className="main">
                    <img id="logo1" src={logo} alt="App Logo" />

                    <p className="sign" align="center">Login</p>
                    <form className="form1">
                        {/* Update email and password state properties every time the user changes them */}
                        <input className="un " id = "useremail" type="text" align="center" placeholder="Email" onChange={ (e) => {
                            this.setEmail(e.target.value);
                            // console.log(`****username changed: ${this.email}`);
                            }} required 
                        />
                        <input className="pass" type="password" align="center" placeholder="Password" onChange={ (e) => {
                                this.setPassword(e.target.value);
                                }} required
                        />
                        <p className="reset" align="center" onClick={(e) => this.resetPassword(e)} ><a className="link2" href="#">Forgot Password?</a></p>
                        <a className="submit link" align="center" onClick={(e) => { this.loginClicked(e) }} >Login</a>
                        <p className="forgot" align="center" onClick={(e) => this.showRegisterForm(e)} ><a className="link" id="registering" href="#">Register</a></p>
                        {/* TODO: Forgot password */}
                        {/* <p className="forgot" align="center"><a className="link" href="#">Forgot Password?</a></p> */}
                    </form>

                </div>
            );

        } else {
            return (
                <div>
                    <div className="form-style-3">
                        <form onSubmit={(e) => this.registerClicked(e)}>
                            <fieldset><legend>Sign Up Info</legend>
                                {/* Name, email, password, confirm password info: */}
                                <label htmlFor="name"><span>Name <span className="required">*</span></span><input type="text" className="input-field" name="name" /></label>
                                <label htmlFor="email"><span>Email <span className="required">*</span></span><input type="email" className="input-field" name="email" /></label>
                                <label htmlFor="password"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="password" /></label>
                                <label htmlFor="confirmPassword"><span id="confirmSpan">Confirm Password <span className="required">*</span></span><input type="password" className="input-field" name="confirmPassword" /></label>
                                {/* Height -- separate inputs for feet and inches */}
                                {/* <div> <label><span>Height</span></label> </div> */}
                                
                            </fieldset>
                            <fieldset><legend>Settings</legend>
                                <label htmlFor="age"><span>Age </span><input type="number" className="input-field" name="age" min="0" /></label>
                                <label htmlFor="weight"><span>Weight </span><input type="number" className="input-field" name="weight" min="0" /></label>
                                <label id="heightLabel">
                                    <span>Height </span>
                                    <div id="heightinputs">
                                        <input id="heightfeet" type="number" className="input-field" name="heightfeet" min="0" max="10" />ft 
                                        <input id="heightinches" type="number" className="input-field" name="heightinches" min="0" max="11" />in 
                                    </div>
                                    
                                </label>

                                {/* Dropdown for gender */}
                                <label htmlFor="gender"><span>Gender</span>
                                    <select name="gender" className="select-field">
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="other">Other</option>
                                    </select>
                                </label>
                                {/* Checkboxes for dietary restrictions: */}
                                <label id="dietLabel">Check any allergies you have:</label>  
                                <label className="checkboxLabel"><input type="checkbox" name="dairy" value="dairy" /><span>Dairy</span></label>
                                <label className="checkboxLabel"><input type="checkbox" name="egg" value="egg" /><span>Egg</span></label>
                                <label className="checkboxLabel"><input type="checkbox" name="wheat" value="wheat" /><span>Wheat</span></label>
                                <label className="checkboxLabel"><input type="checkbox" name="soybean" value="soybean" /><span>Soybean</span></label>
                                <label className="checkboxLabel"><input type="checkbox" name="gluten" value="gluten" /><span>Gluten</span></label>
                                <label className="checkboxLabel"><input type="checkbox" name="nuts" value="nuts" /><span>Nuts</span></label>
                                

                                {/* <label className="checkboxLabel"><input type="checkbox" name="vegetarian" value="vegetarian" /><span>Vegetarian</span></label>
                                <label className="checkboxLabel"><input type="checkbox" name="vegan" value="vegan" /><span>Vegan</span></label> */}

                                {/* <label htmlFor="field6"><span>Message <span className="required">*</span></span><textarea name="field6" className="textarea-field"></textarea></label> */}
                                <input type="submit" value="Sign Up" />
                                <p className="forgot" align="center" onClick={(e) => this.hideRegisterForm(e)} ><a className="link" href="#">Already have an account? Login</a></p>
                            </fieldset>
                        </form>
                    </div>
                </div>
            );
            
        }
        

    }

    // registerClicked: If passwords match, calls parent's register function. Otherwise, displays error message. 
    registerClicked(e) {
        e.preventDefault();
        let form = e.target;
        // console.log("---signin info---")
        // console.log(typeof(form.name.value));
        // console.log(typeof(form.email.value));
        // console.log(typeof(form.password.value));
        // console.log(typeof(form.confirmPassword.value));
        // console.log("---weight---");
        // console.log(typeof(parseFloat(form.weight.value)));
        // console.log("---height---")
        // console.log(typeof(parseInt(form.heightfeet.value)));
        // console.log(typeof(parseInt(form.heightinches.value)));
        // console.log("---gender---");
        // console.log(typeof(form.gender.value));
        // console.log("---checkboxes---");
        // console.log(typeof(form.dairy.checked));    // returns true if checked, false otherwise
        // console.log(typeof(form.nuts.checked));
        // console.log(typeof(form.eggs.checked));
        // console.log(typeof(form.gluten.checked));
        // console.log(typeof(form.vegetarian.checked));
        // console.log(typeof(form.vegan.checked));
        console.log("---signin info---")
        console.log(form.name.value);
        console.log(form.email.value);
        console.log(form.password.value);
        console.log(form.confirmPassword.value);
        console.log("---weight---");
        console.log(form.weight.value);
        console.log("---height---")
        console.log(form.heightfeet.value);
        console.log(form.heightinches.value);
        console.log("---gender---");
        console.log(form.gender.value);
        // console.log(e.target.dairy);
        console.log("---checkboxes---");
        console.log(form.dairy.checked);    // returns true if checked, false otherwise
        console.log(form.nuts.checked);
        console.log(form.egg.checked);
        console.log(form.gluten.checked);
        
        // console.log(form.vegetarian.checked);
        // console.log(form.vegan.checked);
        let userObj = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value, 
        }
        let info = {
            weight: parseFloat(form.weight.value),
            heightfeet: form.heightfeet.value,
            heightinches: form.heightinches.value,
            age: parseInt(form.age.value),
            gender: form.gender.value,
            dairy: form.dairy.checked,
            nuts: form.nuts.checked,
            egg: form.egg.checked,
            gluten: form.gluten.checked,
            wheat: form.wheat.checked,
            soybean: form.soybean.checked,
            // vegetarian: form.vegetarian.checked,
            // vegan: form.vegan.checked,

        }
        if (userObj.password === form.confirmPassword.value) {
            // let user = JSON.parse(localStorage.getItem('loggedinuser'));
            // console.log(user);
            console.log("Passwords match!");
            this.props.updateEmailAndPassword(userObj, info, false);  // login is false b/c we're registering
        } else {
            console.log(`Error: '${this.state.password}' does not match '${this.state.confirmPassword}'`);
            alert("Error: Passwords don't match");
        }

    }

    setEmail(value) {
        this.setState({ email: value }, function() {
            console.log(this.state);
        });
    }
    setPassword(value) {
        this.setState({ password: value }, function() {
            console.log(this.state);
        });
    }
    setConfirmPassword(value) {
        this.setState({ confirmPassword: value }, function () {
            console.log(this.state);
        });
    }

    // loginClicked: Sends the email and password to parent 
    loginClicked(event) {
        event.preventDefault();
        console.log(`this.email = ${this.state.email}`);
        console.log(`this.password = ${this.state.password}`);
        
        this.props.updateEmailAndPassword(this.state, null, true);    // login is true b/c we're logging in
    }
    
    // showRegisterForm: Updates the state, and the component will rerender with the register form showing
    showRegisterForm(event) {
        event.preventDefault();
        this.setState({ showRegisterPage: true });
    }
    // hideRegisterForm: Hides register form and shows login form
    hideRegisterForm(event) {
        event.preventDefault();
        this.setState({ showRegisterPage: false });
    }

    resetPassword(event) {
        event.preventDefault();
        firebase.auth().sendPasswordResetEmail(document.getElementById("useremail").value)
              .then(() => {
                alert("password reset email sent")
              })
              .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
                // ..
              });
    }

    // componentDidMount() {
       
    // }


}

export default LoginPage;