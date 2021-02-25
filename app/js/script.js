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
                        image: "img/falafel.jpg"            
                        },
                        {name: "empanadas",
                        desc: "Baked turnover filled with tuna, onions, potatoes and olives",
                        ingredients: [
                                    "dough", 
                                    "tuna", 
                                    "potatoes", 
                                    "onions",
                                    "olives"],
                        image: "img/empanadas.jpg"

                        },
                        {name:"cuban rice",
                        desc:"White rice with fried bananas, egg and susage",
                        ingredients: [
                                      "rice",
                                      "bananas",
                                      "eggs",
                                      "sausages"],
                        image: "img/cuban.jpg"
                        },
                        {name:"pasta",
                        desc: "no need for description here. Plain old italian pasata with tomato sause and cheese",
                        ingredients: [
                                      "noodles",
                                      "tomatoes",
                                      "garlic",
                                      "cheese"
                        ],
                        image: "img/noodles.jpg"
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
                        image: "img/mila.jpg"
                        },
                        {name:"hamburguesas",
                        desc:"clasic hamburguer",
                        ingredients:["pattys", "buns", "tomato", "onion", "bacon", "pckles"],
                        image: "img/burguer.jpg"

                        },
                        {name:"baked beef",
                        desc: "baked beef",
                        ingredients: ["beef", "onions", "potatoes", "sweet potatoes"],
                        image: "img/carnehorno.jpg"

                        },
                        {name: "baked chicken",
                        desc: "good old baked chicken with potatoes",
                        ingredients: ["chicken", "potatoes"],
                        image: "img/parripollo.jpg"

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
                        <p class=\"dishTitle\" draggable=\"true\" ondragstart=\"drag(this)\">${dish}</p>
                        <div class=\"dishControls\"> 
                            <button onclick=\"editDish(this)\">✏️</button>
                            <button onclick=\"deleteDish(this)\">x</button>
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
            const dishName = event.parentElement.parentElement.childNodes[1].innerHTML;
            var dishes = JSON.parse(localStorage.getItem("dishes"));
            const newDishes = dishes.filter(x => x.name !== dishName);
            localStorage.setItem("dishes", JSON.stringify(newDishes));
            $("#menu").html("");
            populateMenu();

        }

        populateMenu();
        $('#addIngredient').on('click', addIngredient);
        $('#newDish').on('click', addDish); 
        $('.menuitem').on('mouseleave', handleMouseLeave);
        $('.main').on('click', handleWeekClick);
    