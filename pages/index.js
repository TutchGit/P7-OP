import{recipes} from "../data/recipes.js";

let listAppareilsTag = [];
let listUstensilsTag = [];
let listIngredientTag = [];

function launchingFactory(recipes){
    document.getElementById("catalogue-recettes").innerHTML = "";
    console.table(recipes);
    for(let i=0; i<recipes.length; i++) {
        recipesFactory(recipes[i])
    }
}

document.getElementById("form-search").addEventListener("input", function(event){
    event.preventDefault();

    searchByMethod(event.target.value.toLowerCase());
    console.log(event.target.value);
});

function searchByMethod(value){

    const currentLength = value.length;

    if(currentLength >= 3){

        let result = recipes.filter(recipe =>{
            if(recipe.name.toLowerCase().includes(value) || recipe.description.toLowerCase().includes(value)) {
                return recipe;
            }
            let ingredientFounded = false;
            recipe.ingredients.forEach(element => {
                if(element.ingredient.toLowerCase().includes(value)) {
                    console.log(element)
                    ingredientFounded = true;
                }
            })
            if (ingredientFounded) {
                return recipe;
            }
        });
        launchingFactory(result);
    }

    if (currentLength == 0){
        launchingFactory(recipes);
    }
}

function createArrayIngredient() {

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(element =>{
            if (!listIngredientTag.includes(element.ingredient)) {
                listIngredientTag.push(element.ingredient);
            }
        })
    })
    // console.table(listIngredientTag);
}

function createArrayUstensils() {

    recipes.forEach(recipe =>{
        recipe.ustensils.forEach(ustensil =>{
            if (!listUstensilsTag.includes(ustensil)) {
                listUstensilsTag.push(ustensil)
            }
        })
    })
    // console.table(listUstensilsTag);
}

function createArrayAppareils() {

    recipes.forEach(recipe =>{
        if (!listAppareilsTag.includes(recipe.appliance)) {
            listAppareilsTag.push(recipe.appliance);
        }
    })
    // console.table(listAppareilsTag);
}


function launchingTagFactory() {

}


function init() {
    createArrayAppareils();
    createArrayUstensils();
    createArrayIngredient();
    launchingFactory(recipes);
}

init();