import View from './View.js'
//import icons from '../img/icons.svg'  //Parcel 1
import icons from 'url:../../img/icons.svg'  //Parcel 2

class PaginationView extends View {

  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline')

      if (!btn) return

      const goToPage = +btn.dataset.goto   //page number

      handler(goToPage)
    })
  }

  _generateMarkup() {
    // what buttons when to show
    const currentPage = this._data.page

    //We need to know the number of pages
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage)
    //console.log(numPages)

    // Page 1, there are other pages
    if (currentPage === 1 && numPages > 1) {           // only one button ( page2 -> )
      return `
            <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          <button class="pagesToGo pagination__btn--togo"><span>Page: ${currentPage} / ${numPages}</span></button>
            `
    }

    // Last page  
    if (currentPage === numPages && numPages > 1) {   //only one button  ( <- page5 )
      return `
            <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
            <button class="pagesToGo pagination__btn--togo"><span>Page: ${currentPage} / ${numPages}</span></button>
            `
    }

    // Other page, there are other pages back and forth
    if (currentPage < numPages) {                                // two buttons   ( <- page 2 ) ( page -> 4 )
      return `
            <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
           <button class="pagesToGo pagination__btn--togo"><span>Page: ${currentPage} / ${numPages}</span></button>
            `
    }

    // Page 1, and there are no other pages
    // We don't need to render any button
    return ''

  }
}

export default new PaginationView();


//Or:
// generateBtn(currentPage){
//   return [`
//             <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
//             <svg class="search__icon">
//               <use href="${icons}#icon-arrow-left"></use>
//             </svg>
//             <span>Page ${currentPage - 1}</span>
//           </button>
//             `,
//             `
//             <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
//             <span>Page ${currentPage + 1}</span>
//             <svg class="search__icon">
//               <use href="${icons}#icon-arrow-right"></use>
//             </svg>
//           </button>
//             `
//           ]
// }
// _generateMarkup() {
//   // what buttons when to show
//   const currentPage = this._data.page

//   //We need to know the number of pages
//   const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage)
//   console.log(numPages)

//   // Page 1, there are other pages
//   if (currentPage === 1 && numPages > 1) {           // only one botton ( page2 -> )
//     return this._generateBtn(currentPage)[1]
//   }

//   // Last page  
//   if (currentPage === numPages && numPages > 1) {   //only one button  ( <- page5 )
//     return this._generateBtn(currentPage)[0]
//   }

//   // Other page, there are other pages back and forth
//   if (currentPage < numPages) {                                // two buttons   ( <- page2 ) ( page -> 4 )
//     return this._generateBtn(currentPage).slice(0, 2)
//     or: return [this._generateBtn(currentPage)[0], this._generateBtn(currentPage)[1]]
//   }

//   // Page 1, and there are no other pages
//   // We don't need to render any button
//   return ''

// }