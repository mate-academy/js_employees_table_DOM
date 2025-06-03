'use strict';

const header = document.querySelector('thead tr');
const lines = document.querySelectorAll('tbody tr');
let currentSortIndex = null;
let ascending = true;

const pushNotification = (posTop, posRight, title, description, type) => {
  const h2 = document.createElement('h2');
  const div = document.createElement('div');
  const p = document.createElement('p');

  const existing = document.querySelector(`.notification.${type}`);

  if (existing) {
    existing.remove();
  }

  h2.classList.add('title');
  div.classList.add('notification', type);
  div.setAttribute('data-qa', 'notification');

  h2.textContent = title;
  p.textContent = description;

  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  div.append(h2, p);
  document.body.append(div);

  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
};

function sortedRows(index) {
  const rows = Array.from(document.querySelectorAll('tbody tr'));

  rows.sort((a, b) => {
    const textA = a.children[index].textContent;
    const textB = b.children[index].textContent;

    const cleanA = textA.replace(/[$,]/g, '');
    const cleanB = textB.replace(/[$,]/g, '');

    const numA = parseFloat(cleanA);
    const numB = parseFloat(cleanB);

    let result;

    if (!isNaN(numA) && !isNaN(numB)) {
      result = numA - numB;
    } else {
      result = textA.localeCompare(textB);
    }

    return ascending ? result : -result;
  });

  return rows;
}

function handleSort(index) {
  const tbody = document.querySelector('tbody');

  if (currentSortIndex === index) {
    ascending = !ascending;
  } else {
    currentSortIndex = index;
    ascending = true;
  }

  sortedRows(index).forEach((row) => tbody.appendChild(row));
}

header.children[0].addEventListener('click', () => handleSort(0));
header.children[1].addEventListener('click', () => handleSort(1));
header.children[2].addEventListener('click', () => handleSort(2));
header.children[3].addEventListener('click', () => handleSort(3));
header.children[4].addEventListener('click', () => handleSort(4));

lines.forEach((line) => {
  line.addEventListener('click', () => {
    lines.forEach((l) => l.classList.remove('active'));
    line.classList.add('active');
  });
});

const form = document.createElement('form');

form.className = 'new-employee-form';

function createLabelWithInput(labelText, inputName, inputType, dataQa) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = labelText;
  input.type = inputType;
  input.name = inputName;
  input.required = true;
  input.setAttribute('data-qa', dataQa);

  label.appendChild(input);

  return label;
}

const labelOffice = document.createElement('label');
const select = document.createElement('select');
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.textContent = office;
  select.append(option);
});

labelOffice.textContent = 'Office: ';
select.name = 'office';
labelOffice.append(select);
select.setAttribute('data-qa', 'office');

const button = document.createElement('button');

button.textContent = 'Save to table';

form.append(createLabelWithInput('Name: ', 'name', 'text', 'name'));
form.append(createLabelWithInput('Position: ', 'position', 'text', 'position'));
form.appendChild(labelOffice);
form.append(createLabelWithInput('Age: ', 'age', 'number', 'age'));
form.append(createLabelWithInput('Salary: ', 'salary', 'number', 'salary'));
form.append(button);
document.body.append(form);

document.querySelector('button').addEventListener('click', (e) => {
  const tbody = document.querySelector('tbody');
  const nameValue = form.elements.name.value.trim();
  const positionValue = form.elements.position.value.trim();
  const officeValue = form.elements.office.value.trim();
  const ageValue = form.elements.age.value.trim();
  const salaryValue = form.elements.salary.value.trim();
  const values = [nameValue, positionValue, officeValue, ageValue, salaryValue];

  if (check(nameValue, positionValue, officeValue, ageValue, salaryValue)) {
    const tr = document.createElement('tr');

    values.forEach((v, i) => {
      const td = document.createElement('td');

      if (i === 4) {
        const num = parseFloat(v);

        td.textContent = num.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        });
      } else {
        td.textContent = v;
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }

  e.preventDefault();
});

function check(nameIn, positionIn, officeIn, ageIn, salaryIn) {
  if (nameIn.length < 4) {
    pushNotification(
      150,
      10,
      'Помилка',
      'Value has fewer than 4 letters',
      'error',
    );

    return false;
  }

  if (positionIn.length < 4) {
    pushNotification(
      150,
      10,
      'Помилка',
      'Value has fewer than 4 letters',
      'error',
    );

    return false;
  }

  if (salaryIn < 0) {
    pushNotification(
      150,
      10,
      'Помилка',
      'Value has fewer than 4 letters',
      'error',
    );

    return false;
  }

  if (ageIn < 18 || ageIn > 90) {
    pushNotification(
      150,
      10,
      'Помилка',
      'Value is less than 18 or more than 90',
      'error',
    );

    return false;
  }

  pushNotification(
    10,
    10,
    'Успіх',
    'Employee successfully added to the table',
    'success',
  );

  return true;
}
