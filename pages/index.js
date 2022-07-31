import{recipes} from "../data/recipes.js";

let listAppareilsTag = [];
let listUstensilsTag = [];
let listIngredientTag = [];
let tagUsed = [];
let result = recipes;
let valueSearch = "";
const tagsOn = document.getElementById("tags-on");

function launchingFactory(recipes){
    document.getElementById("catalogue-recettes").innerHTML = "";
    console.table(recipes);
    for(let i=0; i<recipes.length; i++) {
        recipesFactory(recipes[i])
    }
}

document.getElementById("form-search").addEventListener("input", function(event){
    event.preventDefault();

    valueSearch = event.target.value.toLowerCase();
    searchByMethod(valueSearch);
});

function searchByMethod(valueSearch){

    const currentLength = valueSearch.length;

    if(currentLength >= 3){

        result = recipes.filter(recipe =>{
            if(recipe.name.toLowerCase().includes(valueSearch) || recipe.description.toLowerCase().includes(valueSearch)) {
                return recipe;
            }
            let ingredientFounded = false;
            recipe.ingredients.forEach(element => {
                if(element.ingredient.toLowerCase().includes(valueSearch)) {
                    ingredientFounded = true;
                }
            })
            if (ingredientFounded) {
                return recipe;
            }
        });
        launchingFactory(result);
        listIngredientTag = [];
        listAppareilsTag = [];
        listUstensilsTag = [];
        createArrayAppareils();
        createArrayIngredient();
        createArrayUstensils();
    }

    if (currentLength < 3 && tagsOn.childNodes.length >= 1) {
        result = recipes;
        searchByTagSelected();
    }

    if (currentLength < 3 && tagsOn.childNodes.length === 0){
        result = recipes;
        launchingFactory(recipes);
        listIngredientTag = [];
        listAppareilsTag = [];
        listUstensilsTag = [];
        createArrayIngredient();
        createArrayAppareils();
        createArrayUstensils();
    }

    displayTags();
};

document.getElementById("input-ingredients-tag").addEventListener("input", function(event) {
    
    let valueIngredientSearch = event.target.value.toLowerCase();
    const type = "ingredient";
    searchTags(type, valueIngredientSearch);
});

document.getElementById("input-appareils-tag").addEventListener("input", function(event) {
    
    let valueAppareilSearch = event.target.value.toLowerCase();
    const type = "appareil";
    searchTags(type, valueAppareilSearch);
});

document.getElementById("input-ustensiles-tag").addEventListener("input", function(event) {
    
    let valueUstensileSearch = event.target.value.toLowerCase();
    const type = "ustensile";
    searchTags(type, valueUstensileSearch);
});

function searchTags(type, valueTagSearch) {
    
    const currentLength = valueTagSearch.length;

    if (currentLength >= 3) {
        
        if (type == "ingredient") {
            listIngredientTag = [];
            result.forEach(recipe => {
                recipe.ingredients.forEach(element => {
                    if (element.ingredient.toLowerCase().includes(valueTagSearch) && !listIngredientTag.includes(element.ingredient)) {
                        listIngredientTag.push(element.ingredient);
                    }
                })
            })
        } else if (type == "appareil") {
            listAppareilsTag = [];
            result.forEach(recipe => {
                if(recipe.appliance.toLowerCase().includes(valueTagSearch) && !listAppareilsTag.includes(recipe.appliance)) {
                    listAppareilsTag.push(recipe.appliance);
                }
            })
        } else if (type == "ustensile") {
            listUstensilsTag = [];
            result.forEach(recipe => {
                recipe.ustensils.forEach(ustensil => {
                    if (ustensil.toLowerCase().includes(valueTagSearch) && !listUstensilsTag.includes(ustensil)) {
                        listUstensilsTag.push(ustensil);
                    }
                })
            })
        }
    }

    if (currentLength < 3) {
        listIngredientTag = [];
        listAppareilsTag = [];
        listUstensilsTag = [];
        createArrayIngredient();
        createArrayAppareils();
        createArrayUstensils();
    }
    displayTags();
}

function createArrayIngredient() {

    result.forEach(recipe => {
        recipe.ingredients.forEach(element =>{
            if (!listIngredientTag.includes(element.ingredient)) {
                listIngredientTag.push(element.ingredient);
            }
        })
    })
};

function createArrayUstensils() {

    result.forEach(recipe =>{
        recipe.ustensils.forEach(ustensil =>{
            if (!listUstensilsTag.includes(ustensil)) {
                listUstensilsTag.push(ustensil)
            }
        })
    })
};

function createArrayAppareils() {

    result.forEach(recipe =>{
        if (!listAppareilsTag.includes(recipe.appliance)) {
            listAppareilsTag.push(recipe.appliance);
        }
    })
};

function displayTags() {
    const ingredientHTML = document.getElementById("ingredients-tags");
    const appareilHTML = document.getElementById("appareils-tags");
    const ustensileHTML = document.getElementById("ustensiles-tags");
    ingredientHTML.innerHTML = "";
    appareilHTML.innerHTML = "";
    ustensileHTML.innerHTML = "";

    listIngredientTag.forEach(tag => {
        ingredientHTML.innerHTML += `<p data-type="ingredient" data-id="${tag}" class="tag-name-list">${tag}</p>`;
    });
    listAppareilsTag.forEach(tag => {
        appareilHTML.innerHTML += `<p data-type="appareil" data-id="${tag}" class="tag-name-list">${tag}</p>`;
    });
    listUstensilsTag.forEach(tag => {
        ustensileHTML.innerHTML += `<p data-type="ustensile" data-id="${tag}" class="tag-name-list">${tag}</p>`;
    });

    makeTagClickable();
};

function makeTagClickable() {
    document.querySelectorAll(".tag-name-list").forEach(element => {
        element.addEventListener("click", (event) => {
            addTag(event.target.dataset.type, element.textContent);
        })
    }
)};

function addTag(type, tag){
     const tagBlock = document.createElement("div");
     const tagName = document.createElement("p");
     const deleteTag = document.createElement("i");
     const tagsOn = document.getElementById("tags-on");

     tagBlock.classList.add("tag-block");
     tagBlock.classList.add(`tag-block-${type}`);
     tagBlock.setAttribute("id", `tag-${tag}`);
     tagName.setAttribute("class", "tag-name");
     deleteTag.setAttribute("class", "delete-tag-button");
     deleteTag.setAttribute("id", `delete-tag-${tag}`);

     tagName.innerText = tag;
     deleteTag.innerHTML = `<i class="far fa-times-circle"></i>`;

     tagBlock.appendChild(tagName);
     tagBlock.appendChild(deleteTag);
     tagsOn.appendChild(tagBlock);

     deleteTagFromList(tag);

     document.getElementById(`delete-tag-${tag}`).addEventListener("click", () => {
        deleteTagFromTagSelected(type, tag);
     })

     tagUsed.push({
        type: type,
        tag: tag
     });

     searchByTagSelected();
};

function deleteTagFromList(tag) {
    const tagBlock = document.querySelector(`[data-id="${tag}"]`);

    tagBlock.remove();
};

function deleteTagFromTagSelected(type, tag) {
    const tagBlockSelected = document.getElementById(`tag-${tag}`);
    const tagList = document.getElementById(`${type}s-tags`);
    const tagPutBackInList = document.createElement("p");

    tagPutBackInList.setAttribute("data-type", type);
    tagPutBackInList.setAttribute("data-id", tag);
    tagPutBackInList.setAttribute("checked", "");
    tagPutBackInList.classList.add("tag-name-list");

    tagPutBackInList.innerText = tag;

    tagList.appendChild(tagPutBackInList);

    tagBlockSelected.remove();

    tagPutBackInList.addEventListener("click", (event) => {
        addTag(event.target.dataset.type, tagPutBackInList.textContent);
    })

    tagUsed = tagUsed.filter((element) => {
        return element.tag !== tag;
    })

    result = recipes;
    
    searchByTagSelected();
}

function searchByTagSelected() {

    const currentLength = valueSearch.length;
    
    tagUsed.forEach(tag => {
        let lowerCaseTag = tag.tag.toLowerCase();

        result = result.filter(recipe =>{
            
            let matchTagFounded = false;

            if (tag.type == "ingredient") {
                recipe.ingredients.forEach(element => {
                    if(element.ingredient.toLowerCase().includes(lowerCaseTag)) {
                        matchTagFounded = true;
                    }
                })
            }
            if (tag.type == "appareil") {
                if(recipe.appliance.toLowerCase().includes(lowerCaseTag)) {
                    matchTagFounded = true;
                }
            }
            if (tag.type == "ustensile") {
                recipe.ustensils.forEach(element => {
                    if(element.toLowerCase().includes(lowerCaseTag)) {
                        matchTagFounded = true;
                    }
                })
            }
            if (matchTagFounded) {
                return recipe;
            }
        });
    })
    launchingFactory(result);

    if (tagsOn.childNodes.length === 0 && currentLength >=3) {
        result = recipes;
        searchByMethod(valueSearch);
    }
    
    if (tagsOn.childNodes.length === 0 && currentLength < 3) {
        launchingFactory(recipes);
    }
};

document.querySelectorAll(".fa-angle-down").forEach(element => {
    closeList(element.id.split("-")[0]);
    element.addEventListener("click", () => {
        openList(element.id.split("-")[0]);
    })
});

document.querySelectorAll(".fa-angle-up").forEach(element => {
    element.addEventListener("click", () => {
        closeList(element.id.split("-")[0]);
    })
});

function openList(type) {
    document.getElementById(`${type}-tags`).classList.add("open");
    document.getElementById(`${type}-sort`).style.display = "none";
    document.getElementById(`${type}-angle-down`).style.display = "none";
    document.getElementById(`${type}-angle-up`).style.display = "inline-block";
    document.getElementById(`input-${type}-tag`).style.display = "inline-block";
    document.getElementById(`${type}-block`).classList.add("larger");
}

function closeList(type) {
    document.getElementById(`${type}-tags`).classList.remove("open");
    document.getElementById(`${type}-sort`).style.display = "inline-block";
    document.getElementById(`${type}-angle-down`).style.display = "inline-block";
    document.getElementById(`${type}-angle-up`).style.display = "none";
    document.getElementById(`input-${type}-tag`).style.display = "none";
    document.getElementById(`${type}-block`).classList.remove("larger");
}

function init() {
    createArrayAppareils();
    createArrayUstensils();
    createArrayIngredient();
    displayTags();
    launchingFactory(recipes);
}

init();