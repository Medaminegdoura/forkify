import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const nextPage = ` <button data-goto ="${
      currPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${currPage + 1}</span>
    <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
    </svg>
</button>`;
    const previousPage = `<button data-goto ="${
      currPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
    <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currPage - 1}</span>
</button>`;
    console.log(numPages);

    // Page 1 , there are other pages
    if (currPage === 1 && numPages > 1) return nextPage;

    // Last page
    if (currPage === numPages && numPages > 1) return previousPage;

    // other page
    if (currPage > 1 && numPages > currPage) return previousPage + nextPage;

    // Page 1 , there are no other pages
    return '';
  }
}

export default new PaginationView();
