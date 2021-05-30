var thingToDrag = "";
var ingredientsToAdd = [];
var ingredientsToShop = [];
var userCredential = "";


       
        function storeKey(event){
            event.preventDefault()
            localStorage.setItem("apiKey", event.target.value)
            //document.querySelector('#apiKey').innerHTML = ""

        }

        function getDishes(){
            if (localStorage.getItem("dishes")===null){
            return "get your api key and search for dishes"
            }      
            return JSON.parse(localStorage.getItem("dishes"));
        }
     
        function populateMenu() {
            const dishes = getDishes();         
            
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
                            <button onclick=\"deleteDish(event)\">x</button>
                        </div>`;
                $('#menu').append(element);
                
                });
            
            

            localStorage.setItem("dishes", JSON.stringify(dishes));
        
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

        function deleteDish(event){
            
            const dishName = event.path[2].children[1].innerText;
            var dishes = JSON.parse(localStorage.getItem("dishes"));
            const newDishes = dishes.filter(x => x.title !== dishName);
            localStorage.setItem("dishes", JSON.stringify(newDishes));
            document.querySelector("#menu").innerHTML = "";
            populateMenu();
        }

        async function showDetails(id){
            
            
            const dishes = JSON.parse(localStorage.getItem("dishes"))
            const queryString = 'https://api.spoonacular.com/recipes/'+id+'/information?&apiKey='+localStorage.getItem("apiKey")
            let data
            if(dishes!==null && dishes.find(dish=>dish.id==id) !== undefined){
                    data = dishes.find(dish=>dish.id==id)
                    
            }
            else{
                const response = await fetch(queryString)
                data = await response.json()
                
            }
           
            localStorage.setItem("temporaryRecipe", JSON.stringify(data)) 
           
            const html = `
                <h1>${data.title}</h1>
                <img src=${data.image}>
                <p class="summary">${data.summary}</p>
                <h2>Ingredients</h2>
                <p class="ingredients"></p>
                <h2>Instructions</h2>
                <p class="instructions">${data.instructions}</p>
                <div class="infoControls">
                <button onclick="addToMyList(this)">Add</button>
                <button type="button" onclick="toggleShow(this)">close</button>
                </div>
            `
            var text = ""
            const element = document.querySelector('.infoWindow')
            element.innerHTML = html
            data.extendedIngredients.forEach(ingredient=>{text += ingredient.name+", "})
            element.querySelector('.ingredients').innerText = text
            element.classList.add("show")
            element.id = id
            window.scrollTo(0,0)
            
        }
        
        function toggleShow(e){
            document.querySelector('.infoWindow').classList.remove("show")
            }

        async function getRandom(event){
            console.log(event)
            event.preventDefault()
            
            const filters = [...event.target]
                        
            if(Array.from(filters[3].value).length<2){
                var tagString = ""
                filters.forEach(filter => filter.value !== "" ? tagString += filter.value+"," : "")
                
                document.querySelector('.recipes').innerHTML = ""
                
                //const queryString = `https://api.spoonacular.com/recipes/random?number=6&tags=${tagString}&apiKey=${localStorage.getItem("apiKey")}`
                const queryString = `/api/random?number=6&tags=${tagString}`
                const response = await fetch(queryString)
                console.log(response)
                //const data = await response.json()
                
                //showRecipes(data.recipes)
            }else{
            displayMatches(filters[3].value, filters)
            }

        }

        function showRecipes(arr){
            console.log(arr)
            arr.forEach(recipe=>{
                console.log(recipe)
                var element = document.createElement("div")
                element.id = recipe.id
                
                
                const html =  `
                    <div class="recipe" onclick="showDetails(this.parentElement.id)">                                        
                    <img src=${recipe.image} alt=${recipe.title}>
                    <h3>${recipe.title}</h3>
                    <button onclick="showDetails(this.parentElement.id)">i</button>
                    </div>`                 
                
                element.innerHTML = html
                                
                document.querySelector('.recipes').append(element)
                                

            })


        }

        async function searchFood(word, optionsString){
            const queryString = 'https://api.spoonacular.com/recipes/complexSearch?query='+word+optionsString+'&number=6&addRecipeInformation=true&apiKey='+localStorage.getItem("apiKey")
            const response = await fetch(queryString)
            const data = await response.json()
            return data   
        }
          
        async function displayMatches(word, filterArray){
            const optionsString = "&diet="+filterArray[0].value+"&cuisine="+filterArray[1].value+"&type="+filterArray[2].value
             console.log("optionsString: ", optionsString)                          
            document.querySelector('.recipes').innerHTML = ""
            const recipes = await searchFood(word, optionsString)
            await showRecipes(recipes.results)                         
        }

        function addToMyList(e){
           
            console.log(e.parentElement)
            const dishes = getDishes()
            const newDishes = dishes.concat(JSON.parse(localStorage.getItem("temporaryRecipe")))
            localStorage.setItem("dishes", JSON.stringify(newDishes));
            populateMenu();

        }
        
        function handleView(e){
            
            if(e.target.value == "search"){
                document.querySelector('.menu').classList.add("hide-for-mobile")
            }
            else{
                document.querySelector('.menu').classList.remove("hide-for-mobile")
            }
        }
    
    populateMenu();
    document.querySelector('#apiKey').addEventListener('change', storeKey) 
    document.querySelector('.main').addEventListener('click', handleWeekClick)
    document.querySelector('.getRandom').addEventListener('submit', getRandom)
    document.querySelector('#viewSelector').addEventListener('change', handleView)
    document.querySelector('.option').addEventListener('click', function(){
    document.querySelector('.option').classList.toggle('selected') 
    })
    
    document.querySelector('#myList').addEventListener('click', function(){
        document.querySelector('#viewSelector').value = "myList"
        document.querySelector('.menu').classList.remove("hide")
    })
    
    document.querySelector('#search').addEventListener('click',function(){
        document.querySelector('#viewSelector').value = 'search'
    })
    
    document.querySelector('.menu').classList.add("hide")
   