'use strict';

const tableBody = document.querySelector('tbody');
const tableHead = document.querySelector('thead');
const FORM_FIELDS = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const CITIES = [
  'Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco',
];
let clickSortIndex;

tableHead.addEventListener('click', e => {
  const rows = tableBody.querySelectorAll('tr');
  const rowsArray = [...rows];
  const index = e.target.cellIndex;

  const delete$ = function(string) {
    return +string.slice(1).split(',').join('');
  };

  const sortingAsc = (array) => {
    array.sort((a, b) => {
      const a1 = a.children[index].innerText;
      const b1 = b.children[index].innerText;

      if (e.target.innerText === 'Salary') {
        return delete$(a1) - delete$(b1);
      } else {
        return a1.localeCompare(b1);
      }
    }
    );
  };

  if (clickSortIndex !== index) {
    sortingAsc(rowsArray);
    clickSortIndex = index;
  } else {
    rowsArray.reverse();
    clickSortIndex = null;
  }

  for (const row of rowsArray) {
    tableBody.append(row);
  }
}
);

tableBody.addEventListener('click', e => {
  const rows = tableBody.querySelectorAll('tr');
  const currentRowIndex = e.target.parentElement.sectionRowIndex;

  if (!rows[currentRowIndex].classList.contains('active')) {
    for (const row of rows) {
      row.classList.remove('active');
    }
    rows[currentRowIndex].classList.add('active');
  }
});

const epmloyeeForm = document.createElement('form');

epmloyeeForm.className = 'new-employee-form';

document.body.append(epmloyeeForm);

const fillingForm = (form, labelsArray, selectOptions) => {
  for (const label of labelsArray) {
    const createLabel = document.createElement('label');
    const createInput = document.createElement('input');
    const createSelect = document.createElement('select');

    createLabel.innerText = label + ':';

    switch (label) {
      case 'Age': case 'Salary': createInput.type = 'number';
        break;

      default: createInput.type = 'text';
    }

    createInput.dataset.qa = `${label.toLowerCase()}`;
    createInput.name = `${label.toLowerCase()}`;
    createSelect.dataset.qa = `${label.toLowerCase()}`;
    createSelect.name = `${label.toLowerCase()}`;

    if (label !== 'Office') {
      createLabel.append(createInput);
      form.append(createLabel);
    } else {
      for (const option of selectOptions) {
        const createOption = document.createElement('option');

        createOption.name = `${option}`;
        createOption.innerText = option;
        createSelect.append(createOption);
      }
      createLabel.append(createSelect);
      form.append(createLabel);
    }
  }

  const formButton = document.createElement('button');

  formButton.innerText = 'Save to table';
  epmloyeeForm.append(formButton);
};

fillingForm(epmloyeeForm, FORM_FIELDS, CITIES);

const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const checkFormValidation = (form) => {
    const data = new FormData(form);

    if (data.get('name').length >= 4
    && data.get('position').length > 0
    && data.get('age') >= 18
    && data.get('age') < 90
    ) {
      return true;
    }

    return false;
  };

  const createEmployeeForm = () => {
    const addRow = document.createElement('tr');
    const labels = document.querySelectorAll('label');

    for (const label of labels) {
      const cell = document.createElement('td');
      const cellValue = label.children[0].value;

      cell.innerText = cellValue;

      if (label.children[0].dataset.qa === 'salary') {
        cell.innerText = '$' + `${Number(cellValue).toLocaleString()}`;
      };

      addRow.append(cell);
      tableBody.append(addRow);
    }
  };

  if (!checkFormValidation(document.querySelector('form'))) {
    pushNotification('error', 'Enter correct values');
  } else {
    createEmployeeForm();
    pushNotification('success', 'Employee added to the table');
  };
});

const pushNotification = (type, text) => {
  const div = document.createElement('div');

  div.classList.add('notification', `${type}`);
  div.dataset.qa = 'notification';

  div.innerHTML = `
  <h2>${type.toUpperCase()}</h2>
  <p>${text}</p>`;

  document.body.append(div);

  setTimeout(() => div.remove(), 3000);
};

tableBody.addEventListener('dblclick', (e) => {
  e.preventDefault();

  const editedCell = e.target.closest('td');
  const text = editedCell.innerText;
  const cellInput = document.createElement('input');

  cellInput.className = 'cell-input';
  editedCell.innerText = '';
  cellInput.value = text;

  editedCell.append(cellInput);

  cellInput.focus();

  cellInput.addEventListener('keydown', (key) => {
    if (key.code === 'Enter') {
      editedCell.innerHTML = !cellInput.value ? text : cellInput.value;
    }
  });

  cellInput.addEventListener('blur', () => {
    editedCell.innerHTML = !cellInput.value ? text : cellInput.value;
  });
});
