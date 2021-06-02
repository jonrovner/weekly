var thingToDrag = "";
var ingredientsToAdd = [];
var ingredientsToShop = [];

   
 async function getDishes(){
    if (localStorage.getItem("dishes")===null){
        const results = await getRandom(1, "")
        
        localStorage.setItem("dishes", JSON.stringify(results.recipes))
        return results.recipes
    }      
    else {
        return JSON.parse(localStorage.getItem("dishes"))
        
    };
}

async function populateMenu() {
    document.querySelector('#menu').innerText = ""
    const dishes = await getDishes();
         
    dishes.forEach(function(d) {
    const dish = d.title;
    const element = document.createElement("div");
    element.classList.add("menuitem");
    element.id = d.id
    element.innerHTML = ` 
            <img src="${d.image}" alt="" class="cardImage"/> 
            <p class=\"dishTitle\" draggable=\"true\" ondragstart=\"drag(this)\">${dish}</p>
            <div class=\"dishControls\"> 
                <button onclick=\"showDetails(this.parentElement.parentElement.id)\">i</button>
                <button onclick=\"deleteDish(this)\">x</button>
            </div>`;
    document.querySelector('#menu').appendChild(element);  
    });
    
        
}


function handleWeekClick(e){
    
    const content = e.currentTarget.textContent;
    
    var dishes = JSON.parse(localStorage.getItem("dishes"));
    var x = search(content, dishes);
    var arr = x.ingredients;
    arr.forEach((e) => {
        for( var i = 0; i < ingredientsToShop.length; i++)
        { if ( ingredientsToShop[i] === e) { ingredientsToShop.splice(i, 1); }}
    });
    let unique = [...new Set(ingredientsToShop)];
    document.querySelector("#shoppingList").innerHTML = unique.join(", ");

    if (e.currentTarget.textContent !== ""){
        e.currentTarget.textContent = "";
    }
}

function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    thingToDrag = e.innerHTML
    var dishes = JSON.parse(localStorage.getItem("dishes"));
    var x = search(e.textContent, dishes);
    var arr = x.ingredients;
    arr.forEach((e) => ingredientsToAdd.push(e));
}

function search(nameKey, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].name === nameKey) {
            return myArray[i];
            }
        }
}

function drop(e) {
    e.preventDefault();
    document.getElementById(e.target.id).innerHTML = thingToDrag;
    ingredientsToAdd.forEach((i) => ingredientsToShop.push(i));
    ingredientsToAdd = [];
    let unique = [...new Set(ingredientsToShop)];
    document.querySelector("#shoppingList").innerHTML = unique.join(", ");
}

function addIngredient(e){
    e.preventDefault();
    const ingredient = (document.querySelector('[name=ingredient]')).value;
    ingredientsToAdd.push(ingredient);
    var ing = document.createElement("p");
    ing.innerHTML = ingredient;
    document.querySelector("#ingredientsToAdd").appendChild(ing);
    document.querySelector('[name=ingredient]').value= "";
    
}

function addDish(e){
    e.preventDefault();
    let objectToadd = {
        name: (document.querySelector('[name=item]')).value,
        ingredients:ingredientsToAdd,
                };   
    
    var dishes = JSON.parse(localStorage.getItem("dishes"));
    dishes.push(objectToadd);
    localStorage.setItem("dishes", JSON.stringify(dishes));
    
    document.querySelector("#menu").innerHTML = "";
    populateMenu();
    
    document.querySelector("#ingredientsToAdd").innerHTML="";
    ingredientsToAdd = [];
    
}

function openAddDishForm(){
    //$('.addDishes').addClass("visible");
}

function closeAddForm(){
// $('.addDishes').removeClass("visible");
}

function editDish(event){
    const dishName = event.parentElement.parentElement.lastElementChild.id;
    var dishes = JSON.parse(localStorage.getItem("dishes"));
    const dish = dishes.filter(x => x.name == dishName);
    var ings = dish[0].ingredients;
    const form = document.querySelector('.addDishes');
    form.item.value = dishName;
    form.ingredient.value = ings.join(" ");
    deleteDish(event);
    openAddDishForm()
}

function deleteDish(element){
    
    const id = element.parentElement.parentElement.id;
    
    var dishes = JSON.parse(localStorage.getItem("dishes"));
    var newDishes = [];
    for (var i=0; i<dishes.length; i++){
        
        if (dishes[i].id.toString() !== id){
            newDishes.push(dishes[i])
        }
    }
    
    localStorage.setItem("dishes", JSON.stringify(newDishes));
    document.querySelector("#menu").innerHTML = "";
    populateMenu();
}

async function showDetails(id){
    
    const data = await fetch(`/api/${id}`)
    const res = await data.json()
    
    localStorage.setItem("temporaryRecipe", JSON.stringify(res)) 
    
    const html = `
        <h1>${res.title}</h1>
        <img src=${res.image}>
        <p class="summary">${res.summary}</p>
        <h2>Ingredients</h2>
        <p class="ingredients"></p>
        <h2>Instructions</h2>
        <p class="instructions">${res.instructions}</p>
        <div class="infoControls">
        <button onclick="addToMyList(this)">Add</button>
        <button type="button" onclick="toggleShow(this)">close</button>
        </div>
    `
    var text = ""
    const element = document.querySelector('.infoWindow')
    element.innerHTML = html
    res.extendedIngredients.forEach(ingredient=>{text += ingredient.name+", "})
    element.querySelector('.ingredients').innerText = text
    element.classList.add("show")
    element.id = id
    window.scrollTo(0,0)
    document.querySelector('main').classList.add("hide")
    
}

function toggleShow(e){
    document.querySelector('.infoWindow').classList.remove("show")
    document.querySelector('main').classList.remove("hide")
    }

async function getRecipes(event){
    event.preventDefault()
    const filters = [...event.target]
    
    
    if(Array.from(filters[3].value).length<2){
        var tagString = ""
        filters.forEach(filter => filter.value !== "" ? tagString += filter.value+"," : "")
        const data = await getRandom(12, tagString)
        showRecipes(data.recipes)


    }else{
        displayMatches(filters[3].value, filters)
        }

}


async function getRandom(number, tagString){
    const queryString = `/api/random?number=${number}&tags=${tagString}`
    const response = await fetch(queryString)
    const data = await response.json()
    return data
}

function showRecipes(arr){
    
    document.querySelector('.recipes').innerHTML = ""
    arr.forEach(recipe => {
        
        var element = document.createElement("div")
        element.id = recipe.id
      
        const html =  `
            <div class="recipe" onclick="showDetails(this.parentElement.id)">                                        
            <img src=${recipe.image} alt=${recipe.title}>
            <h3>${recipe.title}</h3>
            <button>i</button>
            </div>`                 
        
        element.innerHTML = html
                        
        document.querySelector('.recipes').append(element)
                        

    })
}

async function searchFood(word, optionsString){
    const queryString = `/api/search?word=${word}${optionsString}`
    const response = await fetch(queryString)
    const data = await response.json()
    return data   
}
    
async function displayMatches(word, filterArray){
    const optionsString = "&diet="+filterArray[0].value+"&cuisine="+filterArray[1].value+"&type="+filterArray[2].value
                          
    document.querySelector('.recipes').innerHTML = ""
    const recipes = await searchFood(word, optionsString)
     
    showRecipes(recipes.results)                         
}

 async function addToMyList(e){
   
    const dishes = await getDishes()

    const recipe = JSON.parse(localStorage.getItem("temporaryRecipe"))
    
    
    const existent = dishes.includes(recipe)
    
    if (existent == false){
        dishes.push(recipe)
        
        localStorage.setItem("dishes", JSON.stringify(dishes));
        populateMenu();
    }

}
function handleView(event){
    
    const options = Array.from(document.querySelectorAll('.option'))
    options.forEach(e => e.classList.toggle('selected'))
    if(event.target.id == "myList"){
        document.querySelector('.menu').classList.remove("hide")
    }
    else{
        document.querySelector('.menu').classList.add("hide")
    }
}


populateMenu();

//document.querySelector('.main').addEventListener('click', handleWeekClick)
document.querySelector('.searchForm').addEventListener('submit', getRecipes)
//document.querySelector('.viewSelector').addEventListener('click', handleView)
const options = Array.from(document.querySelectorAll('.option'))
options.forEach(e => e.addEventListener('click', handleView))







