import React, { Component } from 'react';
import './TodaysMeals.css';
import firebase from "../fire";
import { db } from '../fire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';


class TodaysMeals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mealsArray: null,
            loggedinuser: null,
            // loggedinuser: JSON.parse(localStorage.getItem('loggedinuser')),
        }
        // Bind functions to self
        this.fetchUserMeals = this.fetchUserMeals.bind(this);
        // Detects when user's login status changes and stores user info in local storage
        firebase.auth().onAuthStateChanged(user => {
            user
                ? localStorage.setItem('loggedinuser', JSON.stringify(user))
                : localStorage.removeItem('loggedinuser');
        });


    }


    render() {

        // Check if meals array is already set. If it is, display meal names, if not, fetch the 
        //  data from db and return a temporary string until fetching is done. 
        var dob = new Date();
        var dobArr = dob.toDateString().split(' ');
        var dobFormat = dobArr[2] + ' ' + dobArr[1] + ' ' + dobArr[3];
        if (this.state.mealsArray !== null) {
            let arr = this.state.mealsArray;
            let mealElements = arr.map((meal, index) =>
                // Pass the meal id to removeFromPlate function so we can remove that id from user's meals
                <div key={index} id="usermeals">
                    <div className="user-meal">
                        {meal.name}
                        <FontAwesomeIcon icon={faWindowClose}
                            onClick={this.removeFromPlate.bind(this, meal.id)}
                            className="close-icon" />
                    </div>
                    <br></br>
                </div>
            );

            console.log(mealElements);
            return (
                <div>
                    <h1 id="mealsheader">Meals for {dobFormat} </h1> <br></br>
                    <div>{mealElements}</div>
                </div>
            );
        } else {
            this.fetchUserMeals();
            return (
                <div><h1 id="mealsheader">Meals for {dobFormat} </h1> <br></br></div>
            );
        }

    }

    // componentWillUnmount() {
    //     localStorage.removeItem('loggedinuser');
    // }

    // Removes the meal id from user's meals list in 'todaysmeals' collection
    removeFromPlate(meal_id) {

        let user = JSON.parse(localStorage.getItem('loggedinuser'));    // get user from local storage
        console.log(user);
        if (user !== null) {
            // Remove the meal id from user's meals
            db.collection('todaysmeals').doc(user.uid).update({
                "meals": firebase.firestore.FieldValue.arrayRemove(meal_id)
            }).then(() => {
                // console.log(`Just removed ${meal_id} from ${user.email}'s plate`);
                this.props.removeFromPastMeals(user.uid, meal_id);
                
                this.setState({
                    mealsArray: null,
                });

            });
        }
    }

    // This fetches user meals from db and updates the state
    fetchUserMeals() {
        console.log("______Fetching user meals ____________");

        // Get reference to todaysmeals collection
        let collection = db.collection("todaysmeals");
        let mealsCollection = db.collection("meals");

        let user = JSON.parse(localStorage.getItem('loggedinuser'));    // get user from local storage
        console.log(user);
        if (user !== null) {
            let uid = user.uid;
            console.log(uid);
            // get list of today's meals for this user  
            collection.doc(uid).get().then((doc) => {

                let mealsArr = doc.data().meals;  // get meals array field of the entry in 'todaysmeals'
                console.log(`Data we got: ${mealsArr}`);
                var stateArray = [];    // temp array (will assign to state property afterward)
                // Get meal info from meals collection
                for (var i = 0; i < mealsArr.length; i++) {
                    let mealId = mealsArr[i];   // need to save it to be able to use it inside .then()
                    mealsCollection.doc(mealId).get().then((doc) => {

                        let obj = doc.data();

                        var mealObj = {
                            id: mealId,
                            name: obj.name, // string
                            // date: obj.date, // string (don't think we need it)   
                            nutrition: obj.nutrition    // map [string -> number]
                        }
                        // push() returns the new length of the array 
                        if (stateArray.push(mealObj) == mealsArr.length) {

                            this.setState({
                                mealsArray: stateArray,
                            }, function () {
                                console.log(" --- Just set 'mealsArray' ------");
                            });

                        }

                    });

                }

            });
        }


    }



}


export default TodaysMeals;