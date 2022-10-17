import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    //0) update results view for selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Loading Recipe
    id = window.location.hash.slice(1);
    if (!id) return;
    console.log(id);
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    //3) update Bookmarks
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    //1) Get search query
    const query = searchView.getQuery();
    console.log(query);
    if (!query) return;

    //2)Loading search results
    await model.loadSearchResults(query);

    //3)Render results
    console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    alert(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (toAdd) {
  ///  updating the recipe servings (in state)
  model.updateServings(toAdd);
  // updating view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add orRemove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2) Update  recipeView
  recipeView.update(model.state.recipe);
  //3) Render bookmarks preview
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Spinner
    addRecipeView.renderSpinner();
    //Upload new data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();

    //Render Bookmark
    bookmarksView.render(model.state.bookmarks);
    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
      setTimeout(function () {
        addRecipeView.initialiseNewRecipe();
      }, 1000);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
    setTimeout(function () {
      addRecipeView.initialiseNewRecipe();
    }, MODAL_CLOSE_SEC * 1000);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
