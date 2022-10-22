class MockMenuView {
  _parentElement = document.getElementById('menu');
  //   btn = this._element.querySelector('.btn-load');

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

  getQuery() {
    const query = this._parentElement.querySelector('.input__query').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.input__query').value = '';
  }
}

export default new MockMenuView();
