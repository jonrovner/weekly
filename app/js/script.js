var thingToDrag = "";
var ingredientsToAdd = [];
var ingredientsToShop = [];
        
const defaultDishes = [
                        {name: "Falafel",
                        desc: "Fryed balls of Soaked cheekpeas, grounded with persil, garlic and coriander, served in a pita bread, with fresh veggies (letuce, tomato, cabbage, cucumber) topped with mint yoghurt sauce",
                        ingredients: [
                                    "cheekpeas", 
                                    "persil", 
                                    "coriander", 
                                    "pita bread", 
                                    "yoghurt sauce"],
                        image: "img/pexels-ella-olsson-1640777.jpg"            
                        },
                        {name: "empanadas",
                        desc: "Baked turnover filled with tuna, onions, potatoes and olives",
                        ingredients: [
                                    "dough", 
                                    "tuna", 
                                    "potatoes", 
                                    "onions",
                                    "olives"],
                        image: "img/pexels-daria-shevtsova-704569.jpg"

                        },
                        {name:"cuban rice",
                        desc:"White rice with fried bananas, egg and susage",
                        ingredients: [
                                      "rice",
                                      "bananas",
                                      "eggs",
                                      "sausages"],
                        image: "img/pexels-jane-d-1092730.jpg"
                        },
                        {name:"pasta",
                        desc: "no need for description here. Plain old italian pasata with tomato sause and cheese",
                        ingredients: [
                                      "noodles",
                                      "tomatoes",
                                      "garlic",
                                      "cheese"
                        ],
                        image: "img/pexels-ella-olsson-1640777.jpg"
                        },
                        {name:"milanesas",
                        desc:"breaded beef with potatoes",
                        ingredients: [
                            "beef",
                            "bread",
                            "eggs",
                            "garlic",
                            "potatoes"
                            ],
                        image: "img/pexels-lumn-1410236.jpg"
                        },
                        {name:"hamburguesas",
                        desc:"clasic hamburguer",
                        ingredients:["pattys", "buns", "tomato", "onion", "bacon", "pckles"],
                        image: "img/pexels-jonathan-borba-2983101.jpg"

                        },
                        {name:"baked beef",
                        desc: "baked beef",
                        ingredients: ["beef", "onions", "potatoes", "sweet potatoes"],
                        image: "img/pexels-william-choquette-2641886.jpg"

                        },
                        {name: "baked chicken",
                        desc: "good old baked chicken with potatoes",
                        ingredients: ["chicken", "potatoes"],
                        image: "img/pexels-julie-aagaard-2097090.jpg"

                        }
                        ];
                        
        function getDishes(){
            if (localStorage.getItem("dishes")===null){
            return defaultDishes.slice();
            }      
            return JSON.parse(localStorage.getItem("dishes"));
        }
     
        function populateMenu() {
            const dishes = getDishes();         
            dishes.forEach(function(d) {
                const dish = d.name;
                const food = document.createElement("div");
                food.classList.add("menuitem");
                food.innerHTML = ` 
                        <img src="${d.image}" alt="" class="cardImage"/> 
                        <p class=\"dishTitle\" draggable=\"true\" ondragstart=\"drag(this)\">${dish}</p>
                        <div class=\"dishControls\"> 
                            <button onclick=\"editDish(this)\">✏️</button>
                            <button onclick=\"deleteDish(event)\">x</button>
                        </div>

                        <div class=\"ingredientsList\" id=\"${dish}\"></div>
                        `;

                $('#menu').append(food);
                //document.getElementById(dish).innerHTML = ings.join(", ");
                });
            
            $('.menuitem').on('mouseleave', handleMouseLeave);

            localStorage.setItem("dishes", JSON.stringify(dishes));
        }
        
        function handleMouseOver(e){
            e.parentElement.classList.add("overed");    
        }
        
        function handleMouseLeave(e){
            e.currentTarget.classList.remove("overed");
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
          $("#ingredientsToAdd").append(ing);
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
          
          $("#menu").html("");
          populateMenu();
          
          $("#ingredientsToAdd").html("");
          ingredientsToAdd = [];
          
          $('.addDishes').removeClass("visible");
          $('.addDishes').reset();
        }

        function openAddDishForm(){
            $('.addDishes').addClass("visible");
        }

        function closeAddForm(){
        $('.addDishes').removeClass("visible");
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

        function deleteDish(event){
            console.log(event.path[2].children[1].innerText)
            const dishName = event.path[2].children[1].innerText;
            var dishes = JSON.parse(localStorage.getItem("dishes"));
            const newDishes = dishes.filter(x => x.name !== dishName);
            localStorage.setItem("dishes", JSON.stringify(newDishes));
            $("#menu").html("");
            populateMenu();
        }

        function showInfo(e){
   
            e.path[1].children[3].classList.toggle("show")
            
        }
        function hideInfo(e){
            e.path[1].children[3].classList.remove("show")

        }

        async function searchFood(word){
            const queryString = 'https://api.spoonacular.com/recipes/complexSearch?query='+word+'&number=6&apiKey=45a509a08a1c4651bdbabf4f47f98725&addRecipeInformation=true'
            const response = await fetch(queryString)
            const data = await response.json()
            return data   
        }
          
        async function displayMatches(){
            document.querySelector('.recipes').innerHTML = ""
            const recipes = await searchFood(this.value)
            recipes.results.forEach( recipe => {
                console.log(recipe)
                var element = document.createElement("div")
                element.id = recipe.id      
                const html =  `
                    
                    <h3>${recipe.title}</h3>
                    <img src=${recipe.image} alt=${recipe.title} width="100" height="100">
                    <button onclick="addToMyList">Add</button>
                    <div class="info">
                        <h3>${recipe.title}</h3>
                        <p>${recipe.summary}</p>
                        <h5>Ingredients</h5>
                        <p class="ingredients"></p>
                        <h5>Instructions</h5>
                        <p>${recipe.analyzedInstructions[0].steps[0].step}</p>    
                    </div>`
                 
                element.classList.add("recipe")
                element.innerHTML = html
                const ingredients = recipe.analyzedInstructions[0].steps[0].ingredients
                //element.addEventListener('click', showInfo)
                
                document.querySelector('.recipes').append(element)
                var text = ""
                ingredients.forEach(i => {text += i.name+", "})
                element.querySelector('.ingredients').innerText=text
            })                  
        }
        function addToMyList(e){
            console.log(e)
            const objectToadd = {
                name: "dish.name",
                ingredients: "dish.ingredients",
                image: "dish.image"
            }
            const dishes = getDishes()
            const newDishes = dishes.concat(objectToadd)
            localStorage.setItem("dishes", JSON.stringify(newDishes));
            populateMenu();

        }
          
    document.querySelector('.search').addEventListener('change', displayMatches)
    //document.querySelector('.recipes').addEventListener('click', showInfo)
    populateMenu();
    $('#addIngredient').on('click', addIngredient);
    $('#newDish').on('click', addDish); 
    $('.menuitem').on('mouseleave', handleMouseLeave);
    $('.main').on('click', handleWeekClick);
    