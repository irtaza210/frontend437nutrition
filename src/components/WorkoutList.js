import React, { Component } from 'react'
import './addWorkout.css';
import firebase from "../fire";
import { db } from '../fire';
import WOCheckbox from './WOCheckbox'; 
import Button from '@material-ui/core/Button';
import WorkoutDetails from './WorkoutDetails';
import './WorkoutList.css';

// import Button from '@material-ui/core/Button';

class WorkoutList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: this.props.option,
            date: this.props.date,
            workouts: {
                chests: new Set(),
                legs: new Set(),
                biceps: new Set(),
                triceps: new Set(),
                shoulders: new Set(),
                back: new Set()
            },
            detailDisplay: false,
            addedWorkout: 'none',
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
    getWorkoutID = (workout) => {
        return new Promise((resolve, reject) => {
            if (firebase.auth().currentUser !== null) {
                let uid = firebase.auth().currentUser.uid;
                db.collection("workouts").get().then(querySnapshot => {
                    querySnapshot.docs.forEach(doc2 => {
                        if (doc2.data().name === workout) {
                            this.setCurrentWorkoutId(doc2.id).then(response => {
                                resolve(doc2.id);
                            }).catch();
                        }
                    })
                })
            }
        })
    }
    /* Returns true if array contains JSON object with the passed value, false otherwise. */
    arrContains(arr, key, val) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i][key] === val) return true;
        }
        return false;
      }
    saveWorkout = (workout) => {
        let user = JSON.parse(localStorage.getItem('loggedinuser'));
        this.getWorkoutID(workout).then(id => {
            console.log(id);
            if (id !== null && id !== undefined) {
                if (user !== null) {
                    let uid = user.uid;
                    db.collection("users").doc(uid).get().then((doc2) => {
                        var workout_hist = JSON.parse(doc2.data().workout_hist);
                        // console.log("first", workout_hist)
                        var reps = 0
                        var weight = 0
                        var sets = 0
                        let date = this.state.date;
                        if (!(date in workout_hist)){
                            workout_hist[date] = []
                        }
                        let workoutsArr = workout_hist[date];

                        if(!this.arrContains(workoutsArr, "id", id)) {
                            console.log("-- NOT DUPLICATE, ADDING --");
                            var currWorkout = {
                                // id: this.state.currentWorkoutId,
                                id: id,
                                weight: weight,
                                reps: reps,
                                sets: sets,
                                completed: false
                            }
                            
                            workout_hist[this.state.date].push(currWorkout)
                            const userRef = db.collection("users").doc(uid);
                            // console.log(JSON.stringify(workout_hist));
                            // Set the "capital" field of the city 'DC'
                            
                            userRef.update({
                                workout_hist: JSON.stringify(workout_hist)
                            }).then(() => {
                                alert("Added");
                            });
                            
                        } else {
                            console.log("!!! DUPLICATE, DO NOT ADD !!!");
                        }
                        
                    })
                }
                
            }
        }).then(resp => {this.closeDetail();})
        .catch(err => console.log(err))
    }

    addWorkout = (workout) => {
        // this.setState({detailDisplay : !this.state.detailDisplay, addedWorkout : workout})
        // this.saveWorkout(workout)
        this.setState({detailDisplay : !this.state.detailDisplay}, function() {
            this.saveWorkout(workout);
        });
        
        // this.setState({addedWorkout : workout})
    }

    getWorkoutsByBodyParts = () => {
        var data;
        if (firebase.auth().currentUser !== null) {
            let uid = firebase.auth().currentUser.uid;
            db.collection("workouts").get().then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    data = doc.data();
                    if(data.type === "chests") {
                        this.state.workouts.chests.add(data.name);
                    }else if(data.type === "legs") {
                        this.state.workouts.legs.add(data.name);
                    }else if(data.type === "biceps") {
                        this.state.workouts.biceps.add(data.name);
                    }else if(data.type === "triceps") {
                        this.state.workouts.triceps.add(data.name);
                    }else if(data.type === "shoulders") {
                        this.state.workouts.shoulders.add(data.name);
                    }else if(data.type === "back") {
                        this.state.workouts.back.add(data.name);
                    }
                })
            });
        }
    }

    closeDetail = () => {
        this.setState({
            detailDisplay: false
        })
    }

    render() {
        var workouts;
        this.getWorkoutsByBodyParts("shoulders")
        if (this.props.option == "chests") {
            workouts = Array.from(this.state.workouts.chests);
        } else if (this.props.option == "legs") {
            workouts = Array.from(this.state.workouts.legs);
        } else if (this.props.option == "biceps") {
            workouts = Array.from(this.state.workouts.biceps);
        } else if (this.props.option == "triceps") {
            workouts = Array.from(this.state.workouts.triceps);
        } else if (this.props.option == "shoulders") {
            workouts = Array.from(this.state.workouts.shoulders);
        } else if (this.props.option == "back") {
            workouts = Array.from(this.state.workouts.back);
        }
        return (
            <>
                <div className="workoutList">
                    <ul>
                        {workouts.map(workout => (
                            <>
                                <li key={workout} id="workoutListElement">{workout}</li>
                                <Button size="small" onClick={() => this.addWorkout(workout)} id="addSmall">Add</Button><br></br><br></br>
                                
                            </>
                        ))}
                        {/* {this.state.detailDisplay && <WorkoutDetails date={this.state.date} workout={this.state.addedWorkout} closeDetail={this.closeDetail}/>} */}
                    </ul>
                </div>
            </>
        );

    }
}

export default WorkoutList;