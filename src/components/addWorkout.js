import React, { Component } from 'react'
import './addWorkout.css';
import Button from '@material-ui/core/Button';
import WorkoutList from './WorkoutList'; 

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

    componentDidMount = function() {
        this.setState({
            selected: "chests"
        });
    }

    render() {
        return (
            <>
                <div className="addWorkoutCenterDiv">
                    <div className="addWorkoutContent">
                        <div className="bodyParts">
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
                            <div class="workoutListComponent">
                                <WorkoutList option={this.state.selected} date={this.state.date} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );

    }
}

export default AddWorkout;