import React, { Component } from 'react';
import './MenuPage.css';
import firebase from "../fire";
import { db } from '../fire';
import Dropdown from './Dropdown';
import Button from '@material-ui/core/Button';
import CustomForm from './CustomForm';


class MenuPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLocation: null,
            detailMeal: null,   // meal obj that is clicked
            mealIds: [],  // array of meal ids for selected location
            meals: [],
            filteredMeals: [],
            userObj: null,
            showCustomForm: false,  // add custom meal form 
            location: [
                {
                    id: 0,
                    title: "BEAR'S DEN - Ciao Down",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 1,
                    title: "BEAR'S DEN - Grizzly Grill",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 2,
                    title: "BEAR'S DEN - L'Chaim",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 3,
                    title: "BEAR'S DEN - Sizzle & Stir",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 4,
                    title: "BEAR'S DEN - Top 8 Friendly",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 5,
                    title: "BEAR'S DEN - WUrld Fusion",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 6,
                    title: "Bytes",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 7,
                    title: "CAFÉ BERGSON",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 8,
                    title: "CHERRY TREE CAFÉ",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 9,
                    title: "DUC - 1853 Diner",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 10,
                    title: "DUC - DeliciOSO",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 11,
                    title: "DUC - Top 8 Friendly",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 12,
                    title: "DUC - Trattoria Verde",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 13,
                    title: "DUC - Wash U Wok",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 14,
                    title: "Kosher",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 15,
                    title: "LAW CAFÉ",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 16,
                    title: "Millbrook Market & Coffee",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 17,
                    title: "PARKSIDE CAFE",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 18,
                    title: "PAWS & GO MARKET",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 19,
                    title: "THE VILLAGE - Deli",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 20,
                    title: "THE VILLAGE - Grill",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 21,
                    title: "THE VILLAGE - Stir Fry",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 22,
                    title: "THE VILLAGE - Top 8 Friendly",
                    selected: false,
                    key: 'location'
                },
                {
                    id: 23,
                    title: "WHISPERS CAFÉ",
                    selected: false,
                    key: 'location'
                },
                // user can create meals by clicking on this option and filling out meal info
                {
                    id: 24,
                    title: "Custom Meals",
                    selected: false,
                    key: 'location'
                }
            ],

        }

        this.resetThenSet = this.resetThenSet.bind(this);
        this.showCustomForm = this.showCustomForm.bind(this);
        this.hideCustomForm = this.hideCustomForm.bind(this);
       
        // firebase.auth().onAuthStateChanged(user => {
        //     user
        //         ? localStorage.setItem('loggedinuser', JSON.stringify(user))
        //         : localStorage.removeItem('loggedinuser');
        // });

    }


    render() {
        // If showCustomForm is true, display the form (takes up the whole screen)
        let mySet = new Set();
        if (this.state.selectedLocation === "Custom Meals" && this.state.showCustomForm && this.state.filteredMeals.length > 0) {
            return (
                <div>
                    <CustomForm hideCustomForm={this.hideCustomForm} />
                </div>
            );

        } else if (this.state.meals.length > 0 && this.state.filteredMeals.length > 0) {
            // let elements = this.state.meals.map((item, index) =>
            //     <div className="box" key={index} onClick={this.handleMealClick.bind(this, item)}>
            //         <strong>{item.name}</strong>
            //     </div>
            // );
            let elements = this.state.filteredMeals.map((item, index) => {
                if (!mySet.has(item.name)) {
                    mySet.add(item.name);
                    return (
                        <div className="box" key={index} onClick={this.handleMealClick.bind(this, item)}>
                            <strong>{item.name}</strong>
                        </div>
                    );
                }

            });

            // If a meal is clicked, show detail view for that meal below list of meals, otherwise
            //  just show the list of meals for that location
            if (this.state.detailMeal !== null) {
                // return Dropwdown + list of meals + detailed view
                let meal = this.state.detailMeal;
                let allergens = meal.allergens.map((str, index) =>
                    <span key={index}>{str}</span>
                );
                return (
                    <div>
                        <br></br>
                        <div>Meals are filtered based on your allergy information (edit in settings).</div>
                        <Dropdown
                            title="Select location"
                            list={this.state.location}
                            resetThenSet={this.resetThenSet}
                        />
                        {/* List of meals: */}
                        <div className="box-container">
                            {this.state.selectedLocation === "Custom Meals" ?
                                <div className="box" onClick={this.showCustomForm}><strong>+ Custom Menu Item</strong></div> : null}
                            {elements}
                        </div>
                        {/* Detailed view: */}
                        <div className="detail-view-container">
                            <br></br>
                            <strong id="detail-title">{meal.name}</strong><br></br><br></br>

                            <div>Calories: {meal.nutrition.calories}</div><br></br>
                            {/* When 'Add to Plate' is clicked, pass this meal object to click handler */}
                            <Button id="addtoplate" onClick={this.props.handleAddToPlate.bind(this, meal)}>Add to Plate</Button>
                            <br></br><br></br>
                            <div id="hn">Nutrients per serving:</div><br></br>
                            <div className="indivnutrition">
                                <div id="n">Total Fat: {meal.nutrition.total_fat_g}g</div><br></br>
                                <div id="n">Saturated Fat: {meal.nutrition.sat_fat_g}g</div><br></br>
                                <div id="n">Trans Fat: {meal.nutrition.trans_fat_g}g</div><br></br>
                                <div id="n">Cholesterol: {meal.nutrition.cholesterol_mg}mg</div><br></br>
                                <div id="n">Sodium: {meal.nutrition.sodium_mg}</div><br></br>
                                <div id="n">Total Carbs: {meal.nutrition.total_carbs_g}g</div><br></br>
                                <div id="n">Dietary Fiber: {meal.nutrition.fiber_g}g</div><br></br>
                                <div id="n">Sugars: {meal.nutrition.sugar_g}g</div><br></br>
                                <div id="n">Protein: {meal.nutrition.protein_g}g</div><br></br>
                                <div id="n">Vit. A: {meal.nutrition.vit_a_per}%</div><br></br>
                                <div id="n">Vit. C: {meal.nutrition.vit_c_per}%</div><br></br>
                                <div id="n">Calcium: {meal.nutrition.calc_per}%</div><br></br>
                                <div id="n">Iron: {meal.nutrition.iron_per}%</div><br></br>

                                <div id="n">Allergens: {allergens}</div><br></br>
                            </div>
                        </div>
                    </div>

                );
            } else {
                // return Drowdown + list of meals
                return (
                    <div>
                        <br></br>
                        <div>Meals are filtered based on your allergy information (edit in settings).</div>
                        <Dropdown
                            title="Select location"
                            list={this.state.location}
                            resetThenSet={this.resetThenSet}
                        />

                        <div className="box-container">
                            {/* If the location selected is 'Custom Meals', then show the "Add Custom Meal" as the first box, 
                                otherwise don't show anything */}
                            {this.state.selectedLocation === "Custom Meals" ?
                                <div className="box" onClick={this.showCustomForm}>
                                    <strong>+ Custom Menu Item</strong></div> :
                                null}

                            {elements}
                        </div>

                        {/* Show add-custom-meal form if the user clicked the "Add Custom Meal" box */}
                        {/* {this.state.selectedLocation === "Custom Meals" && this.state.showCustomForm ? 
                            <CustomForm createCustomMeal={this.createCustomMeal} /> : null } */}

                    </div>
                );
            }

        } else {

            return (
                <div>
                    <br></br>
                    <div>Meals are filtered based on your allergy information (edit in settings).</div>
                    <Dropdown
                        title="Select location"
                        list={this.state.location}
                        resetThenSet={this.resetThenSet}
                    />
                </div>

            );
        }


    }
    // Called when a meal is clicked. Updates state, so page rerenders with the detailed view.
    handleMealClick(meal_obj) {
        console.log(`----- You clicked:`);
        console.log(meal_obj);
        this.setState({
            detailMeal: meal_obj,
        }, function () {
            console.log("Updated the detailMeal state")
        });

    }

    // This function clones the location state, then sets the selected key of each 
    //  object in the array to false and then only sets the clicked item’s selected key to true.
    resetThenSet = (id, key) => {
        let locationsCol = db.collection("locations");

        const temp = [...this.state[key]];

        // Get meals for selected location 
        locationsCol.doc(temp[id].title).get().then((doc) => {
            let data = doc.data();
            console.log("---- Meals ids we received for location: ----");
            console.log(data);
            // console.log(data.meals);
            temp.forEach((item) => item.selected = false);
            temp[id].selected = true;
            // Set which location is selected, and set meal ids array:
            this.setState({
                detailMeal: null,   // clears the detail view
                selectedLocation: temp[id].title,
                mealIds: data.meals,
                [key]: temp,    // don't know what this does, but keeping to avoid problems
            }, function () {
                console.log(`Selected loc: ${this.state.selectedLocation}, mealIds: ${this.state.mealIds}`);
                // Do another fetch to get meal details
                this.fetchMealDetails();
            });
        });

    }

    // Get nutrition details for each meal at selected location and update state
    fetchMealDetails() {
        console.log("______inside fetchMealDetails()______");
        console.log(this.state.selectedLocation);

        let mealsCol = db.collection("meals");
        let temp_arr = [];   // array to store meal objects
        let temp_filtered_arr = []; // stores meals user can eat
        let loggedinuser = JSON.parse(localStorage.getItem('loggedinuser'));
        // Get user allergen info so we can filter meals
        db.collection("users").doc(loggedinuser.uid).get().then((doc) => {
            let user = doc.data();
            // dairy: user.dairy,
            // egg: user.egg,
            // wheat: user.wheat,
            // soybean: user.soybean,
            // gluten: user.gluten,
            // nuts: user.nuts,
            let user_allergens = [];
            if (user.dairy) user_allergens.push("Milk");
            if (user.egg) user_allergens.push("Egg");
            if (user.wheat) user_allergens.push("Wheat");
            if (user.soybean) user_allergens.push("Soybean");
            if (user.gluten) user_allergens.push("Gluten");
            if (user.nuts) user_allergens.push("Nuts");

            // If there are meals at selected location, get the actual meal objects using the list of IDs
            if (this.state.mealIds.length > 0) {
                if (user_allergens.length === 0) {  // if user has no allergies, just get all meals
                    this.state.mealIds.forEach((meal_id) => {
                        mealsCol.doc(meal_id).get().then((doc) => {
                            // meal_object = {
                            //     id: String
                            //     name: "",
                            //     date: "",
                            //     allergens: Strings array,
                            //     nutrition: Map,
                            //     location: String
                            // }

                            let obj = doc.data();
                            let mealObj = {
                                id: meal_id,
                                name: obj.name,
                                date: obj.date,
                                allergens: obj.allergens,
                                nutrition: obj.nutrition,
                                location: obj.location,
                            }
                            temp_arr.push(mealObj);
                            console.log(`Meal obj just pushed: ${mealObj}`);


                            if (temp_arr.length == this.state.mealIds.length) {
                                this.setState({
                                    meals: temp_arr,
                                    filteredMeals: temp_arr,
                                }, function () {
                                    console.log("---------Just updated meal objects----------")
                                });
                            }
                        });
                    });
                } else {    // user has at least 1 allergy, need to filter
                    this.state.mealIds.forEach((meal_id) => {
                        console.log(meal_id);
                        mealsCol.doc(meal_id).get().then((doc) => {


                            let obj = doc.data();

                            let mealObj = {
                                name: obj.name,
                                id: meal_id,
                                date: obj.date,
                                allergens: obj.allergens,
                                nutrition: obj.nutrition,
                                location: obj.location,
                            }

                            // egg, wheat, soybean gluten nuts
                            temp_arr.push(mealObj);
                            console.log(`Meal obj just pushed: ${mealObj}`);
                            // If meal has allergen, don't add meal to filtered meals array, else add it
                            if ((user.dairy && obj.allergens.indexOf("Milk") !== -1) || (user.egg && obj.allergens.indexOf("Egg") !== -1)
                                || (user.wheat && obj.allergens.indexOf("Wheat") !== -1) || (user.soybean && obj.allergens.indexOf("Soybean") !== -1)
                                || (user.gluten && obj.allergens.indexOf("Gluten") !== -1) || (user.nuts && obj.allergens.indexOf("Nuts") !== -1)) {
                                console.log("Meal has allergen user is susceptible to.");
                            } else {
                                temp_filtered_arr.push(mealObj);
                            }

                            if (temp_arr.length == this.state.mealIds.length) {
                                this.setState({
                                    meals: temp_arr,
                                    filteredMeals: temp_filtered_arr,
                                }, function () {
                                    console.log("---------Just updated meal objects----------")
                                });
                            }



                        });
                    });
                }

            }   // end of for loop


        });


    }

    /** 
     * Called when "Create Custom Meal" box is clicked. Sets the showCustomForm to true so the form renders.
     */
    showCustomForm() {

        this.setState({
            showCustomForm: true,
        }, function () {
            console.log("set show custom form");
        });
    }

    hideCustomForm() {
        this.setState({
            showCustomForm: false,
        });
    }





}


export default MenuPage;