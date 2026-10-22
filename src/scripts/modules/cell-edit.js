export function initCellEdit(bodyEl) {
  bodyEl.addEventListener('dblclick', (evt) => {
    if (evt.target.closest('.cell-input')) {
      return;
    }

    const td = evt.target.closest('td');

    if (!td) {
      return;
    }

    const initialValue = td.textContent;

    const input = document.createElement('input');

    input.classList.add('cell-input');
    td.replaceChildren(input);

    input.focus();

    input.addEventListener('blur', () => {
      saveInput(input, initialValue, td);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveInput(input, initialValue, td);
      }
    });
  });
}

function saveInput(input, initialValue, td) {
  if (!input.parentElement) {
    return;
  }

  const optimizedValue = input.value.trim();

  if (!optimizedValue) {
    return td.replaceChildren(initialValue);
  }

  td.replaceChildren(optimizedValue);
}
