import React, { Component } from 'react'
import './RecurringWorkoutDetails.css';
import firebase from "../fire";
import { db } from '../fire';
import WOCheckbox from './WOCheckbox'; 
import Button from '@material-ui/core/Button';
import { doc, updateDoc } from "firebase/firestore";
// import TextField from '@mui/material/TextField';
import TextField from "@material-ui/core/TextField";
// import Button from '@material-ui/core/Button';

class RecurringWorkoutDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workout: this.props.workout,
            date: this.props.date,
            currentWorkoutId: -1,
        }
        this.arrContains = this.arrContains.bind(this);
    }
    
    // takes the workoutId and sets currentWorkoutId in state to it.
    setCurrentWorkoutId = (id) => {
        return new Promise((resolve, reject) => {
            this.setState({currentWorkoutId : id})
            this.state.currentWorkoutId !== -1 ? resolve("state updated successfully") : reject("state update failed");
        })
        
    }

    // takes the workout name as a string from the state and retrieves the correct ID of the workout
    // from firestore.
    getWorkoutID = () => {
        return new Promise((resolve, reject) => {
            if (firebase.auth().currentUser !== null) {
                let uid = firebase.auth().currentUser.uid;
                db.collection("workouts").get().then(querySnapshot => {
                    querySnapshot.docs.forEach(doc2 => {
                        if (doc2.data().name === this.state.workout) {
                            this.setCurrentWorkoutId(doc2.id).then(response => {
                                resolve("id retrieved successfully");
                            }).catch();
                        }
                    })
                })
            }
        })
    }

    // saveWorkout = (event) => {
    //     event.preventDefault();
    //     this.getWorkoutID().then(id => {
    //         if (this.state.currentWorkoutId !== -1) {
    //             if (firebase.auth().currentUser !== null) {
    //                 let uid = firebase.auth().currentUser.uid;
    //                 db.collection("users").doc(uid).get().then((doc2) => {
    //                     var workout_hist = JSON.parse(doc2.data().workout_hist);
    //                     console.log("first", workout_hist)
    //                     var reps = event.target.elements.numberOfReps.value
    //                     var weight = event.target.elements.workoutWeight.value
    //                     var sets = event.target.elements.numberOfSets.value
    //                     if (!(this.state.date in workout_hist)){
    //                         workout_hist[this.state.date] = []
    //                     }
                        
    //                     var currWorkout = {
    //                         id: this.state.currentWorkoutId,
    //                         weight: weight,
    //                         reps: reps,
    //                         sets: sets,
    //                         completed: false
    //                     }
                        
    //                     workout_hist[this.state.date].push(currWorkout)
    //                     const userRef = db.collection("users").doc(uid);
    //                     console.log(JSON.stringify(workout_hist));
    //                     // Set the "capital" field of the city 'DC'
    //                     return userRef.update({
    //                         workout_hist: JSON.stringify(workout_hist)
    //                     });
    //                 })
    //             }
    //         }
    //     }).catch(err => console.log(err))
    // }
/* Returns true if array contains JSON object with the passed value, false otherwise. */
    arrContains(arr, key, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] === val) return true;
        }
        return false;
    }
    saveRecurringWorkout = (event) => {
        event.preventDefault();
        this.getWorkoutID().then(id => {
         if (this.state.currentWorkoutId !== -1) {
            if (firebase.auth().currentUser !== null) {
                let uid = firebase.auth().currentUser.uid;
                db.collection("users").doc(uid).get().then((doc2) => {
                    console.log(doc2.data().recurring_workout);
                    var recurring_workout = JSON.parse(doc2.data().recurring_workout);
                    console.log("second", recurring_workout);
                    var reps = event.target.elements.numberOfReps.value;
                    var weight = event.target.elements.workoutWeight.value;
                    var sets = event.target.elements.numberOfSets.value;
                    var checkedDays=[]
                    if (document.getElementById("Monday").checked) {
                        checkedDays.push("Monday");
                        
                    }
                    if (document.getElementById("Tuesday").checked) {
                        checkedDays.push("Tuesday");
                    }
                    if (document.getElementById("Wednesday").checked) {
                        checkedDays.push("Wednesday");
                        
                    }
                    if (document.getElementById("Thursday").checked) {
                        checkedDays.push("Thursday");
                    }
                    if (document.getElementById("Friday").checked) {
                        checkedDays.push("Friday");
                    }
                    if (document.getElementById("Saturday").checked) {
                        checkedDays.push("Saturday");
                    }
                    if (document.getElementById("Sunday").checked) {
                        checkedDays.push("Sunday");
                    }
                    
                    
                    var currWorkout = {
                            id: this.state.currentWorkoutId,
                            weight: weight,
                            reps: reps,
                            sets: sets,
                            completed: false
                    }
                    for (var i=0; i<checkedDays.length; i++) {
                        let array = recurring_workout[checkedDays[i]];
                        if (!this.arrContains(array, "id", currWorkout.id)) {
                            recurring_workout[checkedDays[i]].push(currWorkout);
                        }
                    }
                        const userRef = db.collection("users").doc(uid);
                        console.log(JSON.stringify(recurring_workout));
                        // Set the "capital" field of the city 'DC'
                        alert("Added");
                        return userRef.update({
                            recurring_workout: JSON.stringify(recurring_workout)
                        });                   
                    })
                }
            }
        }).catch(err => console.log(err))
    }


    render() {
        return (
            <>
                <div className="workoutDetails2">
                    <p className="workoutDetailsTitle">{this.state.workout}</p>
                    <form onSubmit={this.saveRecurringWorkout}>
                        <div id ="no">
                        <TextField variant="standard" label="Sets" type="text" id="numberOfSets" name="numberOfSets"/>
                        <TextField variant="standard" label="Reps" id="numberOfReps" name="numberOfReps"/>
                        <TextField variant="standard" label="Weight" id="workoutWeight" name="workoutWeight"/><br/><br/>
                        </div>
                        <input type="checkbox" id="Monday" name="Monday" value="Monday"/>
                        <label for="Monday"> Monday</label><br/>
                        <input type="checkbox" id="Tuesday" name="Tuesday" value="Tuesday"/>
                        <label for="Tuesday"> Tuesday</label><br/>
                        <input type="checkbox" id="Wednesday" name="Wednesday" value="Wednesday"/>
                        <label for="Wednesday"> Wednesday</label><br/>
                        <input type="checkbox" id="Thursday" name="Thursday" value="Thursday"/>
                        <label for="Thursday"> Thursday</label><br/>
                        <input type="checkbox" id="Friday" name="Friday" value="Friday"/>
                        <label for="Friday"> Friday</label><br/>
                        <input type="checkbox" id="Saturday" name="Saturday" value="Saturday"/>
                        <label for="Saturday"> Saturday</label><br/>
                        <input type="checkbox" id="Sunday" name="Sunday" value="Sunday"/>
                        <label for="Sunday"> Sunday</label><br/><br></br>
                        <Button type="submit" id="workoutSubmitBtn2" size="small" value="done">Done</Button>
                    </form>
                </div>
            </>
        );
    }
}

export default RecurringWorkoutDetails;