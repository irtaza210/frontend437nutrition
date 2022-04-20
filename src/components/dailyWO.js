import React, { Component } from 'react'
import './dailyWO.css';
import firebase from "../fire";
import { db } from '../fire';
import WOCheckbox from './WOCheckbox';
import AddWorkout from './addWorkout';
import Button from '@material-ui/core/Button';
import Paragraph from './Paragraph';
import PastMeals from './PastMeals';

// import Button from '@material-ui/core/Button';
// npx kill-port 3000
class Workout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentWorkoutId: -1,
            date : props.date,
            dashdate: props.date,
            isAdding: false,
            recurring: [],
            pastmeals: [],
            // recurringworkouts: [

            // ], 
            workouts: [
                
            ],
            months : {
                January: '01',
                February: '02',
                March: '03',
                April: '04',
                May: '05',
                June: '06',
                July: '07',
                August: '08',
                September: '09',
                October: '10',
                November: '11',
                December: '12',
              }
        };
        this.formatDate = this.formatDate.bind(this);
        this.padTo2Digits = this.padTo2Digits.bind(this);
    }
    
    setDateStateToString = (newDate) => {
        this.setState({date : newDate})
    } 
    setDateStateToStringDash = (newDate) => {
        this.setState({dashdate : newDate})
    } 

    convertDateToString = () => {
        return new Promise((resolve, reject) => {
            var monthAndYear = this.state.date.monthAndYear
            if(typeof(monthAndYear) === 'string') {
                var monthYear = monthAndYear.split(' ')
                var month = this.state.months[monthYear[0]]
                var year = monthYear[1]
                var day = this.state.date.day
                var newDate = "".concat(month, "/", day, "/", year)
                this.setDateStateToString(newDate)
            }
            1 === 1 ? resolve("state updated successfully") : reject("It can never reach here");
        })
        
    }

    convertDateToStringDash = () => {
        return new Promise((resolve, reject) => {
            var monthAndYear = this.state.dashdate.monthAndYear
            console.log(monthAndYear);
            if(typeof(monthAndYear) === 'string') {
                var monthYear = monthAndYear.split(' ')
                var month = this.state.months[monthYear[0]];
                var year = monthYear[1]
                var day = this.state.dashdate.day.toString().padStart(2, '0');
                var newDate = "".concat(year, "-", month, "-", day)
                console.log("newDate " + newDate)
                this.setDateStateToStringDash(newDate)
            }
            1 === 1 ? resolve("state updated successfully") : reject("It can never reach here");
        })
        
    }

    padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
    
    /* Accepts a Date object and converts it to string "MM/DD/YYYY" */
    formatDate(date) {
    return [
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
        date.getFullYear(),
        ].join('/');
    }


    componentWillMount = () => {
        this.selectedCheckboxes = new Set();
        this.selectedCheckboxesIDs = new Set();
        this.recurringworkouts = new Set();
        this.set = new Set();
    }

    // toggles the checkbox by adding or removing the label from the selectedCheckboxes set.
    toggleCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
            this.selectedCheckboxes.delete(label);
            
        } else {
            this.selectedCheckboxes.add(label);
        }
    }

    // takes the workout name as a string from the state and retrieves the correct ID of the workout
    // from firestore.
    getWorkoutIDs = (workout) => {
        if (firebase.auth().currentUser !== null) {
            
            let uid = firebase.auth().currentUser.uid;
            db.collection("workouts").get().then(querySnapshot => {
                querySnapshot.docs.forEach(doc2 => {
                    if (doc2.data().name === workout) {
                        return doc2.id;
                    }
                })
            })
        }
    }

    saveWorkouts = () => {   
        if (firebase.auth().currentUser !== null) {
            let uid = firebase.auth().currentUser.uid;
            db.collection("users").doc(uid).get().then((doc2) => {
                var workout_hist = JSON.parse(doc2.data().workout_hist);
                
                var dailyWorkouts = workout_hist[this.state.date];
                if(typeof dailyWorkouts != 'undefined') {
                    for (var i = 0; i < dailyWorkouts.length; i++) {
                        if (this.selectedCheckboxesIDs.has(dailyWorkouts[i].id)) {
                            workout_hist[this.state.date][i].completed = true;
                        }else {
                            workout_hist[this.state.date][i].completed = false;
                        }
                    }
                }
                
                
                const userRef = db.collection("users").doc(uid);
                // Set the "capital" field of the city 'DC'
                return userRef.update({
                    workout_hist: JSON.stringify(workout_hist)
                });
            })
        }
    }

    clearWorkouts = () => {
        this.setState({
            workouts: []
        })
        this.getDailyWorkouts();
        this.initialize();
    }

    closeAddWorkouts = () => {
        this.clearWorkouts()
        this.setState({
            isAdding: false
        })
    }

    handleFormSubmit = formSubmitEvent => {
        formSubmitEvent.preventDefault();
        this.selectedCheckboxesIDs.clear();
        for (const checkbox of this.selectedCheckboxes) {
            if (firebase.auth().currentUser !== null) {
                let uid = firebase.auth().currentUser.uid;
                db.collection("workouts").get().then(querySnapshot => {
                    querySnapshot.docs.forEach(doc2 => {
                        if (doc2.data().name === checkbox.split("-")[0]) {
                            this.selectedCheckboxesIDs.add(doc2.id);
                        }
                    })
                })
            }
        }
        setTimeout(() => {this.saveWorkouts()}, 1000);
    }

    createCheckbox = (workoutName, flag) => (
        <WOCheckbox
            label={workoutName}
            handleCheckboxChange={this.toggleCheckbox}
            key={workoutName}
            flag={flag}
            date={this.state.date}
        />
    )
    checkboxIntermediate = (workoutName)  => (
        this.createCheckbox(workoutName, this.selectedCheckboxes.has(workoutName))
    )

    createCheckboxes = () => (
        this.state.workouts.map(this.checkboxIntermediate)
    )

    createParagraph = (workoutName) => {  
         
        // const div = document.createElement('div');
        // div.className = 'foo';
        // let node = document.createTextNode(workoutName);
        // div.appendChild(node);
        // document.getElementsByClassName("recurring")[0].appendChild(div);
        if (this.set.has(workoutName)) {}
        else {
            this.set.add(workoutName);
            document.getElementById("recurring").innerHTML+=workoutName + "<br />";
        }
        
        
        
    }

    paragraphIntermediate = (workoutName) => (
        this.createParagraph(workoutName)
    )
    createFutureParagraphs = () => {
        // console.log("creating paragraphs!");
        this.state.recurring.map(this.paragraphIntermediate)
        
    }
    
    updateRecurringState = (name) => {
        if (!this.state.recurring.includes(name)){
            this.setState({ recurring: [...this.state.recurring, name]});
        }
    }
    addWorkouts = () => (
        this.setState({
            isAdding: !this.state.isAdding
        })
    )

    updateWorkoutState = (name) => {
        if (!this.state.workouts.includes(name)){
            this.setState({ workouts: [...this.state.workouts, name]});
        }
    }

    getDailyWorkouts = () => {
        if (firebase.auth().currentUser !== null) {
            let uid = firebase.auth().currentUser.uid;
            db.collection("users").doc(uid).get().then((doc) => {
                var workout_hist = JSON.parse(doc.data().workout_hist);
                
                if ((this.state.date in workout_hist)){
                    var workouts = workout_hist[this.state.date]
                    // var workoutIds = Object.keys(workout_hist[this.state.date])
                    for (var i = 0; i < workouts.length; i++){
                        const sets = workouts[i].sets;
                        const reps = workouts[i].reps;
                        const weight = workouts[i].weight;
                        db.collection("workouts").doc(workouts[i].id).get().then((doc2) => {
                            this.updateWorkoutState(doc2.data().name + "-" + sets + "-" + reps + "-" + weight);
                            // this.updateWorkoutState(doc2.data().name);
                        })
                    }
                }
            })
        }
    }

    getRecurringWorkouts = (clickeddate) => {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var dayName = days[clickeddate.getDay()];
        if (firebase.auth().currentUser !== null) {
            let uid = firebase.auth().currentUser.uid;
            db.collection("users").doc(uid).get().then((doc) => {
                var recurring_workout = JSON.parse(doc.data().recurring_workout);
                var recurringWorkouts = recurring_workout[dayName];
                if (typeof recurringWorkouts != 'undefined') {
                    for (let i=0; i<recurringWorkouts.length; i++) {
                        const sets = recurringWorkouts[i].sets;
                        const reps = recurringWorkouts[i].reps;
                        const weight = recurringWorkouts[i].weight;
                        db.collection("workouts").doc(recurringWorkouts[i].id).get().then((doc3) => {
                            var str = doc3.data().name + "-" + sets + "-" + reps + "-" + weight;
                            this.updateRecurringState(str.split("-")[0] + " | " + str.split("-")[1] + " sets | " + str.split("-")[2] + " reps | " + str.split("-")[3] + "lbs");
                        })
                    }
                }
            })}
    }

    initialize = () => {
        if (firebase.auth().currentUser !== null) {
            let uid = firebase.auth().currentUser.uid;
            db.collection("users").doc(uid).get().then((doc2) => {
                var workout_hist = JSON.parse(doc2.data().workout_hist);
                var dailyWorkouts = workout_hist[this.state.date];
                if(typeof dailyWorkouts != 'undefined') {
                    for (var i = 0; i < dailyWorkouts.length; i++) {
                        if (dailyWorkouts[i].completed) {
                            const sets = dailyWorkouts[i].sets;
                            const reps = dailyWorkouts[i].reps;
                            const weight = dailyWorkouts[i].weight;
                            this.selectedCheckboxesIDs.add(dailyWorkouts[i].id);
                            db.collection("workouts").doc(dailyWorkouts[i].id).get().then((doc3) => {
                                // console.log(doc3.data().name);
                                this.selectedCheckboxes.add(doc3.data().name + "-" + sets + "-" + reps + "-" + weight);
                                
                            })
                        }
                    }
                }
            })
        }
    }

    initializeFuture(clickeddate) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        console.log(clickeddate);
        var dayName = days[clickeddate.getDay()];
        if (firebase.auth().currentUser !== null) {
            let uid = firebase.auth().currentUser.uid;
            db.collection("users").doc(uid).get().then((doc2) => {
                var recurring_workout = JSON.parse(doc2.data().recurring_workout);
                var recurringWorkouts = recurring_workout[dayName];
                // console.log(recurringWorkouts);
                var array = [];
                var sum = 0;
                if (typeof recurringWorkouts != 'undefined') {
                    for (let i=0; i<recurringWorkouts.length; i++) {
                        db.collection("workouts").doc(recurringWorkouts[i].id).get().then((doc3) => {

                            this.recurringWorkouts.add(doc3.data().name);
                            
                        })
                    }
                }
            })
        }
    }

    render() {
        if (document.getElementById("chart") != null) {
            document.getElementById("chart").style.display = "none";
        }
        
        this.convertDateToStringDash();
        
        // var today = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
        var today = new Date();
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
        // today.setHours(12, 0, 0);
        console.log("today " + today);
        console.log("Dash date " + this.state.dashdate);
        const clickeddate = new Date(`${this.state.dashdate}T12:00:00`);
        console.log("Clicked date " + clickeddate);
        // const newclickeddate = new Date(clickeddate.getTime- 24*60*60*1000);
        // console.log("New clicked date " + newclickeddate);
        // console.log(todaydate);
        // console.log(clickeddate);
        // console.log(todaydate > clickeddate);
        console.log(today === clickeddate);
        console.log(today > clickeddate);
        console.log(today < clickeddate);
        const pastmealsdate = this.formatDate(clickeddate);
        // alert(pastmealsdate);
        
        if (today > clickeddate) {
            this.convertDateToString().then(response => {
                this.getDailyWorkouts();
            }).catch(err => console.log(err));
            this.initialize();
            console.log("past");
            

        }
        else if (today < clickeddate) {
            this.getRecurringWorkouts(clickeddate);
            console.log("future");
        }
        else {
            console.log("today!");
            this.convertDateToString().then(response => {
                this.getDailyWorkouts();
            }).catch(err => console.log(err));
            this.initialize();
        }
        if (today < clickeddate) {
            return (
                <>
                    <div class="workoutContent">
                        <div class="currentWorkouts">
                            <Button id="dailyWOback" onClick={this.props.closeWorkoutsFunction}>Back</Button>
                            <h2>{this.props.date.day + " " + this.props.date.monthAndYear}</h2>
                            {this.createFutureParagraphs()}
                            <div>Your Future Recurring Workouts:</div><br></br>
                            <div id="recurring"></div>
                        </div>
                    </div>
                </>
            );
        }
        if (this.state.isAdding){
            return (
                <>
                    <div className="AddWorkoutForm">
                        {/* <div class="currentWorkouts"> */}
                            {/* <Button onClick={this.props.closeWorkoutsFunction}>Back</Button> */}
                            {/* <h1>Daily Workouts</h1> */}
                            {/* <h2>{this.props.date.day + " " + this.props.date.monthAndYear}</h2> */}
                            {/* <form onSubmit={this.handleFormSubmit}>
                                {this.createCheckboxes()}
                                <button className="btn btn-default" type="submit" id="save">Save</button>
                            </form> */}
                            {/* <AddWorkout date={this.state.date} closeAddWorkoutsFunction={this.closeAddWorkouts}/> */}
                            {/* <PastMeals date={this.state.date}/> */}
                        {/* </div> */}
                        {/* <button onClick={this.addWorkouts} class="addWorkouts" id="add">Add a Workout</button> */}
                        <AddWorkout id="AddWorkoutComponent" date={this.state.date} closeAddWorkoutsFunction={this.closeAddWorkouts}/>
                        {/* <PastMeals id="PastMealsComponent" date={pastmealsdate}/> */}

                    </div>
                </>
            );
        }
        else {
            return (
                <>
                    <div class="workoutContent">
                        <div class="currentWorkouts">
                        <Button id="backBtnDailyWO" size="small" onClick={this.props.closeWorkoutsFunction}>Back</Button>
                            <h1 id="dailyWOheader">Daily Workouts</h1>
                            <h2>{this.props.date.day + " " + this.props.date.monthAndYear}</h2>
                            <form onSubmit={this.handleFormSubmit}>
                                {this.createCheckboxes()}
                                <br></br>
                                <Button className="btn btn-default" size="small" type="submit" id="save">Save</Button>
                            </form>
                            
                            
                        </div>
                        <br></br>
                        {/* <Button onClick={this.addWorkouts} class="addWorkouts" id="add">Add a Workout</Button> */}
                        <Button onClick={this.addWorkouts} size="small" id="add">Add a Workout</Button><br></br> <br></br>
                        
                        <PastMeals date={pastmealsdate}/>
                    </div>
                </>
            );
        }
    }
}

export default Workout;