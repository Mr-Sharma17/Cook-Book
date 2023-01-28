const q = document.getElementById('query');
const btn = document.getElementById('searchBtn');
const container = document.getElementById('container');


//fetching data logic
const getMeal = async () => {
    try {
        btn.style.scale = 0.9;
        btn.innerText = "Searching...";
        container.innerHTML = `<div><h1>Loading...</h1></div>`;
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q.value.trim()}`);
        const data = await res.json();
        btn.innerText = "Search";
        btn.style.scale = 1;
        const myMeal = data.meals[0]; //assigning data forcefully for ease
        appendMeal(myMeal); //appending data after fetching
    } catch (error) {
        btn.innerText = "Search";
        btn.style.scale = 1;
        console.log(error);
        //this info will render when error occurs
        container.innerHTML = `<div id='error-card' >
            <h1>No result found for your Searched Dish. Please try with different Dish.</h1>
            <p>maybe there is some spelling mistake or we don't have any recipe for this meal.</p>
        </div>`;
    }
};


//here appending data
const appendMeal = (myMeal) => {

    container.innerHTML = null;

    //creating elements using JS
    let div = document.createElement('div');
    div.id = 'meal-card';

    let img = document.createElement('img');
    img.src = myMeal.strMealThumb;
    img.alt = myMeal.strMeal;
    let name = document.createElement('h2');
    name.innerText = 'Dish Name : ' + myMeal.strMeal;
    let country = document.createElement('h4');
    country.innerText = 'Cuisine : ' + myMeal.strArea;
    let category = document.createElement('p');
    category.innerText = 'Categorised in ' + '"' + myMeal.strCategory + ' Dish"';
    let detailBtn = document.createElement('button');
    detailBtn.innerText = 'Show Details';
    detailBtn.id = 'mealDetailBtn';
    detailBtn.addEventListener('click', () => {
        //logic for showing meal details
        container.innerHTML = null;

        //here getting ingredients and their measure from data
        //as both are presented as single elements in data
        let count = 1; //for maping ingredient with measure
        const ingredients = []; //for pushing the maped data
        for (let i in myMeal) {
            let ingredient = "";
            let measure = "";
            //checking if in data our desired keyword is or not
            if (i.startsWith("strIngredient") && myMeal[i]) {
                ingredient = myMeal[i];
                measure = myMeal[`strMeasure` + count];
                count += 1;
                ingredients.push(`${measure} ${ingredient}`);
            }
        };

        //after getting the ingredients diaplaying required data
        container.innerHTML =
            `<div id='main-div' >
            <div class='top-div' >
                <div class='img-div' >
                    <img src=${myMeal.strMealThumb} alt=${myMeal.strMeal}>
                </div>
                <div class='briefDetails-div' >
                    <h2>Dish Name : ${myMeal.strMeal}</h2>
                    <h4>Cuisine : ${myMeal.strArea} cuisine</h4>
                    <p>Categorised in "${myMeal.strCategory} Dish"</p>
                </div>
            </div>
            <div class='ingredient-div' >
                <h2><u>Ingredients</u></h2>
            </div>
            <div class='instructions-div' >
                <h2><u>Instructions</u></h2>
                <h5>${myMeal.strInstructions}</h5>
            </div>
        </div>`;

        let ingredientDiv = document.querySelector('.ingredient-div');
        let parent = document.createElement('ul');
        parent.className = 'ingredients-list';

        //looping through the ingredients data and
        //rendering them in form of lists elements
        ingredients.forEach((items) => {
            let child = document.createElement('li');
            child.innerText = items;

            parent.append(child);
            ingredientDiv.append(parent);
        });
    });

    div.append(img, name, country, category, detailBtn);
    container.append(div);
};


btn.addEventListener('click', getMeal);
