// Every render of each part of the app that needs the same methods

//import icons from '../img/icons.svg'  //Parcel 1
import icons from 'url:../../img/icons.svg';  //Parcel 2

export default class View {

  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object |  Object[]} data The data to be rendered (e.g. recipe)
   * @param { boolean} [render=true] If false, create markup string instead of rendering to the DOM 
   * @returns {undefined | string} A markup is returned if render=false
   * @this {Object} View instance
   * @author Noud van Dun
   * @todo Finish implementation
   */
  
  render(data, render = true) {
    if (!data || (Array.isArray(data)) && data.length === 0) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (render === false) {
      return markup;
    }

    this._clear()                                                             // clear the DOM before new or updated insertion
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

  }


  update(data) {

    this._data = data;
    const newMarkup = this._generateMarkup();                                  // newMarkup is a string
    const newDOM = document.createRange().createContextualFragment(newMarkup);  // convert to real DOM nodes objects
    const newElements = Array.from(newDOM.querySelectorAll('*'));               // '*' select all nodes from forexample recipeView

    const curElements = [...this._parentElement.querySelectorAll('*')];         // [...spread] same as Array.from()
    //console.log(curElements)
    //console.log(newElements)

    newElements.forEach((newEl, index) => {
      const curEl = curElements[index];

      // Update changed text
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {   // ?. = Optional chaining checks if there is a firstChild without throwing an error  
        curEl.textContent = newEl.textContent;                                        // firstChild = #text = node
      }

      // Update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        })
      }

    })
  }


  _clear() {                                                                   // Private
    this._parentElement.innerHTML = ""
  }


  renderSpinner() {                                                            //public
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this._errorMessage) {                                  // automatically recieve error message
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
         `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
         `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

}

