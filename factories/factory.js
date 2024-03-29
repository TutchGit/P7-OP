function recipesFactory(recipe) {                                               /* Fonction permettant l'affichage de chaque recette sur la page */

    const catalogue = document.getElementById("catalogue-recettes");
    const recette = document.createElement("div");
    const image_recette = document.createElement("img");
    const data_recette = document.createElement("div");
    const primary_data = document.createElement("div");
    const title_recette = document.createElement("p");
    const time_recette = document.createElement("div");
    const clock = document.createElement("p");
    const time = document.createElement("p");
    const secondary_data = document.createElement("div");
    const ingredients_list = document.createElement("ul");
    
    const instruction = document.createElement("p");

    recette.setAttribute("class", "recette");
    image_recette.setAttribute("class", "image-recette");
    image_recette.setAttribute("aria-label", "");
    data_recette.setAttribute("class", "data-recette");
    primary_data.setAttribute("class", "primary-data");
    title_recette.setAttribute("class", "title-recette");
    time_recette.setAttribute("class", "time-recette");
    clock.setAttribute("class", "clock");
    time.setAttribute("class", "time");
    secondary_data.setAttribute("class", "secondary-data");
    ingredients_list.setAttribute("class", "ingredients-list");
    instruction.setAttribute("class", "instruction");

    title_recette.textContent = recipe.name;
    clock.innerHTML = `<i class="far fa-clock"></i>`;
    time.textContent = recipe.time;
    instruction.textContent = recipe.description;

    recette.appendChild(image_recette);
    recette.appendChild(data_recette);
    data_recette.appendChild(primary_data);
    primary_data.appendChild(title_recette);
    primary_data.appendChild(time_recette);
    time_recette.appendChild(clock);
    time_recette.appendChild(time);
    data_recette.appendChild(secondary_data);
    secondary_data.appendChild(ingredients_list);
    secondary_data.appendChild(instruction);
    catalogue.appendChild(recette);

    recipe.ingredients.forEach(element => {
        const ingredient = document.createElement("li");
        const ingredientAsked = document.createElement("p");
        const ingredientQuantity = document.createElement("p");

        ingredientAsked.setAttribute("class", "ingredient-asked");
        ingredientQuantity.setAttribute("class", "ingredient-quantity");
        ingredient.setAttribute("class", "ingredient");

        ingredientAsked.textContent = `${element.ingredient}`;
        ingredientQuantity.textContent = `: ${element.quantity?element.quantity:""} ${element.unit?element.unit:""}`;

        ingredient.appendChild(ingredientAsked);
        ingredient.appendChild(ingredientQuantity);
        ingredients_list.appendChild(ingredient);
     });

    return (catalogue);
}