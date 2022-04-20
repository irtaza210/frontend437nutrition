import React, { Component } from 'react'
import './addWorkout.css';
import firebase from "../fire";
import { db } from '../fire';
import WOCheckbox from './WOCheckbox'; 
import Button from '@material-ui/core/Button';
import WorkoutList from './WorkoutList'; 

// import Button from '@material-ui/core/Button';

class AddWorkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected : 'chests',
            date: this.props.date
        };
    }

    handleOptionChange = (changeEvent) => {
        this.setState({
            selected: changeEvent.target.value
        });
        
    }

    // make a workouts list component
    // on submit of the radio buttons, make that component
    // the component should take the body type, grab all workouts of that part from database
    // and render the correct workouts for the selected bodyparts.
    render() {
        return (
            <>
                <div class="addWorkoutContent">
                    <div class="bodyParts">
                        <Button onClick={this.props.closeAddWorkoutsFunction} id="backBtn">Back</Button>
                        <h1>Choose Body Part</h1>
                        <form id="bodyPartForm">
                            <div className="radio">
                                <label>
                                    <input type="radio" value="chests" checked={this.state.selected === 'chests'} onChange={this.handleOptionChange}/>
                                    Chests
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input type="radio" value="legs" checked={this.state.selected === 'legs'} onChange={this.handleOptionChange}/>
                                    Legs
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input type="radio" value="biceps" checked={this.state.selected === 'biceps'} onChange={this.handleOptionChange}/>
                                    Biceps
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input type="radio" value="triceps" checked={this.state.selected === 'triceps'} onChange={this.handleOptionChange}/>
                                    Triceps
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input type="radio" value="shoulders" checked={this.state.selected === 'shoulders'} onChange={this.handleOptionChange}/>
                                    Shoulders
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input type="radio" value="back" checked={this.state.selected === 'back'} onChange={this.handleOptionChange}/>
                                    Upper Back
                                </label>
                            </div>
                        </form>
                        <WorkoutList option={this.state.selected} date={this.state.date}/>
                    </div>
                </div>
            </>
        );

    }
}

export default AddWorkout;