'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');

table.addEventListener('click', (e) => {
  const rows = [...tableBody.querySelectorAll('tr')];
  const header = e.target.closest('th');
  const clickedRow = e.target.closest('tbody tr');

  if (clickedRow) {
    rows.forEach((n) => {
      n.classList.remove('active');
    });
    clickedRow.classList.add('active');
  }

  if (!header) {
    return;
  }

  if (header) {
    const colIndex = header.cellIndex;
    let sortedrows = [...rows].sort((a, b) => {
      const aNum = a.cells[colIndex].textContent.replace(/\D/g, '');
      const bNum = b.cells[colIndex].textContent.replace(/\D/g, '');
      const aText = a.cells[colIndex].textContent;
      const bText = b.cells[colIndex].textContent;

      if (aNum !== '' && bNum !== '') {
        return aNum - bNum;
      }

      return aText.localeCompare(bText);
    });

    const isSame = rows.every((n, i) => {
      return n === sortedrows[i];
    });

    if (isSame) {
      sortedrows = [...rows].sort((a, b) => {
        const aNum = a.cells[colIndex].textContent.replace(/\D/g, '');
        const bNum = b.cells[colIndex].textContent.replace(/\D/g, '');
        const aText = a.cells[colIndex].textContent;
        const bText = b.cells[colIndex].textContent;

        if (aNum !== '' && bNum !== '') {
          return bNum - aNum;
        }

        return bText.localeCompare(aText);
      });
    }

    sortedrows.forEach((n) => {
      tableBody.append(n);
    });
  }
});

const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');
document.body.appendChild(newForm);

function modifyForm(type, named) {
  const newLabel = document.createElement('label');
  const newInput = document.createElement('input');

  newLabel.innerHTML = `${named}:`;

  if (type === 'select') {
    const newSelect = document.createElement('select');
    const options = [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ];
    const defaultOption = document.createElement('option');

    defaultOption.value = '';
    defaultOption.innerText = 'Please choose your option';
    defaultOption.selected = true;
    defaultOption.disabled = true;

    newSelect.append(defaultOption);

    options.forEach((n) => {
      const newOption = document.createElement('option');

      newOption.value = n;
      newOption.innerText = n;
      newSelect.append(newOption);
    });

    newSelect.dataset.qa = 'office';
    newSelect.name = named;
    // newSelect.required = true;
    newLabel.append(newSelect);
    newForm.append(newLabel);

    return;
  }

  newInput.dataset.qa = named;
  newInput.type = type;
  newInput.name = named;
  // newInput.required = true;

  newLabel.append(newInput);
  newForm.append(newLabel);
}

modifyForm('text', 'name');
modifyForm('text', 'position');
modifyForm('select', 'office');
modifyForm('number', 'age');
modifyForm('number', 'salary');

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.innerText = 'Save to table';

newForm.append(submitButton);

newForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(newForm);
  const errorMessage = validateEmp(data);

  if (errorMessage) {
    pushNotification('Error', errorMessage, 'error');

    return;
  }

  const row = tableBody.insertRow();
  const salaryValue = Number(data.get('salary')).toLocaleString('en-US');

  row.insertCell().textContent = data.get('name');
  row.insertCell().textContent = data.get('position');
  row.insertCell().textContent = data.get('office');
  row.insertCell().textContent = data.get('age');
  row.insertCell().textContent = `$${salaryValue}`;

  pushNotification('Success', 'Successfully added', 'success');
  newForm.reset();
});

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  const rect = newForm.getBoundingClientRect();

  const titleElement = document.createElement('h2');

  titleElement.classList.add('title');
  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;

  notification.append(titleElement, descriptionElement);
  document.body.append(notification);

  notification.style.top = `${rect.bottom + notification.offsetHeight / 2}px`;
  notification.style.left = `${rect.left}px`;

  setTimeout(() => notification.remove(), 2000);
};

let activeInput = null;

function validateEmp(data) {
  const named = data.get('name');
  const age = data.get('age');
  const values = [...data.values()];

  if (values.some((value) => value.trim() === '')) {
    return 'All inputs must be filled';
  }

  if (named.length < 4) {
    return 'Name must be at least 4 characters long.';
  }

  if (age < 18 || age > 90) {
    return 'Age must be between 18 and 90.';
  }

  return null;
}

table.addEventListener('dblclick', (e) => {
  const cellForEdit = e.target.closest('td');

  if (!cellForEdit) {
    return;
  }

  if (activeInput) {
    activeInput.blur();
  }

  const initialText = cellForEdit.textContent;
  const input = document.createElement('input');

  input.className = 'cellInput';
  input.value = initialText;

  cellForEdit.textContent = '';
  cellForEdit.append(input);
  input.focus();

  activeInput = input;

  function saveCell() {
    const newValue = input.value.trim();

    cellForEdit.textContent = newValue === '' ? initialText : newValue;
    activeInput = null;
  }

  input.addEventListener('blur', saveCell);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }
  });
});
