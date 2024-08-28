'use strict';

// write code here
// 1.Implement table sorting by clicking on the title (in two directions).+
// #region

const table = document.querySelector('table');
const header = document.querySelector('thead');
const currentSort = { column: null, ascending: true };

// get array of persons from table

function getPeople() {
  const keys = Array.from(table.querySelectorAll('thead th')).map((th) => {
    return th.textContent.trim();
  });

  const values = Array.from(table.querySelectorAll('tbody tr'));

  const people = values.map((row) => {
    const cells = Array.from(row.querySelectorAll('td'));
    const person = {};

    keys.forEach((key, index) => {
      person[key] = cells[index].textContent.trim();
    });

    return person;
  });

  return people;
}

// method for sorting

function sortByClick(field, arrayForSort, isAscending) {
  const newArray = [...arrayForSort].sort((a, b) => {
    if (
      typeof a[field] === 'string' &&
      typeof b[field] === 'string' &&
      !a[field].includes('$')
    ) {
      return isAscending
        ? a[field].localeCompare(b[field])
        : b[field].localeCompare(a[field]);
    }

    const val1 = a[field].replace(/[$,]/g, '');
    const val2 = b[field].replace(/[$,]/g, '');

    return isAscending ? val1 - val2 : val2 - val1;
  });

  return newArray;
}

// method for adding data of objects to table

function addingContent(textContent, rowToAppend) {
  const td = document.createElement('td');

  td.textContent = textContent;
  rowToAppend.appendChild(td);
}

// creating event for clicking

header.addEventListener('click', (e) => {
  const fieldForSort = e.target.textContent.trim();

  if (currentSort.column === fieldForSort) {
    currentSort.ascending = !currentSort.ascending;
  } else {
    currentSort.column = fieldForSort;
    currentSort.ascending = true;
  }

  const newPeople = sortByClick(
    fieldForSort,
    getPeople(),
    currentSort.ascending,
  );

  const tbody = table.querySelector('tbody');

  tbody.innerHTML = '';

  newPeople.forEach((person) => {
    const tr = document.createElement('tr');

    for (const key of Object.keys(person)) {
      addingContent(person[key], tr);
    }

    tbody.appendChild(tr);
  });
});
// #endregion
// 2.When user clicks on a row, it should become selected.
// #region

table.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (tr) {
    const rows = table.querySelectorAll('tr');

    rows.forEach((row) => row.classList.remove('active'));
    tr.classList.add('active');
  }
});

// const rows = table.querySelectorAll('tr');

// rows.forEach((row) => {
//   row.addEventListener('click', (e) => {
//     rows.forEach((r) => r.classList.remove('active'));
//     row.classList.add('active');
//   });
// });
// #endregion
// 3.Write a script to add a form to the document.
// Form allows users to add new employees to the spreadsheet.
// #region

// додає працівника в таблицю

function addEmployeeToTable(employee) {
  // Find the table body
  const tbody = table.querySelector('tbody');

  // Create a new row
  const row = document.createElement('tr');

  // Create and append cells for each employee property
  const properties = ['name', 'position', 'office', 'age', 'salary'];

  properties.forEach((prop) => {
    const cell = document.createElement('td');

    cell.textContent = employee[prop];
    row.appendChild(cell);
  });

  // Append the new row to the table body
  tbody.appendChild(row);

  return true;
}

// перевіряє довжину імені та вік

function validateFormData(data) {
  if (
    !Object.values(data).every(
      (value) => value !== null && value !== undefined && value !== '',
    )
  ) {
    pushNotification(
      580,
      275,
      'Error Message',
      'Error: Some fields are empty',
      'error',
    );

    return false;
  }

  if (data.name.length < 4) {
    pushNotification(
      580,
      275,
      'Error Message',
      'Error: Name must be at least 4 characters long.',
      'error',
    );

    return false;
  }

  if (data.age < 18 || data.age > 90) {
    pushNotification(
      580,
      275,
      'Erroe message',
      'Error: Age must be between 18 and 90.',
      'error',
    );

    return false;
  }

  return true;
}

// створює форму

function createEmployeeForm() {
  // Create the form element
  const formOnCreate = document.createElement('form');

  formOnCreate.className = 'new-employee-form';
  formOnCreate.id = 'employeeForm';

  // Create the label and input elements
  const fields = [
    {
      fieldType: 'input',
      label: 'Name',
      type: 'text',
      name: 'name',
      qa: 'name',
    },
    {
      fieldType: 'input',
      label: 'Position',
      type: 'text',
      name: 'position',
      qa: 'position',
    },
    {
      fieldType: 'select',
      label: 'Office',
      name: 'office',
      qa: 'office',
      options: [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ],
    },
    {
      fieldType: 'input',
      label: 'Age',
      type: 'number',
      name: 'age',
      qa: 'age',
    },
    {
      fieldType: 'input',
      label: 'Salary',
      type: 'number',
      name: 'salary',
      qa: 'salary',
    },
  ];

  fields.forEach((field) => {
    const label = document.createElement('label');

    label.textContent = `${field.label}: `;

    if (field.fieldType === 'input') {
      const input = document.createElement('input');

      input.type = field.type;
      input.name = field.name;
      input.setAttribute('data-qa', field.qa);
      input.required = true;

      label.appendChild(input);
      formOnCreate.appendChild(label);
      formOnCreate.appendChild(document.createElement('br'));
    } else if (field.fieldType === 'select') {
      const select = document.createElement('select');

      select.name = 'office';
      select.setAttribute('data-qa', 'office');
      select.required = true;

      field.options.forEach((opt) => {
        const option = document.createElement('option');

        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });

      label.appendChild(select);
      formOnCreate.appendChild(label);
      formOnCreate.appendChild(document.createElement('br'));
    }
  });

  // Create the submit button
  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  formOnCreate.appendChild(submitButton);

  // Append the form to the document body or any specific container
  document.body.appendChild(formOnCreate);
}

document.addEventListener('DOMContentLoaded', function () {
  createEmployeeForm();

  const button = document.querySelector('button');
  const form = document.querySelector('form');

  button.addEventListener('click', function (e) {
    e.preventDefault();

    const formData = {
      name: form.name.value,
      position: form.position.value,
      office: form.office.value,
      age: parseInt(form.age.value, 10),
      salary: '$' + parseInt(form.salary.value).toLocaleString('en-US'),
    };

    if (validateFormData(formData)) {
      addEmployeeToTable(formData);

      pushNotification(
        580,
        275,
        'Success message',
        'Success: Employee added to the table.',
        'success',
      );
      form.reset();
    }
  });

  for (const td of document.querySelectorAll('td')) {
    td.addEventListener('dblclick', () => editable.edit(td));
  }
});
// #endregion
// 4.Show notification if form
// data is invalid(use notification from the previous tasks).+
// #region
// відповідає за відправлення сповіщень

const pushNotification = (posTop, posRight, title, description, type) => {
  const textContainer = document.createElement('div');

  textContainer.className = `notification ${type}`;
  textContainer.setAttribute('data-qa', 'notification');

  Object.assign(textContainer.style, {
    top: `${posTop}px`,
    right: `${posRight}px`,
  });

  textContainer.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(textContainer);

  setTimeout(() => (textContainer.style.visibility = 'hidden'), 2000);
};
// #endregion
// 5.Implement editing of table cells by double-clicking on it. (optional)
// #region

const editable = {
  ccell: null,
  cval: null,

  edit: (cell) => {
    editable.ccell = cell;
    editable.cval = cell.innerHTML;

    cell.classList.add('cell-input');
    cell.contentEditable = true;
    cell.focus();

    cell.onblur = editable.done;

    cell.onkeydown = (e) => {
      if (e.key === 'Enter') {
        editable.done();
      }

      if (e.key === 'Escape') {
        editable.done(1);
      }
    };
  },

  done: (discard) => {
    editable.ccell.onblur = '';
    editable.ccell.onkeydown = '';

    editable.ccell.classList.remove('cell-input');
    editable.ccell.contentEditable = false;

    if (discard === 1) {
      editable.ccell.innerHTML = editable.cval;
    }
  },
};
// #endregion
