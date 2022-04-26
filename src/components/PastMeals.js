import React, { Component } from 'react'
import './PastMeals.css';
import firebase from "../fire";
import { db } from '../fire';
import Button from '@material-ui/core/Button';


class PastMeals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pastmeals: null,
            // pastmeals: {
            //     "03/23/2022": [
            //       "Fried Eggs",
            //       "Half & Half"
            //     ],
            //     "03/22/2022": [
            //       "Deliciousness",
            //       "Strawberries"
            //     ]
            // },
            
        }
        
        this.fetchPastMeals = this.fetchPastMeals.bind(this);

    }

    render() {
        // console.log("inside render past meals");
        let pastMeals = this.state.pastmeals;
        // alert(this.props.date);
        // this.fetchPastMeals(this.props.date);
        if (pastMeals != null || pastMeals != undefined) {
            // this.fetchPastMeals(this.props.date);
            // alert(pastMeals);
            let mealElements = pastMeals.map((mealObject, index) =>
                <div className="past-meal-element" key={index}>
                    <p> {mealObject.mealname}: {mealObject.mealcalories} Calories</p>
                    
                </div>
            );

            return(
                <>
                    <div className="pastMealsContainer">
                    <h2 className="pastMealsHeader">Your Past Meals for {this.props.date}</h2>
                        {mealElements}
                    </div>
                </>
            );

        } else {
            console.log(`date is = ${this.props.date}`);
            this.fetchPastMeals(this.props.date);
            return (
                <div className="pastMealsContainer">
                    <h2 className="pastMealsHeader">Your Past Meals for {this.props.date}</h2>
                    <div>You have no meals for this date.</div>
                </div>
            );
        }
        
    }

    componentDidMount() {
        // this.fetchPastMeals(this.props.date);
        // console.log("props.date = " + this.props.date);
    }

    /**
     * Gets all the meals user ate on the given date.
     * @param {String} date ("MM/DD/YYYY")
     */
    fetchPastMeals(date) {
        // alert(date);
        if (firebase.auth().currentUser !== null) {
            let uid = firebase.auth().currentUser.uid;
            db.collection("users").doc(uid).get().then((doc) => {
                if (doc !== null) {
                    var pastMealsArr = JSON.parse(doc.data().past_meals);
                    console.log(pastMealsArr);
                    var mealArrayObject=[];
                    if (pastMealsArr[date] != null || pastMealsArr[date] != undefined) {
                        for (var i=0; i<pastMealsArr[date].length; i++) {
                            db.collection("meals").doc(pastMealsArr[date][i]).get().then((doc)=>{
                                if (doc != null) {
                                    var data = doc.data();
                                    var mealname = data.name;
                                    var mealcalories = data.nutrition.calories;
                                
                                    let mealObject = {mealname: mealname, mealcalories: mealcalories};
                                    mealArrayObject.push(mealObject);
                                    this.setState({
                                        pastmeals: mealArrayObject,
                                    }, function() {
                                        console.log("Just set pastmeals");
                                    });
                                }
                            })
                        }
                        
                    }
                    
                }
                
            });
        }
    }

    // nameOfMeal() {
    //     let array = this.state.pastmeals;
    //     for (var i=0; i<array.length; i++) {
    //         db.collectin("meals").doc(array[i]).get().then((doc)=>{
    //             if (doc != null) {
    //                 var meal = doc.data().name;
    //                 var mealcalories = doc.data().calories;

    //             }
    //         })
    //     }
    
    // }



}

export default PastMeals;