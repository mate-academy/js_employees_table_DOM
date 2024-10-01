'use strict';

const thead = document.querySelector('tr');
const tbody = document.querySelector('tbody');
const sort = createSorter();
const active = createActivator();
const form = createForm();

thead.addEventListener('click', (e) => {
  // call sort (rowsArray, comparator, comparators)
  sort([...tbody.children], e.target.closest('th'), thead);
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  active(row, 'active');
});

tbody.addEventListener('dblclick', (e) => {
  e.preventDefault();

  const cell = e.target.closest('td');
  const input = document.createElement('input');
  const prevValue = cell.textContent;

  active(input, 'cell-input');
  input.value = cell.textContent;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (input.value.length === 0 || input.value !== new RegExp('^a-zA-Z0-9')) {
      cell.textContent = prevValue;
    } else {
      cell.textContent = input.value;
    }
  });

  input.addEventListener('keydown', (k) => {
    if (k.key === 'Enter') {
      if (
        input.value.length === 0 ||
        input.value !== new RegExp('^a-zA-Z0-9')
      ) {
        cell.textContent = prevValue;
      } else {
        cell.textContent = input.value;
      }
    }
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const dName = data.get('name');
  const position = data.get('position');
  const office = data.get('office');
  const age = data.get('age');
  let salary = data.get('salary');

  if (validating(dName, age)) {
    salary = `$${parseInt(salary).toLocaleString('en-US')}`;

    addEmployee(dName, position, office, age, salary);
  }
});

function validating(dName, position, age) {
  let valid = true;
  let type = 'success';
  let message = 'The new employee was successfully added to the table';

  if (dName.length < 4 || !/^[a-zA-Z0-9]+$/.test(dName)) {
    type = 'error';
    message = 'Name is too short or has invalid characters';
    valid = false;
  } else if (age < 18 || age > 99) {
    type = 'error';
    message = 'Age value is less than 18 or more than 99';
    valid = false;
  } else if (!/^[a-zA-Z0-9]+$/.test(position)) {
    type = 'error';
    message = 'Position contains invalid characters';
    valid = false;
  }

  const nonfication = document.createElement('div');
  const title = document.createElement('h2');

  nonfication.className = `notification ${type}`;
  title.className = 'title';

  title.textContent = message;

  nonfication.append(title);
  document.body.append(nonfication);

  setTimeout(() => (nonfication.style.visibility = 'hidden'), 1000);

  return valid;
}

function addEmployee(...args) {
  const newRow = document.createElement('tr');

  args.forEach((v) => {
    const newCell = document.createElement('td');

    newCell.textContent = v;
    newRow.append(newCell);
  });

  tbody.append(newRow);
}

function createForm() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  newForm.insertAdjacentHTML(
    'afterbegin',
    `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" data-qa="position" type="text" required></label>
      <label>Office: <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select></label>

      <label>Age: <input name="age"  data-qa="age" type="number" required></label>
      <label>Salary: <input name="salary"  data-qa="salary" type="number" required></label>
      <button type="submit">Save to table</button>
    `,
  );

  document.body.append(newForm);

  return newForm;
}

function createActivator() {
  let prevActive;

  return (element, activatorClass) => {
    if (prevActive) {
      prevActive.className = '';
    }

    element.classList.add(activatorClass);
    prevActive = element;
  };
}

function createSorter() {
  let prevComparator = '';
  let ascending = true;

  return (table, comparator, categorys) => {
    const i = [...categorys.children] // get array from all 'th' elements
      .map((v) => v.textContent) // get text from each 'th' element
      .findIndex((v) => v === comparator.textContent); // find comparator index

    if (prevComparator === comparator.textContent) {
      ascending = !ascending; // change sort direction
    } else {
      prevComparator = comparator.textContent;
      ascending = true;
    }

    const sorted = table.sort((a, b) => {
      // geting text content from a and b elements
      let cola = [...a.children].map((v) => v.textContent)[i];
      let colb = [...b.children].map((v) => v.textContent)[i];

      if (cola[0] === '$') {
        // parses a str and returns an int of salary
        cola = parseInt(cola.replace(/[$,]/g, ''));
        colb = parseInt(colb.replace(/[$,]/g, ''));
      }

      if (cola < colb) {
        return ascending ? -1 : 1;
      }

      if (cola > colb) {
        return ascending ? 1 : -1;
      }

      return 0;
    });

    sorted.forEach((row) => {
      // updating document
      row.parentNode.appendChild(row);
    });
  };
}
