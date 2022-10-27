class MockMenuView {
  _parentElement = document.querySelector('.menu');

  addHandlerButtonLoad(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--load');
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
    const query = this._parentElement.querySelector(
      '.input__global-query'
    ).value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.input__global-query').value = '';
  }
}

export default new MockMenuView();
