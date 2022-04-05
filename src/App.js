// import React, {useState, useEffect, useContext, Component} from 'react';
import { Component } from 'react';
import firebase from "./fire";
import { db } from './fire';
import { auth } from './fire';
// import { getAuth, updatePassword } from "firebase/auth";
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';

// import Chart from "react-google-charts";
import "./style.css"

import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';

import Navbar from './components/Navbar';
import Home from './components/Home';
import TodaysMeals from './components/TodaysMeals';
import MenuPage from './components/MenuPage';
import Settings from './components/Settings';
import RecurringWorkouts from './components/RecurringWorkouts';
import dailywo from './components/dailyWO';
import PastMeals from './components/PastMeals';
import { faBreadSlice } from '@fortawesome/free-solid-svg-icons';
// import Footer from './components/Footer';

/* Notes: 
  Doc IDs in 'users' are user's uids
*/
class App extends Component {
  constructor(props) {
    super(props);
    // state properties:
    this.state = {
      // Get current user from localStorage and parse it as an object
      loggedinuser: JSON.parse(localStorage.getItem("loggedinuser")),
      // loggedinuser: null,
      todaysMeals: null,

    }

    // Bind the functions so we can use them

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.updateEmailAndPassword = this.updateEmailAndPassword.bind(this);
    this.logOut = this.logOut.bind(this);
    this.fetchUserMeals = this.fetchUserMeals.bind(this);

    this.padTo2Digits = this.padTo2Digits.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.addMealToPastMeals = this.addMealToPastMeals.bind(this);
    this.handleAddToPlate = this.handleAddToPlate.bind(this);
    this.removeFromPastMeals = this.removeFromPastMeals.bind(this);
    // this.updateWorkoutHist = this.updateWorkoutHist.bind(this);
    this.getDayString = this.getDayString.bind(this);
    this.formatDateNoPaddingForDay = this.formatDateNoPaddingForDay.bind(this);

    firebase.auth().onAuthStateChanged(user => {
      user
        ? localStorage.setItem('loggedinuser', JSON.stringify(user))
        : localStorage.removeItem('loggedinuser');
    });

  }

  render() {
    // alert("hello");
    let currentUser = this.state.loggedinuser;

    if (currentUser !== null) {
      console.log(`---Navbar--- loggedinuser.email: ${currentUser.email}`);

      // Display home page
      return (
        // HashRouter idea taken from: https: stackoverflow.com/questions/58228017/react-router-v4-cant-load-page-on-github-pages
        <HashRouter basename={process.env.PUBLIC_URL}>
          <div>
            <Navbar logOut={this.logOut} userEmail={currentUser.email} />

            <Switch>
              <Route exact path="/" component={() => <Home/>} />
              {/* ------------ HOW TO PASS DATA TO COMPONENT INSIDE A ROUTER? -------- */}
              {/* <Route path="/todays-meals" render={(props) => <TodaysMeals todaysMeals={this.state.todaysMeals} fetchUserMeals={this.fetchUserMeals} />}/> */}
              <Route path="/todays-meals" component={() => <TodaysMeals removeFromPastMeals={this.removeFromPastMeals} />} />
              <Route path="/menu" component={() => <MenuPage handleAddToPlate={this.handleAddToPlate} />} />
              <Route path="/settings" component={Settings} />
              {/* <Route path="/login" render={ ()=> <LoginPage updateEmailAndPassword={this.updateEmailAndPassword} /> } /> */}
              <Route path="/recurring" component={RecurringWorkouts} />
              {/* <Route path="/past-meals" component={() => <PastMeals date="04/01/2022" />} /> */}


            </Switch>
            {/* <Footer /> */}

          </div>
        </HashRouter>
      );

    } else {
      // Display login page
      return (
        <LoginPage updateEmailAndPassword={this.updateEmailAndPassword} />
      );

    }

  }

  hasOneDayPassed(){
  // get today's date. eg: "7/37/2007"
    var date = new Date().toLocaleDateString();

    // if there's a date in localstorage and it's equal to the above: 
    // inferring a day has yet to pass since both dates are equal.
    if( localStorage.yourapp_date == date ) 
        return false;

    // this portion of logic occurs when a day has passed
    localStorage.yourapp_date = date;
    return true;
  }

//   updateWorkoutHist() {
//     let user = JSON.parse(localStorage.getItem('loggedinuser'));
//     let uid = user.uid;
//     // let lastUpdated = user["lastUpdatedDate"];
//     // let lastUpdatedDate
//     let date = new Date();
//     let todayObj = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
//     let today = this.formatDateNoPaddingForDay(todayObj);
//     let day = this.getDayString(todayObj.getDay());
//     // console.log(day);
//     // console.log(today);
//     // if (lastUpdated === null || lastUpdated === undefined) {
//     //   lastUpdated = "01/01/2019";
//     //   // alert("if statement");
//     // }
//     // let lastUpdatedDate = new Date(lastUpdated); 
    
    
//     console.log(todayObj);
//     // if (lastUpdatedDate < todayObj) {
//       db.collection("users").doc(uid).get().then((doc) => {
//         let data = doc.data();
//         let workout_hist = JSON.parse(data.workout_hist);
//         let recurring_workout = JSON.parse(data.recurring_workout);
//         let workoutHistArr = workout_hist[today];
//         let recurringWorkoutList = recurring_workout[day];
//         var newArray = [];
//         // workoutHistArr = new Set(workoutHistArr);
        
//         if (recurringWorkoutList !== null && recurringWorkoutList !== undefined && recurringWorkoutList.length !== 0) {
//           for (var i=0; i<recurringWorkoutList.length; i++) {

//             var object = {
//               id: recurringWorkoutList[i].id, 
//               weight: recurringWorkoutList[i].weight, 
//               reps: recurringWorkoutList[i].reps,
//               sets: recurringWorkoutList[i].sets,
//               completed: recurringWorkoutList[i].completed  
//             }
//             var valid = true;
//             for (var j=0; j<newArray.length; j++) {
//               if (newArray[j].id === object.id && newArray[j].weight === object.weight && newArray[j].reps === object.reps
//                 && newArray[j].sets === object.sets && newArray[j].completed === object.completed) {
//                   // alert("gotcha sucka");
//                   valid = false;
//                 }
//             }
//             if (valid) {
//               if (newArray.includes(object)) {
//                 alert("duplicate");
//               }
//               else {
//                 newArray.push(object);
//               }
//             }
            
//             // workoutHistArr.add(recurringWorkoutList[i]);
//           }
//         }
//         if (workoutHistArr !== null && workoutHistArr !== undefined && workoutHistArr.length !== 0) {
//           for (var i=0; i<workoutHistArr.length; i++) {
//             var object = {
//               id: workoutHistArr[i].id, 
//               weight: workoutHistArr[i].weight, 
//               reps: workoutHistArr[i].reps,
//               sets: workoutHistArr[i].sets,
//               completed: workoutHistArr[i].completed   
//             }
//             var valid = true;
//             for (var j=0; j<newArray.length; j++) {
//               if (newArray[j].id === object.id && newArray[j].weight === object.weight && newArray[j].reps === object.reps
//                 && newArray[j].sets === object.sets && newArray[j].completed === object.completed) {
//                   // alert("gotcha sucka");
//                   valid = false;
//                 }
//             }
//             if (valid) {
//               if (newArray.includes(object)) {
//                 alert("duplicate");
//               }
//               else {
//                 newArray.push(object);
//               }
//             }
//           }
//         }
//         // console.log(workoutHistArr);
//         // workoutHistArr = Array.from(workoutHistArr);
        
//         // workout_hist[today] = workoutHistArr;
//         workout_hist[today] = newArray;

        

//         const userRef = db.collection("users").doc(uid);
//         userRef.update({
//             workout_hist: JSON.stringify(workout_hist)
//         }).then(() => {
//           // let loggedinuser = this.state.loggedinuser;
//           // user["lastUpdatedDate"] = today;
//           // localStorage.setItem('loggedinuser', JSON.stringify(user));
//         });
         
        
//       });
//     // }
//   }
    

// }
/* Old updateWorkoutHist(): */
// console.log(workoutHistArr);
        // console.log(recurringWorkoutList);
        // if (recurringWorkoutList === null || recurringWorkoutList == undefined || recurringWorkoutList.length === 0) {
        //   console.log("--- before return ----");
        //   return;
        // } else {
        //   if (workoutHistArr !== null && workoutHistArr !== undefined && workoutHistArr.length !== 0) {
        //     for (var i=0; i<workoutHistArr.length; i++) {
              
        //       if (!newArray.has(workoutHistArr[i])) {
        //         newArray.push(workoutHistArr[i]);
                
        //       }
        //       // let obj = newArray[i];
              
        //     }
        //   } else {
        //     workoutHistArr = [];
        //   }
          
        //   for (var i=0; i<recurringWorkoutList.length; i++) {
        //     if (!newArray.has(recurringWorkoutList[i])) {
        //       newArray.push(recurringWorkoutList[i]);
        //     }
        //   }

          // const toFindDuplicates = arry => arry.filter((item, index) => arr.indexOf(item) !== index)
          // const duplicateElementa = tofindDuplicates(arry);
          // console.log(duplicateElements);

          // workoutHistArr = newArray;

  // Helper functions for formatting dates:
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
  formatDateNoPaddingForDay(date) {
    return [
      this.padTo2Digits(date.getMonth() + 1),
      date.getDate(),
      date.getFullYear(),
    ].join('/');
  }

  getDayString(dayNumber) {
    if (dayNumber == 0) return "Sunday";
    if (dayNumber == 1) return "Monday";
    if (dayNumber == 2) return "Tuesday";
    if (dayNumber == 3) return "Wednesday";
    if (dayNumber == 4) return "Thursday";
    if (dayNumber == 5) return "Friday";
    if (dayNumber == 6) return "Saturday";
  }

  addMealToPastMeals(uid, meal_id) {
    // get the past_meals object
    db.collection("users").doc(uid).get().then((doc) => {
      var pastMeals = JSON.parse(doc.data().past_meals);
      console.log(pastMeals);
      let formattedDate = this.formatDate(new Date());

      if (pastMeals[formattedDate]) {
          let mealsArr = pastMeals[formattedDate];
          if(mealsArr[mealsArr.indexOf(meal_id)] === -1) pastMeals[formattedDate].push(meal_id);
      } else {
        pastMeals[formattedDate] = [meal_id];
      }
      // Update the past_meals obj with the meal added to today:
      db.collection('users').doc(uid).update({
        past_meals: JSON.stringify(pastMeals)
      }).then(() => {
        console.log("--- Updated past_meals field ----" + formattedDate);
        alert("Meal Added!");
      });
    });
  }
  // Adds a meal id to the corresponding user in 'todaysmeals' collection. The same meal cannot be added twice.
  handleAddToPlate(meal_obj) {
    console.log("Add to plate clicked")
    // If user is signed in, get their uid and use that to update the corresponding doc in db
    //  by appending the meal id to the user's "meals" array (doc is accessed by user's uid)
    let user = firebase.auth().currentUser;
    console.log(`About to update 'todaysmeals' collection`);
    db.collection('todaysmeals').doc(user.uid).update({
      "meals": firebase.firestore.FieldValue.arrayUnion(meal_obj.id)
    }).then(() => {
      console.log(`Just added ${meal_obj.name} [${meal_obj.id}] to ${user.email}'s plate`);

      this.addMealToPastMeals(user.uid, meal_obj.id);

    });
  }

  removeFromPastMeals(uid, meal_id) {
    // get the past_meals object
    db.collection("users").doc(uid).get().then((doc) => {
      var pastMeals = JSON.parse(doc.data().past_meals);

      let formattedDate = this.formatDate(new Date());
      console.log(pastMeals[formattedDate]);

      if (pastMeals[formattedDate]) {
        const index = pastMeals[formattedDate].indexOf(meal_id);
        if (index > -1) {
          pastMeals[formattedDate].splice(index, 1); // 2nd parameter means remove one item only
          // if we removed the one and only meal for this date, remove the date altogether:
          if (pastMeals[formattedDate].length === 0) delete pastMeals[formattedDate];
          console.log(pastMeals[formattedDate]);
        }
      }
      // Update the past_meals field 
      db.collection('users').doc(uid).update({
        past_meals: JSON.stringify(pastMeals)
      }).then(() => {
        console.log("--- Removed from past_meals ----" + formattedDate);
      });
    });
  }


  // Fetches user meals from db and updates the state
  fetchUserMeals() {
    // Get reference to todaysmeals collection
    let collection = db.collection("todaysmeals");
    let mealsCollection = db.collection("meals");

    if (firebase.auth().currentUser !== null) {
      let uid = firebase.auth().currentUser.uid;
      console.log(uid);

      // get list of today's meals for this user  // 
      // const cancellablePromise = db.collection("todaysmeals").get();
      db.collection("todaysmeals").doc(uid).get().then((doc) => {
        console.log(this);

        let mealsArr = doc.data().meals;  // user doc with email and list of meals
        console.log(`Data we got: ${mealsArr}`);     // data = {email: "", meals: []}
        var stateArray = [];
        // Get meal info from meals collection
        for (var i = 0; i < mealsArr.length; i++) {
          db.collection("meals").doc(mealsArr[i]).get().then((doc) => {
            // I got errors when I pushed obj to array (probably b/c it's a complex object)
            //  so I'm extracting necessary info and constructing our own object.
            let obj = doc.data();

            var mealObj = {
              name: obj.name, // string
              date: obj.date, // string   
              nutrition: obj.nutrition    // map [string -> number]
            }
            console.log(mealObj);

            if (stateArray.push(mealObj) === mealsArr.length) {
              this.setState({
                todaysMeals: stateArray,
              });
              console.log(this.state.todaysMeals);

            }

          });

        }

      });
    }


  }


  // updateEmailAndPassword: passed to child component and called from there when user the login or register form
  //  obj has email and password; isLogin is true if the user clicked "Login", false if user clicked "Register"
  updateEmailAndPassword(userObj, info, isLogin) {
    console.log("isLogin= " + isLogin);
    console.log(`Received: ${info}`);
    isLogin ? this.login(userObj) : this.register(userObj, info);

  }

  // register: Creates a user with default parameters and logs them in
  register(userObj, info) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(userObj.email, userObj.password)
      .then((userCredential) => {
        //once we have made the user we need to add it to the "users" collection of firebase which stores all
        // the height weight and allergies. there needs to be some value given to these fields initally
        // so i am putting 0 for height and weight and false for all allergies and other for gender.
        let uid = userCredential.user.uid;

        // let uid = userObj.uid;
        // Using uid as doc ID for user entry
        db.collection('users').doc(uid).set({
          name: userObj.name, // recently added while working on the settings page
          email: userObj.email,
          heightfeet: info.heightfeet,
          heightinches: info.heightinches,
          weight: info.weight,
          age: info.age,
          gender: info.gender,
          dairy: info.dairy,
          nuts: info.nuts,
          egg: info.egg,
          wheat: info.wheat,
          soybean: info.soybean,
          gluten: info.gluten,
          // create empty fields to store meal and workout history:
          past_meals: "{}",
          workout_hist: "{}",
          recurring_workout: "{\"Monday\": [], \"Tuesday\": [], \"Wednesday\": [], \"Thursday\": [], \"Friday\": [], \"Saturday\": [], \"Sunday\": []}",
        });
        // Create a doc for the user in 'todaysmeals' collection so we can only call "update" when user adds
        //  a meal to plate.

        db.collection('todaysmeals').doc(uid).set({
          email: userObj.email,
          meals: []
        });
        console.log(`-- Registered ${userObj.email}`);

        this.login(userObj);


      })
      .catch((err) => {
        console.error(err);
        console.log(err);
        alert(err);
      });
  };

  login(userObj) {
    //used to log the user in
    console.log("------ Inside login() -------")
    firebase
      .auth()
      .signInWithEmailAndPassword(userObj.email, userObj.password)
      .then((userCredential) => {
        // localStorage.clear();
        // Set current user and reset email and password 
        this.setState({
          loggedinuser: userCredential.user,  // storing the whole user object

        }, function () {

          console.log(`User logged in: ${this.state.loggedinuser.email}`);

          // Save user to local storage
          localStorage.setItem('loggedinuser', JSON.stringify(this.state.loggedinuser));
          // Force update the the page (will cause the Home component to update as well, which is what we want)
          //  Now the bar chart is displaying immediately after user logs in, instead of on page refresh.
          this.forceUpdate();


        });

      }).catch((err) => {
        console.log("------ ERROR LOGGING IN -------")
        console.log(err);
        alert(err);
        var yesOrno;
        if (err.message == "The password is invalid or the user does not have a password.") {
          while (yesOrno != "yes" || yesOrno != "no") {
            yesOrno = prompt("Do you want to reset your password? Answer either 'yes' or 'no'");
            if (yesOrno == "yes") {
              firebase.auth().sendPasswordResetEmail(userObj.email)
                .then(() => {
                  alert("password reset email sent")
                })
                .catch((error) => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  alert(errorMessage);
                  // ..
                });
              break;
            }
            if (yesOrno == "no" || yesOrno == null) {
              break;
            }
          }
        }
      });
  };

  logOut() {

    // firebase.auth().signOut().then(() => {
    //   // localStorage.removeItem("loggedinuser") // remove user from localStorage
    //   localStorage.clear();   // clear local cache completely
    //   let loggingOutUserEmail = this.state.loggedinuser.email;
    //   this.setState({ 
    //     loggedinuser: null,
    //    }, function () {
    //     console.log(`${loggingOutUserEmail} logged out`);

    //   });
    // });
    // BELOW CODE FIXED THE WARNING ABOUT NOT BEING ABLE TO SET STATE ON UNMOUNTED COMPONENT:
    this.setState({
      loggedinuser: null,
    }, function () {

      firebase.auth().signOut().then(() => {
        localStorage.clear();   // clear local cache completely
        console.log("Successfully logged out");

      });

    });

  };




}
export default App;