export function updateRow(event) {
  const cell = event.target;
  const initialValue = cell.textContent;

  switch (cell.cellIndex) {
    case 0:
    case 1:
    case 2:
      cell.innerHTML = `
      <input
        name="cell-input"
        type="text"
        value="${cell.textContent}"
      >
      </input>
      `;
      break;

    case 3:
      cell.innerHTML = `
      <input
        name="cell-input"
        type="number"
        value="${+cell.textContent}"
      >
      </input>
      `;
      break;

    case 4:
      const salaryNumber = cell.textContent.slice(1).replace(',', '');

      cell.innerHTML = `
      $<input
        name="cell-input"
        type="number"
        value="${+salaryNumber}"
      >
      </input>
      `;
      break;
  }

  const cellInput = cell.querySelector('input');

  if (cellInput) {
    cellInput.className = 'cell-input';
    cellInput.focus();

    cellInput.addEventListener('blur', () => {
      if (!cellInput.value.length) {
        cell.innerHTML = `${initialValue}`;

        return;
      }

      if (cell.cellIndex === 4) {
        cell.innerHTML = `$${(+cellInput.value).toLocaleString('en-US')}`;
      } else {
        cell.innerHTML = `${cellInput.value}`;
      }
    });

    cellInput.addEventListener('keydown', e => {
      if (e.code === 'Enter') {
        cellInput.blur();
      }
    });
  }
}
