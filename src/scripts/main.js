'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');

// sort Table
const getCellValue = (tr, i) => {
  return tr.children[i].innerText;
};

thead.addEventListener('click', (e) => {
  const th = e.target;
  const idx = th.cellIndex;
  const isAscending = !th.classList.contains('asc');

  [...thead.querySelectorAll('th')].forEach((header) => {
    header.classList.remove('asc', 'desc');
  });

  th.classList.toggle('asc', isAscending);
  th.classList.toggle('desc', !isAscending);

  const direction = th.classList.contains('asc') ? 1 : -1;
  const rowArray = [...tbody.rows];

  rowArray.sort((rowA, rowB) => {
    const cellA = getCellValue(rowA, idx);
    const cellB = getCellValue(rowB, idx);

    const a = isNaN(cellA) ? cellA : parseFloat(cellA.replace(/[^0-9.]/g, ''));
    const b = isNaN(cellB) ? cellB : parseFloat(cellB.replace(/[^0-9.]/g, ''));

    return isNaN(a) && isNaN(b)
      ? new Intl.Collator().compare(cellA, cellB) * direction
      : (a - b) * direction;
  });

  tbody.append(...rowArray);
});

// selected row
tbody.addEventListener('click', (e) => {
  const rows = [...tbody.rows];

  rows.forEach((row) => {
    row.classList.remove('active');
  });
  e.target.parentElement.classList.add('active');
});

// form
const body = document.querySelector('body');
const form = document.createElement('form');

body.append(form);
form.classList.add('new-employee-form');

// Name input
const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

nameLabel.setAttribute('data-qa', 'name');
nameLabel.innerText = 'Name:';
form.append(nameLabel);

nameInput.setAttribute('name', 'name');
nameInput.setAttribute('type', 'text');
nameLabel.append(nameInput);

// position input
const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionLabel.setAttribute('data-qa', 'position');
positionLabel.innerText = 'Position:';
form.append(positionLabel);

positionInput.setAttribute('name', 'position');
positionInput.setAttribute('type', 'text');
positionLabel.append(positionInput);

// office select
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const selectLabel = document.createElement('label');
const selectOffice = document.createElement('select');

selectLabel.setAttribute('data-qa', 'office');
selectLabel.innerText = 'Office:';
form.append(selectLabel);

selectOffice.setAttribute('data-qa', 'office');
selectOffice.setAttribute('name', 'office');
selectLabel.append(selectOffice);

cities.forEach((citi) => {
  const optionCiti = document.createElement('option');

  optionCiti.setAttribute('value', citi);
  optionCiti.innerText = citi;
  selectOffice.append(optionCiti);
});

// age input
const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

ageLabel.setAttribute('data-qa', 'age');
ageLabel.innerText = 'Age:';
form.append(ageLabel);

ageInput.setAttribute('name', 'age');
ageInput.setAttribute('type', 'number');
ageLabel.append(ageInput);

// salary input
const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

salaryLabel.setAttribute('data-qa', 'salary');
salaryLabel.innerText = 'Salary:';
form.append(salaryLabel);

salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('type', 'number');
salaryLabel.append(salaryInput);

// button form
const button = document.createElement('button');

button.setAttribute('name', 'saveToTable');
button.setAttribute('type', 'submit');
button.innerText = 'Save to table';
form.append(button);

// button submit
const formData = document.querySelector('.new-employee-form');

formData.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const fData = {
    name: data.get('name'),
    position: data.get('position'),
    office: data.get('office'),
    age: data.get('age'),
    salary: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(data.get('salary')),
  };

  // validator
  if (!validName(fData.name)) {
    pushNotification(
      10,
      10,
      'Wrong Name',
      'Error.\n ' +
        'The name must consist of letters and be longer than 4 characters',
      'error',
    );
  } else if (!validAge(fData.age)) {
    pushNotification(
      10,
      10,
      'Wrong Age',
      'Error.\n ' + 'Аge must be between 18 and 90.',
      'error',
    );
  } else {
    const tr = document.createElement('tr');

    [...thead.querySelectorAll('th')].forEach((header) => {
      const key = header.innerText.toLocaleLowerCase();
      const td = document.createElement('td');

      td.innerText = fData[key];
      tr.append(td);
    });

    tbody.append(tr);
    form.reset();

    pushNotification(
      10,
      10,
      'Successful addition',
      'Success.\n ' + 'Record successfully added to the table.',
      'success',
    );
  }
});

const validName = (dataName) => {
  const namePattern = /^[a-zA-Z]{4,}$/;

  return namePattern.test(dataName);
};

const validAge = (dataAge) => {
  return dataAge >= 18 && dataAge <= 90;
};

// validation
const pushNotification = (posTop, posRight, title, description, type) => {
  const container = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  container.className = `notification ${type}`;
  container.setAttribute('data-qa', 'notification');
  container.style.top = `${posTop}px`;
  container.style.right = `${posRight}px`;
  body.appendChild(container);

  h2.className = 'title';
  h2.style.whiteSpace = 'nowrap';
  h2.innerText = `${title}`;
  container.appendChild(h2);

  p.innerText = `${description}`;
  container.appendChild(p);

  setTimeout(() => {
    container.style.visibility = 'hidden';
  }, 2000);
};

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (cell.tagName === 'TD') {
    const originalText = cell.innerText;
    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.value = originalText;

    cell.innerText = '';
    cell.appendChild(input);
    input.focus();

    const saveChanges = () => {
      const newText = input.value.trim();

      if (newText) {
        cell.innerText = newText;
      } else {
        cell.innerText = originalText;
      }

      cell.removeChild(input);
    };

    input.addEventListener('blur', saveChanges);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        saveChanges();
      }
    });
  }
});
