'use strict';
// write code here

const table = document.querySelector('table');
const titleArr = table.querySelector('tr').querySelectorAll('th');
const tbody = table.querySelector('tbody');

const officeChoice = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// Sort rows
let currentColumn = null;
let isAscending = true;

titleArr.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = [...tbody.querySelectorAll('tr')];

    if (currentColumn === index) {
      isAscending = !isAscending;
    } else {
      currentColumn = index;
      isAscending = true;
    }

    const sortedRows = rows.sort((a, b) => {
      const aText = a.children[index].textContent.trim();
      const bText = b.children[index].textContent.trim();

      const aNumber = parseFloat(aText.replace(/[$,]/g, ''));
      const bNumber = parseFloat(bText.replace(/[$,]/g, ''));

      let comparison;

      if (!isNaN(aNumber) && !isNaN(bNumber)) {
        comparison = aNumber - bNumber;
      } else {
        comparison = aText.localeCompare(bText);
      }

      return isAscending ? comparison : -comparison;
    });

    tbody.innerHTML = '';
    sortedRows.forEach((row) => tbody.appendChild(row));
  });
});

// Select row
tbody.addEventListener('click', (e) => {
  // console.log(tbody.querySelectorAll('tr')[1].className.includes('active'))
  tbody.querySelectorAll('tr').forEach((row) => {
    if (row.className.includes('active')) {
      row.classList.remove('active');
    }
  });
  e.target.parentElement.classList.add('active');
});

// Form
const body = document.querySelector('body');
const form = document.createElement('form');

body.appendChild(form);
form.className = 'new-employee-form';

const button = document.createElement('button');

button.innerText = 'Save to table';

function createInput(labelText, type, discribe) {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.type = type;
  input.name = discribe;
  input.dataset.qa = discribe;
  input.required = true;

  label.appendChild(input);

  return label;
}

const nameLabel = createInput('Name:', 'text', 'name');
const positionLabel = createInput('Position:', 'text', 'position');
const ageLabel = createInput('Age:', 'number', 'age');
const salarylabel = createInput('Salary:', 'number', 'salary');

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const selectLabel = document.createElement('select');

selectLabel.name = 'office';
selectLabel.dataset.qa = 'office';
selectLabel.required = true;
officeLabel.appendChild(selectLabel);

for (const office of officeChoice) {
  const option = document.createElement('option');

  option.textContent = office;
  option.value = office;
  selectLabel.appendChild(option);
}

form.appendChild(nameLabel);
form.appendChild(positionLabel);
form.appendChild(officeLabel);
form.appendChild(ageLabel);
form.appendChild(salarylabel);

form.appendChild(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const firstName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  let salary = Number(formData.get('salary'));

  if (!firstName || !position || !office || !age || !salary) {
    pushNotification(
      10,
      10,
      'Data is missing in some inputs',
      'Missing data',
      'error',
    );

    return;
  }

  if (firstName.length < 4) {
    pushNotification(
      10,
      10,
      'Name is not correct length',
      'Wrong Name length',
      'error',
    );

    return;
  } else if (position.length < 4) {
    pushNotification(
      10,
      10,
      'Position is not correct length',
      'Wrong Position length',
      'error',
    );

    return;
  } else if (age > 90 || age < 18) {
    pushNotification(
      10,
      10,
      'Wrong Age',
      'Age is a bit strange for this action',
      'error',
    );

    return;
  }

  salary = '$' + salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const tr = document.createElement('tr');

  [firstName, position, office, age, salary].forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
  form.reset();

  pushNotification(
    10,
    10,
    'New Employee add',
    'New employee is successfully added to the table',
    'success',
  );
});

// Notification

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.className = 'notification';
  div.style.position = 'absolute';
  div.style.top = posTop + `px`;
  div.style.right = posRight + `px`;
  div.dataset.qa = 'notification';

  if (type === 'success') {
    div.className = div.className + ' success';
  } else if (type === 'error') {
    div.className = div.className + ' error';
  } else if (type === 'warning') {
    div.className = div.className + ' warning';
  }

  h2.innerText = title;
  h2.className = 'title';
  p.innerText = description;

  div.appendChild(h2);
  div.appendChild(p);
  document.querySelector('body').append(div);

  setTimeout(() => {
    div.style.display = 'none';
  }, 4000);
};
