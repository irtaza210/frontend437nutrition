// http://react.tips/checkboxes-in-react/
import firebase from "../fire";
import { db } from '../fire';
import React, { Component, PropTypes } from 'react';
import './WOCheckbox.css';

class Paragraph extends Component {
  state = {
    workoutname: this.props.workoutname,
  }
  render() {
      alert("here too");
      console.log(this.state.workoutname);
      return (
       <div className="fuck this">
           <h1>HELLO</h1>
           <h1>HELLO</h1>
           <h1>HELLO</h1>
           <h1>HELLO</h1>
           <h1>HELLO</h1>
           <h1>HELLO</h1>
           <h1>HELLO</h1>
           <h1>HELLO</h1>
           <h1>HELLO</h1>
      <h2>{this.state.workoutname}</h2>
      <h2>{this.state.workoutname}</h2>
      <h2>{this.state.workoutname}</h2>
      <h2>{this.state.workoutname}</h2>
      <h2>{this.state.workoutname}</h2>
      </div>
      )
  }
  
    
  
}


export default Paragraph;

// in checkbox
// all checkboxes come with their own delete buttons
// onclick the checkbox becomes null
// in the workouts.js before displaying checkbox, check if null
// if null dont display it.