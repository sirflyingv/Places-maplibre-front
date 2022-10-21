class MockMenuView {
  _parentElement = document.getElementById('menu');
  //   btn = this._element.querySelector('.btn-load');

  addHandlerButton(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--load');
      if (!btn) return;
      handler();
    });
  }
}

export default new MockMenuView();
