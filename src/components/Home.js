import React, { Component, PureComponent } from 'react';
import './Home.css';
import firebase from "../fire";
import { db } from '../fire';
import Chart from "react-google-charts";
import HomeCalendar from './HomeCalendar';


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedinuser: null,
            mealsArray: null,   // user's meals
            userTotals: null,   // map of nutrients to their total amounts
            heightfeet: null,
            heightinches: null,
            weight: null,
            age: null,
            gender: null
        }

        this.fetchUserMeals = this.fetchUserMeals.bind(this);

        firebase.auth().onAuthStateChanged(user => {
            user
                ? localStorage.setItem('loggedinuser', JSON.stringify(user))
                : localStorage.removeItem('loggedinuser');
        });


    }

    // componentDidMount() {
    //     this.props.updateWorkoutHist();
    // }
    //formula = 10*heightfeet + 5*heightinches + weight
    render() {
        let heightfeet = this.state.heightfeet;
        let heightinches = this.state.heightinches;
        let gender = this.state.gender;
        let age = this.state.age;
        let weight = this.state.weight;
        if (this.state.userTotals !== null && heightfeet !== null && heightinches !== null && weight !== null && age != null && gender != null) {
            let totals = this.state.userTotals;
            var bmr;
            if (gender == "female") {
                bmr = 6.25 * (parseInt(heightfeet) * 30.48 + 2.54 * parseInt(heightinches)) + (10 * parseInt(weight) / 2.205) - 5 * parseInt(age) - 161;
            }
            else {
                bmr = 6.25 * (parseInt(heightfeet) * 30.48 + 2.54 * parseInt(heightinches)) + (10 * parseInt(weight) / 2.205) - 5 * parseInt(age) - 5;
            }
            let recommendedcalories = parseInt(bmr * 1.4);
            let recommendedwater = parseInt(weight*(2.0/3.0));
            //let recommended = this.state.userRecommended;
            console.log(totals);
            return (
                <div id='w'>
                    {/* <br></br> */}
                    <div>
                    <HomeCalendar></HomeCalendar>
                    <div id="total"><h1>Total Calories: {totals.calories} Kcal</h1> </div>
                    <div id="recommended"><h2>Recommended: {recommendedcalories} Kcal <br></br>Recommended Water Intake: {recommendedwater} Ounces</h2></div>
                    </div>
                    <div id="chart" style={{display: 'flex', maxWidth: 660}}>
                        <Chart
                            id="rchart"
                            width={350}
                            height={450}
                            // width={'650px'}
                            // height={'600px'}
                            chartType="BarChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                // Data from https://www.fda.gov/media/99069/download 
                                // Fat:	        78 g
                                // Sat. fat:	20 g
                                // Cholesterol:	300 mg = 0.3 g
                                // Carbs:	    275 g
                                // Sodium:	    2300 mg = 2.3 g
                                // Fiber:	    28 g
                                // Protein:     50 g
                                // Sugars:      50 g
                                ['Nutrients', 'Your intake', { role: 'style' }, { role: 'annotation' }, 'Recommended intake', { role: 'style' }, { role: 'annotation' }],
                                // ['Calories', totals.calories, 'stroke-color: #703593; stroke-width: 4; fill-color: #C5A5CF', `You`, 2000, 'stroke-width: 2; fill-color: lightblue; stroke-color: blue; opacity: 0.5', `Recommended`],
                                ['Fat', totals.fat_g, 'stroke-color: #F2C57C; stroke-width: 4; fill-color: #F2C57C', `You`, 0.27 * recommendedcalories * 0.1296, 'stroke-width: 2; fill-color: lightblue; stroke-color: lightblue; opacity: 0.5', `Recommended`],
                                ['Sat. fat', totals.sat_fat_g, 'stroke-color: #DDAE7E; stroke-width: 4; fill-color: #DDAE7E', `You`, 0.10 * recommendedcalories * 0.1296, 'stroke-width: 2; fill-color: lightblue; stroke-color: lightblue; opacity: 0.5', `Recommended`],
                                // ['Cholesterol', totals.chol_g, 'stroke-color: #7FB685; stroke-width: 4; fill-color: #7FB685', `You`, 0.3, 'stroke-width: 2; fill-color: lightblue; stroke-color: lightblue; opacity: 0.5', `Recommended`],
                                ['Carbs', totals.carbs_g, 'stroke-color: #426A5A; stroke-width: 4; fill-color: #426A5A', `You`, 0.55 * recommendedcalories * 0.1296, 'stroke-width: 2; fill-color: lightblue; stroke-color: lightblue; opacity: 0.5', `Recommended`],
                                ['Sodium', totals.sodium_g, 'stroke-color: #EF6F6C; stroke-width: 4; fill-color: #EF6F6C', `You`, 2.3, 'stroke-width: 2; fill-color: lightblue; stroke-color: lightblue; opacity: 0.5', `Recommended`],
                                ['Fiber', totals.fiber_g, 'stroke-color: #CFA5B4; stroke-width: 4; fill-color: #CFA5B4', `You`, 28, 'stroke-width: 2; fill-color: lightblue; stroke-color: lightblue; opacity: 0.5', `Recommended`],
                                ['Protein', totals.protein_g, 'stroke-color: #7A306C; stroke-width: 4; fill-color: #7A306C', `You`, 0.225 * recommendedcalories * 0.1296, 'stroke-width: 2; fill-color: lightblue; stroke-color: lightblue; opacity: 0.5', `Recommended`],
                                ['Sugars', totals.sugar_g, 'stroke-color: #D62246; stroke-width: 4; fill-color: #D62246', `You`, 0.05 * recommendedcalories * 0.1296, 'stroke-width: 2; fill-color: lightblue; stroke-color: lightblue; opacity: 0.5', `Recommended`],
                            ]}
                            options={{
                                title: "Today's Nutrient Intake",
                                chartArea: { width: '70%' },
                                hAxis: {
                                    title: 'Amount in grams',
                                    minValue: 0,
                                },
                                bar: { groupWidth: "65%" },
                                // vAxis: {
                                //     title: '',
                                // },
                                // * hide legend b/c bars are not custimizable
                                legend: { position: 'none' },
                                // background color of graph
                                backgroundColor: '#ffffff',
                                
                                
                            }}
                            // For tests
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </div>
                </div>
            );
        }
        else if (this.state.userTotals == null && heightfeet !== null && heightinches !== null && weight !== null && age != null && gender != null) {
            let totals = this.state.userTotals;
            var bmr;
            if (gender == "female") {
                bmr = 6.25 * (parseInt(heightfeet) * 30.48 + 2.54 * parseInt(heightinches)) + (10 * parseInt(weight) / 2.205) - 5 * parseInt(age) - 161;
            }
            else {
                bmr = 6.25 * (parseInt(heightfeet) * 30.48 + 2.54 * parseInt(heightinches)) + (10 * parseInt(weight) / 2.205) - 5 * parseInt(age) - 5;
            }
            let recommendedcalories = parseInt(bmr * 1.4);
            let recommendedwater = parseInt(weight*(2.0/3.0));
            return (
                <div>
                    {/* <br></br><br></br><br></br> */
                    <HomeCalendar></HomeCalendar> }
                    <br></br>
                    <div id="total"><h1>Total Calories: 0 Kcal</h1> </div><br></br>
                    <div id="recommended"><h2>Recommended: {recommendedcalories} Kcal <br></br>Recommended Water Intake: {recommendedwater} Ounces</h2></div>
                    
                </div>
            )
        }
        else {
            // Update chart data
            this.fetchUserMeals();
            <HomeCalendar></HomeCalendar>
            return (<div>Loading...</div>);
        }

    }


    fetchUserMeals() {
        // need to set this.state.mealsArray to null later 
        console.log("______Fetching user meals ____________");

        let user = JSON.parse(localStorage.getItem('loggedinuser'));    // get user from local storage
        // console.log(user);
        if (user !== null) {
            let uid = user.uid;
            // console.log(uid);

            db.collection("todaysmeals").doc(uid).get().then((doc) => {
                // Got all meals for the user
                let mealsArr = doc.data().meals;  // get meals array field of the entry i
                // console.log(`Data we got: ${mealsArr}`);
                var stateArray = [];    // temp array (will assign to mealsArray afterward)

                var totalsTemp = {  // will assign to userTotals later
                    calories: 0,    //  (contains all fields in a meal's 'nutrition' except for trans fat)
                    calc_per: 0,
                    chol_g: 0,
                    fiber_g: 0,
                    iron_per: 0,
                    protein_g: 0,
                    sat_fat_g: 0,
                    sodium_g: 0,
                    sugar_g: 0,
                    carbs_g: 0,
                    fat_g: 0,
                    vit_a_per: 0,
                    vit_c_per: 0,
                };
                if (mealsArr.length === 0) {
                    db.collection("users").doc(uid).get().then((doc) => {
                        let data = doc.data();
                        // console.log(doc.data());

                        this.setState({
                            heightfeet: data.heightfeet,
                            heightinches: data.heightinches,
                            weight: data.weight,
                            age: data.age,
                            gender: data.gender,
                            // mealsArray: stateArray,
                            // userTotals: totalsTemp,
                        }, function () {
                            // console.log("Just set height & weight");
                        });

                    });
                } else {
                    // Fetch meal info from meals collection

                    for (var i = 0; i < mealsArr.length; i++) {
                        let mealId = mealsArr[i];   // need to save it to be able to use it inside .then()

                        db.collection("meals").doc(mealId).get().then((doc) => {

                            let obj = doc.data();

                            var mealObj = {
                                id: mealId,
                                name: obj.name, // string
                                // date: obj.date, // string (don't think we need it)   
                                nutrition: obj.nutrition    // map [string -> number]
                            }
                            // ------------ specific to Home.js ------------- //

                            let chol_g = mealObj.nutrition.cholesterol_mg / 1000;
                            let sodium_g = mealObj.nutrition.sodium_mg / 1000;
                            console.log("Chol_g= " + chol_g);
                            console.log("Sodium_g= " + sodium_g);
                            totalsTemp['calories'] += mealObj.nutrition.calories;
                            totalsTemp['calc_per'] += mealObj.nutrition.calc_per;
                            totalsTemp['chol_g'] += chol_g;
                            totalsTemp['fiber_g'] += mealObj.nutrition.fiber_g;
                            totalsTemp['iron_per'] += mealObj.nutrition.iron_per;
                            totalsTemp['protein_g'] += mealObj.nutrition.protein_g;
                            totalsTemp['sat_fat_g'] += mealObj.nutrition.sat_fat_g;
                            totalsTemp['sodium_g'] += sodium_g;
                            totalsTemp['sugar_g'] += mealObj.nutrition.sugar_g;
                            totalsTemp['carbs_g'] += mealObj.nutrition.total_carbs_g;
                            totalsTemp['fat_g'] += mealObj.nutrition.total_fat_g;
                            totalsTemp['vit_a_per'] += mealObj.nutrition.vit_a_per;
                            totalsTemp['vit_c_per'] += mealObj.nutrition.vit_c_per;

                            // console.log(totalsTemp);
                            // ---------------------------------------------- //

                            // push() returns the new length of the array 
                            if (stateArray.push(mealObj) == mealsArr.length) {

                                db.collection("users").doc(uid).get().then((doc) => {
                                    let data = doc.data();
                                    // console.log(doc.data());

                                    this.setState({
                                        heightfeet: data.heightfeet,
                                        heightinches: data.heightinches,
                                        weight: data.weight,
                                        age: data.age,
                                        gender: data.gender,
                                        mealsArray: stateArray,
                                        userTotals: totalsTemp,
                                    }, function () {
                                        // console.log("Just set height & weight");
                                    });

                                });

                            }

                        });

                    }
                }


            });


        }

    }



}


export default Home;
