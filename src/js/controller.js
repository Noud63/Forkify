// https://forkify-api.herokuapp.com/v2
import 'core-js/stable'; // polyfill
import 'regenerator-runtime/runtime'; //polyfill async await
import { async } from 'regenerator-runtime';
import * as model from './model.js' // import everything
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'
import { MODAL_CLOSE_SEC } from './config.js'

// if (module.hot) {                       //Parcel not js
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {

    let id = window.location.hash.slice(1)

    if (!id) return
    recipeView.renderSpinner()

    // 1.Update resultsView to highlight selected search result
    resultsView.update(model.getSearchResultsPage())

    // 2.updating bookmarksView
    bookmarksView.update(model.state.bookmarks)

    // 3.Loading recipe
    await model.loadRecipe(id)    // await it is async!

    // 4.Render recipe
    recipeView.render(model.state.recipe)

  } catch (error) {
    recipeView.renderError()
    console.error(error)
  }

}


const controlSearchResults = async function () {
  try {

    resultsView.renderSpinner()

    // Get searchQuery
    const query = searchView.getQuery()
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query)

    //Render all search results (no slice(start, end) yet!)
    resultsView.render(model.getSearchResultsPage())

    //Render initial pagination buttons, that's no button or one button
    paginationView.render(model.state.search)


  } catch (err) {
    console.log(err)
  }
}

//Click Handler pagination buttons
const controlPagination = function (goToPage) {
  //Render new results (Repeat the same methods as in controlsearchresults)
  resultsView.render(model.getSearchResultsPage(goToPage))    //render overwrites the parentElemnt due to the clear method

  //Render new pagination buttons
  paginationView.render(model.state.search)   // state changes to new page

}


//click Handler + - buttons
const controlServings = function (updateTo) {
  // Update recipe servings ( in state )
  model.updateServings(updateTo)
  // Update recipeView by rendering the whole recipe view again after updating servings
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}


const controlAddBookmark = function () {
  //1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  } else {
    model.deleteBookmark(model.state.recipe.id)
  }

  //2. Update recipeView
  recipeView.update(model.state.recipe)

  //3. Render bookmarks
  bookmarksView.render(model.state.bookmarks)

}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {    //uploadRecipe = async !
  try {

    //model.validateInput()
    // Show loading spinner
    addRecipeView.renderSpinner()
    // Upload recipe data
    await model.uploadRecipe(newRecipe)

    // Render recipe
    recipeView.render(model.state.recipe)

    // Succes message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // Change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)

  } catch (error) {
    console.error(error)
    addRecipeView.renderError(error.message)
  }

}

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks)    // Load bookmarks on page load
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdataServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)   // controlpagination = handler(goToPage) 
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init();

