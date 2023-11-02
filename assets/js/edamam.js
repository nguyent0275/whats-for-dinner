// document on ready (add document on ready later / was not establishing variables correctly inside of it )
// $(function() {

let apiURL = "https://api.edamam.com/api/recipes/v2?";
let searchParameters = {
  per_page: 1,
  type: "public",
  app_id: "47a9652c",
  app_key: "ff96e3cd2cbbce2cf5d87436ee7f0c2d",
};
let searchWords = $(".ingredients");
let searchQuery = Array.from(searchWords)
  .map((e) => e.innerText)
  .join(" ");
searchParameters.q = searchQuery;
let requestURL = apiURL + new URLSearchParams(searchParameters);
console.log("🚀 ~ file: edamam.js:9 ~ searchURL:", requestURL);

async function loadRecipes() {
  let response = await fetch(requestURL);
  let jsonData = await response.json();
  console.log(Object.keys(jsonData));
  console.log(jsonData.hits[0].recipe.label);
}
loadRecipes();

// document on ready ending
// });

// EDAMAM API important object and key:value returns
// hits = different recipes (20 per page request)
//  recipe = name of recipe
// images > thumbnail/small/regular
// source = name of website that the recipe is located
// url = url of website that the recipe is located
// ingredientLines = list of ingredients
// healthLabels = allergen + health concerns (dairyfree/peanutfree)
// calories = amount of calories
// totalTime = cooking time (minutes)
// cuisineType = ethnic background of dish
// mealType = breakfast/lunch/dinner
// dishType = starters/maincourse/sauce or condiments
// yield = servings

// https://realfood.tesco.com/what-can-i-make-with.html
// good reference for a recipe searcher application
// has searchbox that autocompletes and tracks ingredients in a list
// filters recipe by most ingredients that you have
// checks for special diets (vegetarian, vegan, dairyfree, gluten free)

// let ingredients = $("input-text")
// let ingredientsContainer = $("divIngredientContainer")
// let ingredientsList = $(ulIngredients)

// need a function that creates a li and takes the ingredients.value to create/append to the ulIngredients
let ingredientList = $('#ingredient-list')
let userIngredient = $('#user-ingredient').html
console.log(typeof(userIngredient))
// console.log(userIngredient)
$('#add').on("click", renderIngredients)
function renderIngredients(event) {
    event.preventDefault()
    // $('user-ingredient').value
    //create
    // console.log(userIngredient.value)
    let ingredients = $('<li>') 
    console.log(userIngredient)
    ingredients.text(userIngredient)
    //attr
    //append
    ingredientList.append(ingredients)
    // $('#ingredient-list').append($('<li>').text($('user-ingredient').value))
}
// need a function that applies a filter on the search based on pre-existing criterias (append the function as a button to said crtierias)
// search via healthLabels and return recipes that match
const vegetarian = $('#vegetarian')
const vegan = $('#vegan')
const dairyFree = $('#dairy-free')
const glutenFree = $('#gluten-free')
function filterOptions() {
  if (vegetarian.checked) {
    jsonData.hits[0].recipe.healthLabel = "vegetarian"
  }
  if (vegan.checked) {
    jsonData.hits[0].recipe.healthLabel = "vegan"
  }
  if (dairyFree.checked) {
    jsonData.hits[0].recipe.healthLabel = "dairyfree"
  }
  if (glutenFree.checked) {
    jsonData.hits[0].recipe.healthLabel = "glutenfree"
  }

}
// need a forloop that creates <div>, <a>, <p> or <lis>, <ul> with <li> appended to the <ul>
// <div> is the container for each recipe
// <a> is the name of the recipe with a link to the website / use css to give it bigger font size
// <p> or <lis> is the ingredients
// <ul> and <li> is the additional info about dish (cooktime, serving size, and fiters)
let recipeContainer = $('#recipe-container')
$('#submit').on("submit", renderRecipes)
function renderRecipes() {
  for (let i = 0; i < 9; i++) {
    //create
    let recipeDiv = $('<div>')
    let recipeURL = $('<a>')
    let recipeName = $('<h2>')
    //attr
    recipeDiv.addClass("recipes")
    recipeDiv.text("recipediv")
    recipeURL.addClass('url')
    recipeURL.text("url")
    recipeName.text("name")
    //append
    recipeContainer.append(recipeDiv)
    recipeDiv.append(recipeURL)
    recipeDiv.append(recipeName)
  }
}

// need a forloop for that pulls 3 random recipe from api library and display and link them
// grabs the images, url links, and names from the library and appends them to page
