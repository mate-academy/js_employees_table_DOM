export function initRowSelect(bodyEl) {
  let selectedRow = null;

  bodyEl.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    selectedRow?.classList.remove('active');

    if (selectedRow === tr) {
      selectedRow = null;

      return;
    }

    tr.classList.add('active');
    selectedRow = tr;
  });
}
