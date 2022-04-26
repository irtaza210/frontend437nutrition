import React, { Component, PureComponent, useState, useEffect } from 'react';
import RecurringWorkoutList from './RecurringWorkoutList'; 
import './RecurringWorkouts.css'
class RecurringWorkouts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected : 'chests',
        };
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleOptionChange = (changeEvent) => {
        this.setState({
            selected: changeEvent.target.value
        }, function() {
            console.log(this.state.selected + " is selected");
        });
        
    }
    render() {
        return(
            <>
                <div className="addWorkoutContent2">
                    <div className="bodyParts2">
                        <h1>Choose Body Part</h1>
                        <form id="bodyPartForm2">
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
                        <RecurringWorkoutList option={this.state.selected} date={this.props.date}/>
                    </div>
                    
                </div>
            </>
        );
    }
}
export default RecurringWorkouts