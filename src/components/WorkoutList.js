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
        }
    }

    addWorkout = (workout) => {
        this.setState({detailDisplay : !this.state.detailDisplay, addedWorkout : workout})
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
                        {this.state.detailDisplay && <WorkoutDetails date={this.state.date} workout={this.state.addedWorkout} closeDetail={this.closeDetail}/>}
                    </ul>
                </div>
            </>
        );

    }
}

export default WorkoutList;