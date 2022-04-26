import React, { Component } from 'react'
import './RecurringWorkoutDetails.css';
import firebase from "../fire";
import { db } from '../fire';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

class RecurringWorkoutDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentWorkoutId: -1,
        }
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
                        if (doc2.data().name === this.props.workout) {
                            this.setCurrentWorkoutId(doc2.id).then(response => {
                                resolve("id retrieved successfully");
                            }).catch();
                        }
                    })
                })
            }
        })
    }

    saveRecurringWorkout = (event) => {
        event.preventDefault();
        this.getWorkoutID().then(id => {
         if (this.state.currentWorkoutId !== -1) {
            let user = JSON.parse(localStorage.getItem('loggedinuser'));
            if (user !== null) {
                let uid = user.uid;
                db.collection("users").doc(uid).get().then((doc2) => {
                    let data = doc2.data();
                    var recurring_workout = JSON.parse(data.recurring_workout);
                    var reps = event.target.numberOfReps.value;
                    var weight = event.target.workoutWeight.value;
                    var sets = event.target.numberOfSets.value;
                    var checkedDays=[];
                    if (event.target.Monday.checked) checkedDays.push("Monday");
                    if (event.target.Tuesday.checked) checkedDays.push("Tuesday");
                    if (event.target.Wednesday.checked) checkedDays.push("Wednesday");
                    if (event.target.Thursday.checked) checkedDays.push("Thursday");
                    if (event.target.Friday.checked) checkedDays.push("Friday");
                    if (event.target.Saturday.checked) checkedDays.push("Saturday");
                    if (event.target.Sunday.checked) checkedDays.push("Sunday");

                    if (checkedDays.length === 0) {
                        alert("Please check a day");
                        return;
                    }
                    
                    var currWorkout = {
                        id: this.state.currentWorkoutId,
                        weight: weight,
                        reps: reps,
                        sets: sets,
                        completed: false
                    }
                    for (var i=0; i<checkedDays.length; i++) {
                        var goahead = true;
                        for (var j=0; j<recurring_workout[checkedDays[i]].length; j++) {
                            if (recurring_workout[checkedDays[i]][j].id === currWorkout.id) {
                                alert("This workout is already recurring for " + checkedDays[i] + " so it will now be updated with the new information that was input");
                                goahead = false;
                                recurring_workout[checkedDays[i]][j].weight = currWorkout.weight;
                                recurring_workout[checkedDays[i]][j].sets = currWorkout.sets;
                                recurring_workout[checkedDays[i]][j].reps = currWorkout.reps;
                            }
                        }
                        if (goahead) {
                            recurring_workout[checkedDays[i]].push(currWorkout)
                        }
                    }
                        const userRef = db.collection("users").doc(uid);
                        console.log(JSON.stringify(recurring_workout));

                        alert("Recurring Workout has been added for Checked Days if it wasn't already there");
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
                    <p className="workoutDetailsTitle">{this.props.workout}</p>
                    <form onSubmit={this.saveRecurringWorkout}>
                        <TextField variant="standard" label="Sets" type="text" id="numberOfSets" name="numberOfSets" required/>
                        <TextField variant="standard" label="Reps" id="numberOfReps" name="numberOfReps" required/>
                        <TextField variant="standard" label="Weight" id="workoutWeight" name="workoutWeight" required/><br/><br/>
                        <input type="checkbox" id="Monday" name="Monday" value="Monday"/>
                        <label htmlFor="Monday"> Monday</label><br/>
                        <input type="checkbox" id="Tuesday" name="Tuesday" value="Tuesday"/>
                        <label htmlFor="Tuesday"> Tuesday</label><br/>
                        <input type="checkbox" id="Wednesday" name="Wednesday" value="Wednesday"/>
                        <label htmlFor="Wednesday"> Wednesday</label><br/>
                        <input type="checkbox" id="Thursday" name="Thursday" value="Thursday"/>
                        <label htmlFor="Thursday"> Thursday</label><br/>
                        <input type="checkbox" id="Friday" name="Friday" value="Friday"/>
                        <label htmlFor="Friday"> Friday</label><br/>
                        <input type="checkbox" id="Saturday" name="Saturday" value="Saturday"/>
                        <label htmlFor="Saturday"> Saturday</label><br/>
                        <input type="checkbox" id="Sunday" name="Sunday" value="Sunday"/>
                        <label htmlFor="Sunday"> Sunday</label><br/><br></br>
                        <Button type="submit" id="workoutSubmitBtn2" size="small" value="done">Done</Button>
                    </form>
                </div>
            </>
        );
    }
}

export default RecurringWorkoutDetails;