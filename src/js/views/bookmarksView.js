import View from './View.js';
//import icons from '../img/icons.svg'  //Parcel 1
import icons from 'url:../../img/icons.svg';  //Parcel 2
import previewView from './previewView.js';

class BookmarksView extends View {

    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
}

export default new BookmarksView()



//   _generateMarkup() {
    //     return this._data.map(result => {

    //       const id = window.location.hash.slice(1)

    //       return `
    //       <li class="preview">
    //             <a class="preview__link ${result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">
    //               <figure class="preview__fig">
    //                 <img src="${result.image}" alt="${result.title}" />
    //               </figure>
    //               <div class="preview__data">
    //                 <h4 class="preview__title">${result.title}</h4>
    //                 <p class="preview__publisher">${result.publisher}</p>
    //               </div>
    //             </a>
    //           </li>
    //       `;
    //     }).join('')
    //   }