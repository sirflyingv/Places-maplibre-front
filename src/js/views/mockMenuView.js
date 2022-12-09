class MockMenuView {
  _parentElement = document.querySelector('.menu');
  _discoverParentElement = document.querySelector('.menu-discover');

  addHandlerButtonFind(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--find');
      if (!btn) return;
      handler();
    });
  }

  addHandlerButtonRemove(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--remove');
      if (!btn) return;
      handler();
    });
  }

  getSearchInput() {
    const query = this._parentElement.querySelector('.input__global-query').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.input__global-query').value = '';
  }
}

export default new MockMenuView();
