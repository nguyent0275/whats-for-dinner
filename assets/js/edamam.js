// document on ready
$(function () {
  let recipeData = {};
  let savedRecipesData = {};
  // loadRecipes calls 3 functions to get user inputs and fetch from api
  async function loadRecipes() {
    let healthRequirements = getHealthReqs(); // string[]
    let searchQuery = getSearchQuery(); // string
    let results = await searchDatabase(searchQuery, healthRequirements); // Promise <json data from the page>
    return results;
  }

  // getting ingredients from user inputs to make a searchQuery
  function getSearchQuery() {
    let searchWords = $(".ingredient-item > label");
    let query = Array.from(searchWords)
      .map((e) => e.innerText)
      .join(" ");
    return query;
  }

  // getting health labels based on user inputs in checkboxes
  function getHealthReqs() {
    // on function call, variables will be stored with a value of true or false
    const vegetarian = $("#vegetarian").is(":checked");
    const vegan = $("#vegan").is(":checked");
    const dairyFree = $("#dairy-free").is(":checked");
    const glutenFree = $("#gluten-free").is(":checked");
    let healthReqsArray = [];
    if (vegetarian) {
      healthReqsArray.push("vegetarian");
    }
    if (vegan) {
      healthReqsArray.push("vegan");
    }
    if (dairyFree) {
      healthReqsArray.push("dairy-free");
    }
    if (glutenFree) {
      healthReqsArray.push("gluten-free");
    }
    console.log(healthReqsArray);
    return healthReqsArray;
  }

  // last function that runs the fetch and api search based on healthreqs and search query
  async function searchDatabase(
    searchQuery /*string*/,
    healthRequirements /* string[] */
  ) {
    let apiURL = "https://api.edamam.com/api/recipes/v2?";
    let searchParameters = {
      per_page: 1,
      type: "public",
      app_id: "47a9652c",
      app_key: "ff96e3cd2cbbce2cf5d87436ee7f0c2d",
      mealType: "Dinner",
      q: searchQuery,
    };
    let urlSearchParams = new URLSearchParams(searchParameters);
    if (healthRequirements.length !== 0) {
      for (let i = 0; i < healthRequirements.length; i++) {
        urlSearchParams.append("health", healthRequirements[i]);
      }
    }
    let requestURL = apiURL + urlSearchParams;
    let response = await fetch(requestURL);
    let jsonData = await response.json();
    console.log(requestURL);
    return jsonData;
  }

  // create click function that creates <li> elements based on user ingredients
  let ingredientList = $("#ingredient-list");
  $("#add").on("click", renderIngredients);
  function renderIngredients(event) {
    event.preventDefault();
    let userIngredient = $("#user-ingredient")[0].value;
    let userIngredientEl = $("#user-ingredient")[0];
    if (userIngredient === "") {
      alert("Please enter an ingredient");
      return;
    }
    //create
    let ingredientItem = $("<li>");
    let removeButton = $("<button>");
    let itemLabel = $("<label>");
    //attr
    ingredientItem.addClass("ingredient-item");
    removeButton.addClass("remove");
    itemLabel.text(userIngredient);
    removeButton.text("X");
    removeButton.click(() => {
      ingredientItem.remove();
    });
    //append
    ingredientList.append(ingredientItem);
    ingredientItem.append(itemLabel);
    ingredientItem.append(removeButton);
    // clearing textfield
    userIngredientEl.value = "";
  }

  // create click function for search button that calls api and creates elements with the data
  let recipeContainer = $("#recipe-container");
  let savedRecipeDiv = $("#saved-recipe");
  $("#search").on("click", renderRecipes);
  async function renderRecipes() {
    recipeData = await loadRecipes();
    // on multiple searches, the html will be cleared for new search
    recipeContainer.children(".recipe").remove();
    for (let i = 0; i < 9; i++) {
      createRecipeEl(recipeContainer, i, true);
    }
  }
  // create click function for save button that recreates the saved recipe under the saved recipe div
  $("#recipe-container").on("click", ".save-btn", function () {
    const value = $(this).attr("value");
    saveRecipe(value);
  });

  function saveRecipe(saveRecipeItemPosition) {
    if (
      recipeData &&
      recipeData.hits &&
      recipeData.hits[saveRecipeItemPosition] &&
      recipeData.hits[saveRecipeItemPosition].recipe
    ) {
      const length = savedRecipeDiv.children(".recipe").length;
      if (length <= 2) {
        const savedRecipesJSON = localStorage.getItem("savedRecipes");
        const savedRecipes = savedRecipesJSON
          ? JSON.parse(savedRecipesJSON)
          : [];
        savedRecipes.push(recipeData.hits[saveRecipeItemPosition].recipe);
        localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
        createRecipeEl(savedRecipeDiv, saveRecipeItemPosition, false);
      }
    } else {
      console.error("Recipe data is missing or invalid.");
    }
  }
  // function for creating html elements based on api data
  function createRecipeEl(parentDiv, i, createButton) {
    if (recipeData && recipeData.hits && recipeData.hits.length > i) {
      let recipeAPIData = recipeData.hits[i].recipe;
      //create
      let recipeDivEl = $("<div>");
      let recipeImgEl = $("<img>");
      let recipeURL = $("<a>");
      let recipeNameEl = $("<h2>");
      let recipeInfoEl = $("<ul>");
      let cookTimeEl = $("<li>");
      let servingSizeEl = $("<li>");
      let caloriesEl = $("<li>");

      recipeDivEl.addClass("recipe");
      recipeURL.addClass("url");
      recipeImgEl.addClass("recipe-img");
      recipeNameEl.addClass("recipe-name");
      recipeInfoEl.addClass("recipe-info");

      if (
        recipeAPIData.images &&
        recipeAPIData.images.SMALL &&
        recipeAPIData.url
      ) {
        recipeImgEl.attr("src", recipeAPIData.images.SMALL.url);
        recipeURL.attr("href", recipeAPIData.url);
        recipeURL.text(recipeAPIData.label);
      }

      let cookTimeNumber = recipeAPIData.totalTime;
      if (cookTimeNumber === 0) {
        cookTimeEl.text("Cook Time: N/A");
      } else {
        cookTimeEl.text("Cook Time: " + cookTimeNumber + " min");
      }

      if (recipeAPIData.yield) {
        servingSizeEl.text("Serving Size: " + recipeAPIData.yield);
      } else {
        servingSizeEl.text("Serving Size: N/A");
      }

      if (recipeAPIData.calories) {
        caloriesEl.text("Calories: " + Math.round(recipeAPIData.calories));
      } else {
        caloriesEl.text("Calories: N/A");
      }

      //append
      recipeDivEl.append(recipeNameEl);
      recipeDivEl.append(recipeImgEl);
      recipeNameEl.append(recipeURL);
      recipeDivEl.append(recipeInfoEl);
      recipeInfoEl.append(cookTimeEl);
      recipeInfoEl.append(servingSizeEl);
      recipeInfoEl.append(caloriesEl);
      parentDiv.append(recipeDivEl);
      if (createButton) {
        let saveRecipeBtn = $("<button>");
        saveRecipeBtn.addClass("save-btn");
        saveRecipeBtn.attr({ value: i });
        saveRecipeBtn.text("Save");
        recipeDivEl.append(saveRecipeBtn);
      } else {
        let removeRecipeBtn = $("<button>");
        removeRecipeBtn.addClass("remove");
        removeRecipeBtn.attr({ value: recipeData.id });
        removeRecipeBtn.text("Delete");
        recipeDivEl.append(removeRecipeBtn);
        removeRecipeBtn.click(() => {
          removeRecipe(recipeData.id);
          recipeDivEl.remove();
        });
      }
    } else {
      console.error("Recipe data is missing or invalid.");
      console.log("recipeData:", recipeData);
      console.log("recipeData.hits:", recipeData && recipeData.hits);
    }
  }

  function removeRecipe(recipeId) {
    const savedRecipes = getSavedRecipes();
    const updatedRecipes = savedRecipes.filter((recipe) => recipe.id !== recipeId);
    localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
  }

  // Function to get saved recipes from local storage
  // const savedRecipesJSON = [];

  // function getSavedRecipes() {
  //   savedRecipesJSON.concat(JSON.parse(localStorage.getItem("savedRecipes")));
  //   console.log(savedRecipesJSON);
  //   return savedRecipesJSON;
  // }
  
  const savedRecipesJSON = [];
  //Function to display saved recipes
  function displaySavedRecipes() {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
    // const savedRecipes = getSavedRecipes();
    console.log(savedRecipes);
    const savedRecipeEl = $("#saved-recipe");
    const savedRecipeDiv = $("<div>")

    // savedRecipeDiv.empty();
    if (savedRecipes.length > 0){
    const recipeDivEl = $("<div>");
    const recipeImgEl = $("<img>");
    const recipeURL = $("<a>");
    const recipeNameEl = $("<h2>");
    const recipeInfoEl = $("<ul>");
    const cookTimeEl = $("<li>");
    const servingSizeEl = $("<li>");
    const caloriesEl = $("<li>");

    recipeDivEl.addClass("recipe");
    recipeURL.addClass("url");
    recipeImgEl.addClass("recipe-img");
    recipeNameEl.addClass("recipe-name");
    recipeInfoEl.addClass("recipe-info");

    if (
      recipe.images &&
      recipe.images.SMALL &&
      recipe.url
    ) {
      recipeImgEl.attr("src", recipe.images.SMALL.url);
      recipeURL.attr("href", recipe.url);
      recipeURL.text(recipe.label);
    }

    const cookTimeNumber = recipe.totalTime;
    if (cookTimeNumber === 0) {
      cookTimeEl.text("Cook Time: N/A");
    } else {
      cookTimeEl.text("Cook Time: " + cookTimeNumber + " min");
    }

    if (recipe.yield) {
      servingSizeEl.text("Serving Size: " + recipe.yield);
    } else {
      servingSizeEl.text("Serving Size: N/A");
    }

    if (recipe.calories) {
      caloriesEl.text("Calories: " + Math.round(recipe.calories));
    } else {
      caloriesEl.text("Calories: N/A");
    }

    savedRecipeDiv.append(recipeNameEl);
    savedRecipeDiv.append(recipeImgEl);
    recipeNameEl.append(recipeURL);
    savedRecipeDiv.append(recipeInfoEl);
    recipeInfoEl.append(cookTimeEl);
    recipeInfoEl.append(servingSizeEl);
    recipeInfoEl.append(caloriesEl);
    savedRecipeEl.append(savedRecipeDiv);
    if (createButton) {
      const saveRecipeBtn = $("<button>");
      saveRecipeBtn.addClass("save-btn");
      saveRecipeBtn.attr({ value: i });
      saveRecipeBtn.text("Save");
      savedRecipeDiv.append(saveRecipeBtn);
    } else {
      const removeRecipeBtn = $("<button>");
      removeRecipeBtn.addClass("remove");
      removeRecipeBtn.attr({ value: recipeData.id });
      removeRecipeBtn.text("Delete");
      savedRecipeDiv.append(removeRecipeBtn);
      removeRecipeBtn.click(() => {
        removeRecipe(recipeData.id);
        savedRecipeDiv.remove();
      });
    }
    }
  }
  savedRecipesJSON.forEach(recipe => displaySavedRecipes(recipe))

  // savedRecipes.forEach(recipe => displaySavedRecipes(recipe))

  $(document).ready(function () {
    recipeData = JSON.parse(localStorage.getItem("recipeData")) || [];

    displaySavedRecipes();
  });
});
