import checkName from '../api/npm-mock';
import core from '../core';

function showLoadAction() {
  core.store.changeState(state =>
    Object.assign({}, state, {
      loading: true,
    }));
}

function hideLoadAction() {
  core.store.changeState(state =>
    Object.assign({}, state, {
      loading: false,
    }));
}

function clearPackageName() {
  core.store.changeState(state =>
    Object.assign({}, state, {
      packageName: '',
    }));
}

function searchAction(query) {
  showLoadAction();
  clearPackageName();
  checkName(query)
    .then((isAvailable) => {
      hideLoadAction();
      core.store.changeState(state =>
        Object.assign({}, state, {
          packageName: query,
          isAvailable,
        }));
    })
    .catch(() => {
      hideLoadAction();
    });
}

export default {
  searchAction,
  showLoadAction,
  hideLoadAction,
};
