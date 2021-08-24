import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js'


export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1
    },
    bookmarks: []
}

const createRecipeObject = function (data) {
    let { recipe } = data.data
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })   // Short circuit &&, if there is a key than add the key to the object
    }
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`)
        console.log(data)
        state.recipe = createRecipeObject(data)

        if (state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true
        } else {
            state.recipe.bookmarked = false
        }

    } catch (err) {
        console.error(`${err}`)
        throw err;
    }
};

export const loadSearchResults = async function (query) {
    
    try {

        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)   // adds the key, so loading the recipes includes our own recipes with our own key 
        const recipe = data.data.recipes                                   // Not jonas his api key!
        
        if (query === 'pizza') {
            recipe.splice(0, 1)
        }

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key })                           // for adding the user icon
            }
        })

        state.search.page = 1   // page is set back to one

    } catch (err) {
        console.error(`${err}`)
        throw err;
    }

}


export const getSearchResultsPage = function (page = state.search.page) {   //default page setting = 1

    // return a part of the results
    state.search.page = page

    const start = (page - 1) * state.search.resultsPerPage  // 0 * 10
    const end = page * state.search.resultsPerPage         // 1 * 10

    return state.search.results.slice(start, end)          //slice(0, 10)   = result 0 till 9
}


export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {

        //new quantity = oldQuantity * newServings / oldServings    so: 2 * 5 / 4 = 2.5
        ing.quantity = ing.quantity * newServings / state.recipe.servings
    })

    state.recipe.servings = newServings;
}


const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}


export const addBookmark = function (recipe) {
    //Add bookmark
    state.bookmarks.push(recipe)

    //Mark current recipe as bookmark
    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true
    }
    persistBookmarks()
}


export const deleteBookmark = function (id) {

    // const index = state.bookmarks.findIndex( bookmark => bookmark.id === id)
    // state.bookmarks.splice(index, 1)

    state.bookmarks = state.bookmarks.filter(item => {
        return item.id !== id
    })

    if (state.recipe.id === id) {
        state.recipe.bookmarked = false
    }
    persistBookmarks()
}


const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage)
}

init()


const clearBookmarks = function () {
    localStorage.clear('bookmarks')
}
//clearBookmarks()

//Validate new-recipe inputs


// export const validateInput = function () {
//     const ele = document.querySelector('.upload').elements
//     const elements = Array.from(ele)
//     const value = elements[1].value
//     console.log(value)
//     if (isValidURL(value)){
//         console.log('Valid URL')
//     }else{
//         console.log('Not a valid URL')
//     }
// }


export const uploadRecipe = async function (newRecipe) {
         
    try {
        
        const ingredients = Object.entries(newRecipe).filter(entry => {
            
            return entry[0].startsWith('ingredient') && entry[1] !== "";                      //new array =>  [["ingredient-1", "0.5,kg,Rice"], ["ingredient-2", "1,,Avocado"],["ingredient-3", ",,salt"]]

        }).map(ing => {
            console.log(ing)                                                                  // ing =  ["ingredient-2", "1,tomato sauce,Avocado"], // ing[1] = "0.5,kg,Rice"
            const ingArr = ing[1].split(',').map(el => el.trim())                             // list of quantity, unit and description
            //console.log(ingArr)                                                              // ingArr = [ '1', 'tomatosauce', 'Avocado' ]
            //const ingArr = ing[1].replaceAll(' ', '').split(',');                            
            if (ingArr.length !== 3) throw new Error('Wrong ingredient format!')


            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description }               // returns an array (map) of objects key/value => [{…}, {…}, {…}]
        })
        
        // convert recipe to same format as api
        const recipe = {                                                                      // convert to same format as api
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,                                             // + converts string to number
            servings: +newRecipe.servings,
            ingredients: ingredients
        }
         console.log(recipe)
        // const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)                           // Adds your own specific key to the recipe object
        
        state.recipe = createRecipeObject(data)
        addBookmark(state.recipe)

    } catch (error) {
        throw error
    }

}