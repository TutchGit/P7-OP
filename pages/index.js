import{recipes} from "../data/recipes.js";


function launchingFactory(recipes){
    document.getElementById("catalogue-recettes").innerHTML = "";
    console.table(recipes);
    for(let i=0; i<recipes.length; i++) {
        recipesFactory(recipes[i])
    }
}

document.getElementById("form-search").addEventListener("input", function(event){
    event.preventDefault();

    searchByIteration(event.target.value.toLowerCase());
    console.log(event.target.value);
});

function searchByIteration(value){

        const currentLength = value.length;
        let recipesFiltered = [];

    if(currentLength >= 3){

        for (let i = 0; i<recipes.length; i++) {
            const recipe = recipes[i];
            const name = recipe.name.toLowerCase();
            const description = recipe.description.toLowerCase();

                if (name.includes(value) || description.includes(value)) {
                    recipesFiltered.push(recipe);
                } else {
                for (let i = 0; i<recipe.ingredients.length; i++) {
                    const ingredient = recipe.ingredients[i].ingredient.toLowerCase();
                    
                    if (ingredient.includes(value)) {
                        recipesFiltered.push(recipe);
                    }
                }
            }
        }
        launchingFactory(recipesFiltered);
    }
    if (currentLength == 0){
        recipesFiltered = recipes;
        console.table(recipesFiltered)
        launchingFactory(recipesFiltered);
    }
}

function init() {
    launchingFactory(recipes);
}

init();