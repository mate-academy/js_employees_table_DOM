'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

thead.addEventListener('click', (clickEvent) => {
  if (clickEvent.target.tagName !== 'TH') {
    return;
  }

  const th = clickEvent.target;
  const columnIndex = th.cellIndex;

  const row = [...tbody.querySelectorAll('tr')];

  const isAscending = th.dataset.order !== 'asc';

  th.dataset.order = isAscending ? 'asc' : 'desc';

  row.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    const compareResult = cellA.localeCompare(cellB, undefined, {
      numeric: true,
    });

    return isAscending ? compareResult : -compareResult;
  });

  tbody.append(...row);
});

tbody.addEventListener('click', (clickEvent) => {
  const clickedRow = clickEvent.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

const formHTMLString = `
  <form class="new-employee-form" novalidate>
  <label>
    Name:
    <input
      name="name"
      type="text"
      data-qa="name"
      required
    />
  </label>
  <label>
    Position:
    <input
      name="position"
      type="text"
      data-qa="position"
      required
    />
  </label>
  <label>
    Office:
    <select
      name="office"
      id="office-select"
      data-qa="office"
      required
    >
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>
    Age:
    <input
      name="age"
      type="number"
      data-qa="age"
      required
    />
  </label>
  <label>
    Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
      required
    />
  </label>
  <button type="submit">Save to table</button>
</form>
`;

document.body.insertAdjacentHTML('beforeend', formHTMLString);

const form = document.querySelector('form');

form.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();

  const formData = new FormData(form);

  const nameValue = formData.get('name');
  const positionValue = formData.get('position');
  const officeValue = formData.get('office');
  const ageValue = Number(formData.get('age'));
  const salaryValue =
    '$' + Number(formData.get('salary')).toLocaleString('en-US');

  if (positionValue.trim() === '') {
    showNotification('Position invalid', 'error');

    return;
  }

  if (nameValue.length < 4) {
    showNotification('Name is too short', 'error');

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    showNotification('Age is younger or older than expected', 'error');

    return;
  }

  const newRow = `
    <tr>
      <td>${nameValue}</td>
      <td>${positionValue}</td>
      <td>${officeValue}</td>
      <td>${ageValue}</td>
      <td>${salaryValue}</td>
    </tr>
  `;

  tbody.insertAdjacentHTML('beforeend', newRow);
  showNotification('Employee added', 'success');
  form.reset();
});

function showNotification(message, type) {
  const div = document.createElement('div');

  div.classList.add('notification', type);
  div.setAttribute('data-qa', 'notification');

  const titleText = type === 'error' ? 'Error!' : 'Success!';

  div.innerHTML = `
    <span class="title">${titleText}</span>
    ${message}
  `;

  document.body.append(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

tbody.addEventListener('dblclick', (dblclickEvent) => {
  if (dblclickEvent.target.tagName !== 'TD') {
    return;
  }

  const hasInput = document.querySelector('table .cell-input');

  if (hasInput) {
    return;
  }

  const cell = dblclickEvent.target;
  const currentText = cell.textContent.trim();

  cell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = currentText;

  cell.append(input);
  input.focus();

  const saveChanges = () => {
    const newValue = input.value.trim();
    const finalText = newValue === '' ? currentText : newValue;

    cell.textContent = finalText;
  };

  input.addEventListener('blur', () => {
    saveChanges();
  });

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      saveChanges();
    }
  });
});
