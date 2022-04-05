// http://react.tips/checkboxes-in-react/
import firebase from "../fire";
import { db } from '../fire';
import React, { Component, PropTypes } from 'react';
import './WOCheckbox.css';
import Button from '@material-ui/core/Button';

class Checkbox extends Component {
  state = {
    isChecked: this.props.flag,
    isDisplayed: true,
    date: this.props.date,
    workoutName: this.props.label.split("-")[0],
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    handleCheckboxChange(label);
  }

  deleteWorkout = (workoutId) => {
    if (firebase.auth().currentUser !== null) {
        let uid = firebase.auth().currentUser.uid;
        db.collection("users").doc(uid).get().then((doc2) => {
            var workout_hist = JSON.parse(doc2.data().workout_hist);
            
            var dailyWorkouts = workout_hist[this.state.date];
            for (var i = 0; i < dailyWorkouts.length; i++) {
                if (workoutId === dailyWorkouts[i].id) {
                    workout_hist[this.state.date].splice(i, 1);
                    
                }
            }
            
            const userRef = db.collection("users").doc(uid);
            
            return userRef.update({
                workout_hist: JSON.stringify(workout_hist)
            });
        })
    }
  }

  deleteCurrent = () => {
    this.setState(({ isDisplayed }) => (
        {
          isDisplayed: false,
        }
      ));
    var workoutId = "";
    if (firebase.auth().currentUser !== null) {
            
        let uid = firebase.auth().currentUser.uid;
        db.collection("workouts").get().then(querySnapshot => {
            querySnapshot.docs.forEach(doc2 => {
                //alert("here" + this.props.label)
                var split = this.props.label.split("-")[0];
                if (doc2.data().name === split) {
                    workoutId = doc2.id;
                    console.log("this", workoutId)
                }
            })
        })
        
        setTimeout(() => {this.deleteWorkout(workoutId)}, 1000);
    }
  }

  render() {
    const { label } = this.props;
    const { isChecked } = this.state;
    console.log(label);
    if(this.state.isDisplayed) {
        if (this.state.isChecked) {
            // do green
            return (
              <>
                <div className="checkboxGreen">
                  <label>
                    <div className="leftLabels">
                    <input
                      type="checkbox"
                      value={label}
                      checked={isChecked}
                      onChange={this.toggleCheckboxChange}
                    />
                    
                    {label}
                    </div>
                    <Button size="small" onClick={this.deleteCurrent} id="deleteBtn">Delete</Button>
                  </label>
                </div>
                <br></br>
                </>
              );
        }
        else {
            // do red
            return (
              <>
                <div className="checkboxRed">
                  <label>
                    <div className="leftLabels">
                        <input
                        type="checkbox"
                        value={label}
                        checked={isChecked}
                        onChange={this.toggleCheckboxChange}
                        />
                        
                        {label}
                        </div>
                        <Button size="small" onClick={this.deleteCurrent} id="deleteBtn">Delete</Button>
                  </label>
                </div>
                <br></br>
                </>
              );
        }
        
    }else {
        return (
            <></>
        );
    }
    
  }
}


export default Checkbox;

// in checkbox
// all checkboxes come with their own delete buttons
// onclick the checkbox becomes null
// in the workouts.js before displaying checkbox, check if null
// if null dont display it.