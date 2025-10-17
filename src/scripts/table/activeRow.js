export function makeRowActiveFactory(state) {
  return function makeRowActive(tr) {
    if (state.lastActiveRow) {
      state.lastActiveRow.classList.remove('active');
    }
    tr.classList.add('active');
    state.lastActiveRow = tr;
  };
}
