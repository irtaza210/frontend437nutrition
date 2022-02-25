import React, { Component } from 'react'
import './CustomForm.css';
import firebase from "../fire";
import { db } from '../fire';
// import Button from '@material-ui/core/Button';

class CustomForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: "2021-11-20",
            location: "WUSTL",
            meal_name: null,
            allergens: null,    // array
            nutrition: null,    // map

        }

        this.formSubmit = this.formSubmit.bind(this);


    }

    render() {
        let user = JSON.parse(localStorage.getItem("loggedinuser"));
        let uid = user.uid;
        let email = user.email;

        return (

            // <div>
            //     Your email is: {email}
            //     Your uid is: {uid}
            // </div>

            <div>
                <form id="custom-meal-form" onSubmit={(e) => this.formSubmit(e)} >

                    <label htmlFor="mealname">Food Name: <input type="text" id="mealname" name="mealname" required /></label>
                    

                    <span><strong>Check all allergens in this food:</strong></span>
                    
                    <label htmlFor="dairy"> <input type="checkbox" id="dairy" name="allergen" value="Milk" /> Dairy</label>

                    <label htmlFor="egg"> <input type="checkbox" id="egg" name="allergen" value="Egg" /> Egg</label>

                    <label htmlFor="wheat"> <input type="checkbox" id="wheat" name="allergen" value="Wheat" /> Wheat</label>

                    <label htmlFor="soybean"> <input type="checkbox" id="soybean" name="allergen" value="Soybean" /> Soybean</label>

                    <label htmlFor="gluten"> <input type="checkbox" id="gluten" name="allergen" value="Gluten" /> Gluten</label>

                    <label htmlFor="nuts"> <input type="checkbox" id="nuts" name="allergen" value="Nuts" /> Nuts</label>

                    <span><strong>Nutrition info (per serving): </strong></span>

                    <label htmlFor="calories"> Calories <input type="number" id="calories" name="nutrition" required /> Kcal </label>
                    <label htmlFor="total_fat_g"> Total Fat <input type="number" id="total_fat_g" name="nutrition" required /> g </label>
                    <label htmlFor="sat_fat_g"> Sat Fat <input type="number" id="sat_fat_g" name="nutrition" required /> g </label>
                    <label htmlFor="trans_fat_g"> Trans Fat <input type="number" id="trans_fat_g" name="nutrition" required /> g </label>
                    <label htmlFor="fiber_g"> Fiber <input type="number" id="fiber_g" name="nutrition" required /> g </label>
                    <label htmlFor="cholesterol_mg"> Cholesterol <input type="number" id="cholesterol_mg" name="nutrition" required /> mg </label>
                    
                    <label htmlFor="sodium_mg"> Sodium <input type="number" id="sodium_mg" name="nutrition" required /> mg </label>
                    <label htmlFor="sugar_g"> Sugar <input type="number" id="sugar_g" name="nutrition" required /> g </label>
                    <label htmlFor="total_carbs_g"> Total Carbs <input type="number" id="total_carbs_g" name="nutrition" required /> g </label>
                    <label htmlFor="protein_g"> Protein <input type="number" id="protein_g" name="nutrition" required /> g </label>

                    <label htmlFor="iron_per"> Iron <input type="number" id="iron_per" name="nutrition" required /> % </label>
                    <label htmlFor="calc_per"> Calcium <input type="number" id="calc_per" name="nutrition" required /> % </label>
                    <label htmlFor="vit_a_per"> Vitamin A <input type="number" id="vit_a_per" name="nutrition" required /> % </label>
                    <label htmlFor="vit_c_per"> Vitamin C <input type="number" id="vit_c_per" name="nutrition" required /> % </label>

                    {/* <input type="submit" value="Add Food to Custom Meals" /> */}
                    <input type="submit" value="Add Food to Custom Meals" />
                    <button onClick={this.props.hideCustomForm}>Cancel</button>

                    
                </form>
            </div>
        );
    }

    
    /**
     * Adds the meal to the "meals" collection with name as the doc id. Then calls the parent's hideCustomForm() 
     * @param {event} e 
     */
    formSubmit(e) {
        e.preventDefault();
        // get user email (for the "created_by" field)
        let user = JSON.parse(localStorage.getItem("loggedinuser"));
        let form = e.target;
        let allergens = form.allergen;  // get all the allergen checkboxes 
        let temp_allergens = [];    // temp array to store allergens as strings

        let nutrition = form.nutrition; // get all nutrition fields
        let temp_nutrition = {};
        // Fill the allergens array
        for (let i = 0; i < allergens.length; i++) {
            if (allergens[i].checked) {
                temp_allergens.push(allergens[i].value);
                console.log(allergens[i].id);
            }
        }
        console.log(temp_allergens);
        // Fill the nutrition map
        for (let i = 0; i < nutrition.length; i++) {
            temp_nutrition[nutrition[i].id] = nutrition[i].value;
        }
        console.log(temp_nutrition);
        
        // Crete the meal object 
        let meal_obj = {
            name: form.mealname.value.trim(),
            allergens: temp_allergens,
            nutrition: temp_nutrition,
            location: "Custom Meals",
            date: "",   // not implemented
            created_by: user.email,
        }

        // Add the meal object to the "meals" collection (with name field as the id)
        db.collection("meals").doc(meal_obj["name"]).set(meal_obj).then(() => {
            console.log(`Just added ${meal_obj.name} to "meals" collection`);

            // Add the meal to the "Custom Meals" location
            db.collection("locations").doc("Custom Meals").update({
                "meals": firebase.firestore.FieldValue.arrayUnion(meal_obj.name)
            }).then(() => {
                alert("Meal added to Custom Meals! Select 'Custom Meals' dropdown option in the Menu page to find it.");
                this.props.hideCustomForm();    
            });
            
        });
        
        
    }



}

export default CustomForm