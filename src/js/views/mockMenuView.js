class MockMenuView {
  _parentElement = document.querySelector('.menu');
  _discoverParentElement = document.querySelector('.menu-discover');

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

  // addHandlerDiscoverButton(handler) {
  //   this._discoverParentElement.addEventListener('click', function (e) {
  //     const btn = e.target.closest('.btn--discover');
  //     if (!btn) return;
  //     handler(btn);
  //   });
  // }
}

export default new MockMenuView();
