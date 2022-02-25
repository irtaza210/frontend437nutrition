import React, { Component } from 'react';
// import logo from '../images/app_logo.png';
import './Settings.css';
import firebase from "../fire";
import { db } from '../fire';
import Checkbox from "@material-ui/core/Checkbox";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            email: null,
            age: null,
            weight: null,
            heightfeet: null,
            heightinches: null,
            gender: null,
            dietRestrictions: null,
        }

        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.updateClicked = this.updateClicked.bind(this);

        firebase.auth().onAuthStateChanged(user => {
            user
                ? localStorage.setItem('loggedinuser', JSON.stringify(user))
                : localStorage.removeItem('loggedinuser');
        });
    }

    render() {

        if (this.state.dietRestrictions !== null) {
            let name = this.state.name;
            let email = this.state.email;
            let age = this.state.age;
            let weight = this.state.weight;
            let heightfeet = this.state.heightfeet;
            let heightinches = this.state.heightinches;
            let gender = this.state.gender;
            let diet = this.state.dietRestrictions;
            
            return (
                <div>
                    <div className="form-style-3">
                        <form onSubmit={(e) => this.updateClicked(e)}>
                            {/* Profile info (cannot update)  */}
                            <fieldset><legend>Your Profile</legend>
                                <label htmlFor="name"><span>Name </span><input type="text" className="input-field" name="name" value={name} readOnly /></label>
                                <label htmlFor="email"><span>Email </span><input type="email" className="input-field" name="email" value={email} readOnly /></label>
                            </fieldset>

                            {/* User health info (can update) */}
                            <fieldset><legend>Health Info</legend>
                                <label htmlFor="age"><span>Age </span><input type="number" className="input-field" name="age" min="0" defaultValue={age} /></label>
                                <label htmlFor="weight"><span>Weight </span><input type="number" className="input-field" name="weight" min="0" defaultValue={weight} /></label>
                                <label id="heightLabel">
                                    <span>Height </span>
                                    <div id="heightinputs">
                                        <input id="heightfeet" type="number" className="input-field" name="heightfeet" min="0" max="10" defaultValue={heightfeet} />ft
                                        <input id="heightinches" type="number" className="input-field" name="heightinches" min="0" max="11" defaultValue={heightinches} />in
                                    </div>

                                </label>
                                {/* <label id="heightfeet"> <span>ft </span> <input type="number" className="input-field" name="heightfeet" min="0" max="10" /> </label>
                                    <label id="heightinches"> <span>in<span> </span></span><input type="number" className="input-field" name="heightinches" min="0" max="11" /> </label> */}

                                {/* Dropdown for gender */}
                                <label htmlFor="gender"><span>Gender</span>
                                    <select name="gender" className="select-field" defaultValue={gender}>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="other">Other</option>
                                    </select>
                                </label>
                                {/* Checkboxes for dietary restrictions: */}
                                {/* <Checkbox></Checkbox> */}
                                <label id="dietLabel">Allergies:</label>
                                {/* For each checkbox, if the user has this restriction, display it as checked. */}
                                <label className="checkboxLabel"> 
                                    {diet.dairy ? <input type="checkbox" name="dairy" value="dairy" defaultChecked /> : <input type="checkbox" name="dairy" value="dairy" />} <span>Dairy</span>
                                </label>
                                <label className="checkboxLabel">
                                    {diet.egg ? <input type="checkbox" name="egg" value="egg" defaultChecked /> : <input type="checkbox" name="egg" value="egg" />} <span>Egg</span>
                                </label>
                                <label className="checkboxLabel">
                                    {diet.wheat ? <input type="checkbox" name="wheat" value="wheat" defaultChecked /> : <input type="checkbox" name="wheat" value="wheat" />} <span>Wheat</span>
                                </label>
                                <label className="checkboxLabel">
                                    {diet.soybean ? <input type="checkbox" name="soybean" value="soybean" defaultChecked /> : <input type="checkbox" name="soybean" value="soybean" />} <span>Soybean</span>
                                </label>
                                <label className="checkboxLabel">
                                    {diet.gluten ? <input type="checkbox" name="gluten" value="gluten" defaultChecked /> : <input type="checkbox" name="gluten" value="gluten" />} <span>Gluten</span>
                                </label>
                                <label className="checkboxLabel">
                                    {diet.nuts ? <input type="checkbox" name="nuts" value="nuts" defaultChecked /> : <input type="checkbox" name="nuts" value="nuts" /> } <span>Nuts</span>
                                </label>
                                {/* <label className="checkboxLabel">
                                    {diet.vegetarian ? <input type="checkbox" name="vegetarian" value="vegetarian" defaultChecked /> : <input type="checkbox" name="vegetarian" value="vegetarian" />} <span>Vegetarian</span>
                                    </label>
                                <label className="checkboxLabel">
                                    {diet.vegan ? <input type="checkbox" name="vegan" value="vegan" defaultChecked /> : <input type="checkbox" name="vegan" value="vegan" />} <span>Vegan</span>
                                </label> */}

                                <input type="submit" value="Update" />
                                {/* When reset clicked, fields reset to original default values (not imp) */}
                                {/* <input type="reset" value="Reset" /> */}
                            
                            </fieldset>
                        </form>
                    </div>
                </div>
            );
        } else {
            this.fetchUserInfo();
            return (
                <div>Loading...</div>
            );
        }




    }

    updateClicked(e) {
        e.preventDefault();
        let age = e.target.elements.age.value;
        let weight = e.target.elements.weight.value;
        let heightfeet = e.target.elements.heightfeet.value;
        let heightinches = e.target.elements.heightinches.value;
        let gender = e.target.elements.gender.value;
        let dairy = e.target.elements.dairy.checked;
        let egg = e.target.elements.egg.checked;
        let wheat = e.target.elements.wheat.checked;
        let soybean = e.target.elements.soybean.checked;
        let gluten = e.target.elements.gluten.checked;
        let nuts = e.target.elements.nuts.checked;
        
        
        // let vegetarian = e.target.elements.vegetarian.checked;
        // let vegan = e.target.elements.vegan.checked;
       
        let user = JSON.parse(localStorage.getItem('loggedinuser'));

        if (user !== null) {

            db.collection("users").doc(user.uid).update({
                age: age,
                weight: weight,
                heightfeet: heightfeet,
                heightinches: heightinches,
                gender: gender,
                dairy: dairy,
                egg: egg,
                wheat: wheat,
                soybean: soybean,
                gluten: gluten,
                nuts: nuts,
                // vegetarian: vegetarian,
                // vegan: vegan,
            }).then(() => {
                console.log("Updated user info");
                // Rerender this component with updated info:
                this.forceUpdate();
            });
        }
        
    }

    // Fetches user measurements and dietary restrictions info
    fetchUserInfo() {
        let user = JSON.parse(localStorage.getItem('loggedinuser'));

        if (user !== null) {
            let uid = user.uid;
            console.log(uid);

            db.collection("users").doc(uid).get().then((doc) => {
                let data = doc.data();
                console.log(data);
                
                let diet = {    // dietary restrictions info
                    dairy: data.dairy,
                    egg: data.egg,
                    wheat: data.wheat,
                    soybean: data.soybean,
                    gluten: data.gluten,
                    nuts: data.nuts,
                    // vegetarian: data.vegetarian,
                    // vegan: data.vegan,
                }

                this.setState({
                    name: data.name,    // string
                    email: data.email,  // string
                    gender: data.gender,    // string
                    age: data.age,      // number
                    weight: data.weight,    // number
                    heightfeet: data.heightfeet,    // number
                    heightinches: data.heightinches,    // number
                    dietRestrictions: diet,     // object
                    
                }, function () {
                    console.log("--- Finished setting user info ---");
                });

            });
        }
    }



}

export default Settings;