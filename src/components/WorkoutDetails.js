import React, { Component } from 'react'
import './WorkoutDetails.css';
import firebase from "../fire";
import { db } from '../fire';
import WOCheckbox from './WOCheckbox'; 
import Button from '@material-ui/core/Button';
import { doc, updateDoc } from "firebase/firestore";

// import Button from '@material-ui/core/Button';

class WorkoutDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workout: this.props.workout,
            date: this.props.date,
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

    saveWorkout = (event) => {
        event.preventDefault();
        this.getWorkoutID().then(id => {
            if (this.state.currentWorkoutId !== -1) {
                if (firebase.auth().currentUser !== null) {
                    let uid = firebase.auth().currentUser.uid;
                    db.collection("users").doc(uid).get().then((doc2) => {
                        var workout_hist = JSON.parse(doc2.data().workout_hist);
                        console.log("first", workout_hist)
                        var reps = event.target.elements.numberOfReps.value
                        var weight = event.target.elements.workoutWeight.value
                        var sets = event.target.elements.numberOfSets.value
                        if (!(this.state.date in workout_hist)){
                            workout_hist[this.state.date] = []
                        }
                        
                        var currWorkout = {
                            id: this.state.currentWorkoutId,
                            weight: weight,
                            reps: reps,
                            sets: sets,
                            completed: false
                        }
                        let isUnique = true;
                        for(let i = 0; i < workout_hist[this.state.date].length; i++) {
                            // console.log(workout_hist[this.state.date].id + " - " + currWorkout.id);
                            if (workout_hist[this.state.date][i].id === currWorkout.id && (workout_hist[this.state.date][i].sets !== currWorkout.sets || workout_hist[this.state.date][i].reps !== currWorkout.reps || workout_hist[this.state.date][i].weight !== currWorkout.weight)) {
                                isUnique = false;
                                workout_hist[this.state.date][i].sets = currWorkout.sets;
                                workout_hist[this.state.date][i].reps = currWorkout.reps;
                                workout_hist[this.state.date][i].weight = currWorkout.weight;
                                workout_hist[this.state.date][i].completed = false;
                                alert("Workout already exists, we have updated your information.");
                            }
                            else if (workout_hist[this.state.date][i].id === currWorkout.id) {
                                isUnique = false;
                                alert("Workout already exists.")
                            }
                        }
                        if(isUnique) {
                            workout_hist[this.state.date].push(currWorkout);
                            alert("Saved");
                        }
                        const userRef = db.collection("users").doc(uid);
                        console.log(JSON.stringify(workout_hist));
                        // Set the "capital" field of the city 'DC'
                        return userRef.update({
                            workout_hist: JSON.stringify(workout_hist)
                        });
                    })
                }
                
            }
        }).then(resp => {this.props.closeDetail();})
        .catch(err => console.log(err))
    }

    render() {
        return (
            <>
                <div className="workoutDetails">
                    <p className="workoutDetailsTitle">{this.state.workout}</p>
                    <form onSubmit={this.saveWorkout}>
                        <input type="text" id="numberOfSets" name="numberOfSets" placeholder="sets"/>
                        <input type="text" id="numberOfReps" name="numberOfReps" placeholder="reps"/>
                        <input type="text" id="workoutWeight" name="workoutWeight" placeholder="weight"/><br></br><br></br>
                        <Button type="submit" id="workoutSubmitBtn">Save Workout</Button>
                    </form>
                </div>
            </>
        );
    }
}

export default WorkoutDetails;