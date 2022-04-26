import React, { Component } from 'react'
import './WorkoutDetails.css';
import firebase from "../fire";
import { db } from '../fire';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

class WorkoutDetails extends Component {
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

    saveWorkout = (event) => {
        let date = this.props.date;
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
                        if (!(date in workout_hist)){
                            workout_hist[date] = []
                        }
                        
                        var currWorkout = {
                            id: this.state.currentWorkoutId,
                            weight: weight,
                            reps: reps,
                            sets: sets,
                            completed: false
                        }
                        let isUnique = true;
                        for(let i = 0; i < workout_hist[date].length; i++) {
                            // console.log(workout_hist[date].id + " - " + currWorkout.id);
                            if (workout_hist[date][i].id === currWorkout.id && (workout_hist[date][i].sets !== currWorkout.sets || workout_hist[date][i].reps !== currWorkout.reps || workout_hist[date][i].weight !== currWorkout.weight)) {
                                isUnique = false;
                                workout_hist[date][i].sets = currWorkout.sets;
                                workout_hist[date][i].reps = currWorkout.reps;
                                workout_hist[date][i].weight = currWorkout.weight;
                                workout_hist[date][i].completed = false;
                                alert("Workout already exists, we have updated your information.");
                            }
                            else if (workout_hist[date][i].id === currWorkout.id) {
                                isUnique = false;
                                alert("Workout already exists.")
                            }
                        }
                        if(isUnique) {
                            workout_hist[date].push(currWorkout);
                        }
                        const userRef = db.collection("users").doc(uid);
                        console.log(JSON.stringify(workout_hist));
                        
                        return userRef.update({
                            workout_hist: JSON.stringify(workout_hist)
                        }).then(() => {
                            this.props.closeDetails();
                            alert("Workout saved!");    // only alert after db has been updated
                        });
                        
                    })
                }
            }
        }).catch(err => console.log(err))
    }

    render() {
        return (
            <>
                <div className="workoutDetails">
                    <p className="workoutDetailsTitle">{this.props.workout}</p>
                    <form onSubmit={this.saveWorkout}>
                        <TextField variant="standard" label="Sets" type="text" id="numberOfSets" name="numberOfSets" required/>
                        <TextField variant="standard" label="Reps" id="numberOfReps" name="numberOfReps" required/>
                        <TextField variant="standard" label="Weight" id="workoutWeight" name="workoutWeight" required/><br/><br/><br></br>
                        <Button type="submit" id="workoutSubmitBtn">Save Workout</Button>
                    </form>
                </div>
            </>
        );
    }
}

export default WorkoutDetails;