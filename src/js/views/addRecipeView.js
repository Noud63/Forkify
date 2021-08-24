import View from './View.js'
//import icons from '../img/icons.svg'  //Parcel 1
import icons from 'url:../../img/icons.svg'  //Parcel 2

class AddRecipeView extends View {

    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was succesfully uploaded!'
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {                      // this method is only used in this class
        super();                         // super gives you acces to the parent's properties and methods
        this._addHandlerShowWindow()
        this._addHandlerHideWindow()
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    //With regular function
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click',
            this.toggleWindow.bind(this)            // bind() so the this keyword points to the addRecipeView object
        )
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click',
            this.toggleWindow.bind(this)
        )

        this._overlay.addEventListener('click',
            this.toggleWindow.bind(this)
        )

    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault()                                           // this = the upload form (parentElement) of the AddRecipeView instance
            const dataArr = [...new FormData(this)]                      //returns array of arrays  with key , and value of the form fields
            const data = Object.fromEntries(dataArr)                     // converts array of arrays to an object with key value pairs
            handler(data);                                               // data = newRecipe = argument passed in the controlAddRecipe function
        })
    }

   _generateMarkup() {
       
    }
}

export default new AddRecipeView();


//THIS KEY WORD BINDING!!
// Alternative with arrow function
// _addHandlerShowWindow() {
    //     this._btnOpen.addEventListener('click',() => {   // Arrow function to bind the this keyword to the object addRecipeView,
    //         this._overlay.classList.toggle('hidden');    // not to the btnOpen!!
    //         this._window.classList.toggle('hidden');
    //     })
    // }

