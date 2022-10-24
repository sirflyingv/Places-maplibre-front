class MockMenuView {
  _parentElement = document.getElementById('menu');
  //   btn = this._element.querySelector('.btn-load');

  // test
  // addHoverHandler() {
  //   this._parentElement.addEventListener('mouseover', function (e) {
  //     const btn = e.target.closest('.btn--load');
  //     if (!btn) return;
  //     console.log('Load hovering');
  //   });
  // }

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
