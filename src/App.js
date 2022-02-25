// import React, {useState, useEffect, useContext, Component} from 'react';
import { Component } from 'react';
import firebase from "./fire";
import {db} from './fire';
import {auth} from './fire';
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

    // firebase.auth().onAuthStateChanged(user => {
    //   user
    //     ? localStorage.setItem('loggedinuser', JSON.stringify(user))
    //     : localStorage.removeItem('loggedinuser');
    // });
    
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
              <Route exact path="/" component={Home} />
              {/* ------------ HOW TO PASS DATA TO COMPONENT INSIDE A ROUTER? -------- */}
              {/* <Route path="/todays-meals" render={(props) => <TodaysMeals todaysMeals={this.state.todaysMeals} fetchUserMeals={this.fetchUserMeals} />}/> */}
              <Route path="/todays-meals" component={TodaysMeals} />
              <Route path="/menu" component={MenuPage} />
              <Route path="/settings" component={Settings} />
              {/* <Route path="/login" render={ ()=> <LoginPage updateEmailAndPassword={this.updateEmailAndPassword} /> } /> */}
              
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

  componentDidUpdate() {

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
          // vegetarian: info.vegetarian,
          // vegan: info.vegan,
          gluten: info.gluten,
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