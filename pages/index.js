import{recipes} from "../data/recipes.js";

let listAppareilsTag = [];                                                          /* Liste des tags des appareils */
let listUstensilsTag = [];                                                          /* Liste des tags des ustensiles */
let listIngredientTag = [];                                                         /* Liste des tags des ingrédients */
let tagUsed = [];                                                                   /* Liste des tags selectionnés et utilisés */
let result = recipes;                                                               /* Copie les recettes de recipes.js pour pouvoir être modifié ensuite */
let valueSearch = "";                                                               /* Le contenu de la barre de recherche général. Vide au départ */
const tagsOn = document.getElementById("tags-on");                                  /* Element HTML qui doit contenir les blocs de chaque tag utilisés. Vide au départ */

function launchingFactory(recipes){                                                 /* Boucle sur chaque recipes (parametre) pour affichage les differentes recettes */
    document.getElementById("catalogue-recettes").innerHTML = "";
    for(let i=0; i<recipes.length; i++) {
        recipesFactory(recipes[i])
    }
}

document.getElementById("form-search").addEventListener("input", function(event){   /* Lance la function searchByMethod à chaque input dans la barre de recherche */
    event.preventDefault();

    valueSearch = event.target.value.toLowerCase();                                 /* Attention à mettre toLowerCase() pour éviter les soucis d'objets non trouvés à cause d'une majuscule ! */
    searchByMethod(valueSearch);
});

function searchByMethod(valueSearch){                                               /* Fonction de recherche principale */

    const currentLength = valueSearch.length;
    
    if(currentLength >= 3){
        let result = [];

        for (let i = 0; i<recipes.length; i++) {
            const recipe = recipes[i];
            const name = recipe.name.toLowerCase();
            const description = recipe.description.toLowerCase();
            const nameNoAccent = recipe.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const descriptionNoAccent = recipe.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (name.includes(valueSearch) 
            || description.includes(valueSearch) 
            || nameNoAccent.includes(valueSearch) 
            || descriptionNoAccent.includes(valueSearch))
             {
                    result.push(recipe);
            }
            let matchFounded = false;

            if(!matchFounded) {
                for (let i = 0; i<recipe.ingredients.length; i++) {
                const ingredient = recipe.ingredients[i].ingredient.toLowerCase();
                const ingredientNoAccent = recipe.ingredients[i].ingredient.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                
                    if (ingredient.includes(valueSearch) 
                    || ingredientNoAccent.includes(valueSearch))
                    {
                    result.push(recipe);
                    matchFounded = true;
                    }
                }
            };

            if (!matchFounded || result.length <=1) {
                document.getElementById("recipe-not-found").style.display = "flex";
            } else if (matchFounded) {
                document.getElementById("recipe-not-found").style.display = "none";
            }
        launchingFactory(result);                                                   /* Lance la factory avec uniquement les recettes disponibles dans result */
        resetTagLists();
        }
    }

    if (currentLength < 3 && tagsOn.childNodes.length >= 1) {                       /* Permet de ne prendre en compte QUE la fonction recherche par tag */
        searchByTagSelected();
        resetTagLists();
    }

    if (currentLength < 3 && tagsOn.childNodes.length === 0){                      /* Permet de reset l'affichage de toute les recettes disponibles */
        launchingFactory(recipes);
        resetTagLists();
        document.getElementById("recipe-not-found").style.display = "none";
    }

    displayTags();
};

document.getElementById("input-ingredients-tag").addEventListener("input", function(event) {
    
    let valueIngredientSearch = event.target.value.toLowerCase();
    const type = "ingredient";
    searchTags(type, valueIngredientSearch);
});
                                                                                                        /* Lance la fonction search tag en fonction de l'element selectionné.*/
document.getElementById("input-appareils-tag").addEventListener("input", function(event) {              /* L'élement indique le parametre "type", important pour la suite    */
    
    let valueAppareilSearch = event.target.value.toLowerCase();
    const type = "appareil";
    searchTags(type, valueAppareilSearch);
});

document.getElementById("input-ustensiles-tag").addEventListener("input", function(event) {
    
    let valueUstensileSearch = event.target.value.toLowerCase();
    const type = "ustensile";
    searchTags(type, valueUstensileSearch);
});

function searchTags(type, valueTagSearch) {                                         /* Fonction de recherche et d'affichage des tags de chaque type de liste */
                                                                                    /* nom des lites : ingredients, appareils, ustensiles                    */
    const currentLength = valueTagSearch.length;

    if (currentLength >= 3) {                                                       /* Identique à la recherche general : Doit avoir plus de 3 caractères pour fonctionner */
        
        if (type == "ingredient") {
            listIngredientTag = [];                                                 /* Important ! Les listes doivent être resets ! Sert pour la fonction displayTags() */
            result.forEach(recipe => {
                recipe.ingredients.forEach(element => {
                    if (element.ingredient.toLowerCase().includes(valueTagSearch) && !listIngredientTag.includes(element.ingredient)) {
                        listIngredientTag.push(element.ingredient);
                    }                                                               /* note : ne pas oublier le "toLowerCase()" pour éviter les soucis de majuscules. */
                })                                                                  /* Pour éviter la répétition d'un tag déjà selectionné à la suite d'un autre tag,*/
            })                                                                      /* penser à ajouter la condition "si l'element n'est pas dejà dans la liste"      */
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
        resetTagLists();
    }
    displayTags();
}

function createArrayIngredient() {                                                  /* Créer le tableau de la liste des tags d'ingredient */

    result.forEach(recipe => {                                                      /* Selectionne chaque ingredient de chaque recipe du tableau result */
        recipe.ingredients.forEach(element =>{
            if (                                                            
                !listIngredientTag.includes(element.ingredient)                     /* Condition : Si n'est pas inclus déjà dans la liste ET */
                && tagUsed.find(tag => {                                            /* que dans le tableau "tagUsed" il y a une similitude avec l'ingredient */
                    return tag.tag == element.ingredient
                }) == undefined
            ) 
            {
                listIngredientTag.push(element.ingredient);                         /* Push l'ingredient dans la liste */
            }
        })
    })
};

function createArrayUstensils() {                                                   /* Créer le tableau de la liste des tags d'ustensile */

    result.forEach(recipe =>{
        recipe.ustensils.forEach(ustensil =>{
            if (
                !listUstensilsTag.includes(ustensil)
                && tagUsed.find(tag => {
                    return tag.tag == ustensil
                }) == undefined
            ) 
            {
                listUstensilsTag.push(ustensil)
            }
        })
    })
};

function createArrayAppareils() {                                                   /* Créer le tableau de la liste des tags d'appareils */

    result.forEach(recipe =>{
        if (
            !listAppareilsTag.includes(recipe.appliance)
            && tagUsed.find(tag => {
                return tag.tag == recipe.appliance
            }) == undefined
        ) 
        {
            listAppareilsTag.push(recipe.appliance);
        }
    })
};

function displayTags() {                                                            /* Affiche la liste des tags dans chaque liste différentes */
    const ingredientHTML = document.getElementById("ingredients-tags");
    const appareilHTML = document.getElementById("appareils-tags");
    const ustensileHTML = document.getElementById("ustensiles-tags");
                                                                                    /* Selectionne l'HTML de chaque liste de tag et la remet à zéro */
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

function makeTagClickable() {                                                       /* Rend chaque tag affiché dans leur liste respectif clickable pour lancer la fonction addtag() */
    document.querySelectorAll(".tag-name-list").forEach(element => {
        element.addEventListener("click", (event) => {
            addTag(event.target.dataset.type, element.textContent);
        })
    }
)};

function addTag(type, tag){                                                         /* Créer l'icone du tag selectionné au dessus des listes des tags */
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

     document.getElementById(`delete-tag-${tag}`).addEventListener("click", () => { /* Permet de lier la fonction de suppression du tag à l'icone de croix */
        deleteTagFromTagSelected(type, tag);
     })

     tagUsed.push({                                                                 /* Push le tag selectionné dans le tableau "tagused" afin d'éviter sa réappartion dans */
        type: type,                                                                 /* la liste de tag si un autre tag devrait être utilisé (car la liste est reset à chaque fois) */
        tag: tag
     });

     searchByTagSelected();                                                         /* Lance la fonction de recherche en fonction des tags */
};

function deleteTagFromTagSelected(type, tag) {                                      /* Supprime le tag visuellement et du tableau des tags utilisés */
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

    tagPutBackInList.addEventListener("click", (event) => {                         /* Permet au tag remis d'être de nouveau clickable */
        addTag(event.target.dataset.type, tagPutBackInList.textContent);
    })

    tagUsed = tagUsed.filter((element) => {                                         /* Filtre le tag supprimé pour le retirer de la liste "tagUsed" */
        return element.tag !== tag;
    })

    result = recipes;                                                               /* reset la liste des recettes */
    resetTagLists();                                                                /* reset la liste des tags */
    
    searchByMethod(valueSearch);                                                    /* relance une recherche general */
    searchByTagSelected();                                                          /* PUIS relance une recherche par tag */
}

function searchByTagSelected() {                                                    /* Fonction de recherche par tag selectionés*/

    const currentLength = valueSearch.length;
    
    tagUsed.forEach(tag => {                                                        /* tagUsed possède deux paramètre => type puis tag */
        let lowerCaseTag = tag.tag.toLowerCase();

        result = result.filter(recipe =>{
            
            let matchTagFounded = false;                                            /* Système identique à la fonction "searchByMethod" pour éviter les duplicatas */

            if (tag.type == "ingredient") {                                         /* Premier paramètre de "tagUsed" verifié : le type */
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
    resetTagLists();

    if (tagsOn.childNodes.length === 0 && currentLength >=3) {                      /* Permet la recherche général si il n'y a aucun tag selectionné */
        result = recipes;                                                           /* La liste des recettes doit être reset avant ! */
        searchByMethod(valueSearch);
    }
    
    if (tagsOn.childNodes.length === 0 && currentLength < 3) {                      /* Si aucune recherche valide, affiche toute les recettes */
        launchingFactory(recipes);
    }

    displayTags();
};

document.querySelectorAll(".fa-angle-down").forEach(element => {                    /* Ferme toutes les listes avant d'ouvrir la correspondantes */
    element.addEventListener("click", () => {                                       /* Verifier quel element à été cliqué */
        closeList("ingredients");
        closeList("appareils");
        closeList("ustensiles");
        openList(element.id.split("-")[0]);
    })
});

document.querySelectorAll(".fa-angle-up").forEach(element => {
    element.addEventListener("click", () => {
        closeList(element.id.split("-")[0]);
    })
});

function resetTagLists () {                                                         /* Vide chaque liste de tag, avant de recréer les tableaux en fonction du tableau result */
    listIngredientTag = [];
    listAppareilsTag = [];
    listUstensilsTag = [];
    createArrayIngredient();
    createArrayAppareils();
    createArrayUstensils();
}

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

function init() {                                                                   /* A L'OUVERTURE DE LA PAGE : */
    createArrayAppareils();                                                         /* Créer le tableau des tags des appareils */
    createArrayUstensils();                                                         /* Créer le tableau des tags des ustensiles*/
    createArrayIngredient();                                                        /* Créer le tableau des tags des ingrédients */
    displayTags();                                                                  /* Affiche dans chaque listes appropriés les noms des tags + lance ensuite "makeTagClickable()" */
    launchingFactory(recipes);                                                      /* Affiche toute les recettes disponibles sans aucun filtre */
}

init();