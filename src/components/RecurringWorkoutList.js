import React, { Component } from 'react'
import './addWorkout.css';
import firebase from "../fire";
import { db } from '../fire';
import Button from '@material-ui/core/Button';
import RecurringWorkoutDetails from './RecurringWorkoutDetails';
import './RecurringWorkoutList.css';

class RecurringWorkoutList extends Component {
    constructor(props) {
        super(props);   // props: option, date
        this.state = {
            workouts: null,
            addedWorkout: null,
        }
        this.addWorkout = this.addWorkout.bind(this);
        this.getWorkoutsByBodyParts = this.getWorkoutsByBodyParts.bind(this);
        this.closeDetails = this.closeDetails.bind(this);
    }

    addWorkout = (workoutName) => {
        this.setState({addedWorkout : workoutName});
    }

    getWorkoutsByBodyParts = () => {
        var data;
        let user = JSON.parse(localStorage.getItem('loggedinuser'));
        if (user !== null) {
            db.collection("workouts").get().then(querySnapshot => {
                var tempWorkouts = {
                    chests: new Set(),
                    legs: new Set(),
                    biceps: new Set(),
                    triceps: new Set(),
                    shoulders: new Set(),
                    back: new Set()
                }
                querySnapshot.docs.forEach(doc => {
                    data = doc.data();
                    tempWorkouts[data.type].add(data.name);
                });

                this.setState({workouts: tempWorkouts});
            });
        }
    }

    closeDetails() {
        this.setState({addedWorkout: null});
    }

    componentDidMount() {
        if (this.state.workouts === null) {
            this.getWorkoutsByBodyParts();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.option !== this.props.option) this.closeDetails();
    }

    render() {
        if (this.state.workouts === null) {
            return (<div></div>);
        } else {
            var workouts = Array.from(this.state.workouts[this.props.option]);
            let workoutElements = workouts.map(workoutName => (
                <Button key={workoutName} onClick={() => this.addWorkout(workoutName)} size="small" id="add2">{workoutName}</Button>
            ));
            return (
                <>
                    <div className="workoutList2">
                        {workoutElements}
                    </div>
                    {this.state.addedWorkout && <RecurringWorkoutDetails date={this.props.date} workout={this.state.addedWorkout}/>}
                </>
            );
        }  

    }
}

export default RecurringWorkoutList;