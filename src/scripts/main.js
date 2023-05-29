'use strict';

// Sorting

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

thead.addEventListener('click', e => {
  const index = e.target.cellIndex;
  const th = e.target.closest('th');
  const childs = Array.from(tbody.children);

  if (th.as === 'DESC') {
    childs.reverse();

    for (const childRow of childs) {
      tbody.append(childRow);
    }
    th.as = 'ASC';

    return;
  }

  childs.sort(function(a, b) {
    const comparePart1 = a.children[index].innerText;
    const comparePart2 = b.children[index].innerText;

    if (comparePart1[0] === '$') {
      const prev = parseFloat(comparePart1.slice(1));
      const next = parseFloat(comparePart2.slice(1));

      return Number(prev) - Number(next);
    }

    return comparePart1.localeCompare(comparePart2);
  });

  for (const childRow of childs) {
    tbody.append(childRow);
  }
  th.as = 'DESC';
});

// Selected
const trs = document.querySelectorAll('tr');

tbody.addEventListener('click', e => {
  Array.from(trs);

  for (const i of trs) {
    i.className = '';
  }
  e.target.closest('tr').className = 'active';
});

// form

const body = document.querySelector('body');
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position:
  <input name="position" type="text" data-qa="position" required>
</label>
<label>Office: <select name="office" data-qa="office" required>
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
</select>
</label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary:
  <input name="salary" type="number" data-qa="salary"required>
</label>
<button>Save to table</button>
`;

body.append(form);

// validation

const nameInput = document.querySelector('[data-qa="name"]');
const positionInput = document.querySelector('[data-qa="position"]');
const officeInput = document.querySelector('[data-qa="office"]');
const ageInput = document.querySelector('[data-qa="age"]');
const salaryInput = document.querySelector('[data-qa="salary"]');

nameInput.addEventListener('blur', (e) => {
  if (nameInput.value.length < 4) {
    Noti('Warning', 'Name has less than 4 letters', 'warning');
    e.target.value = '';
  }
});

ageInput.addEventListener('blur', (e) => {
  if (e.target.value < 18 || e.target.value > 90) {
    Noti('Warning', 'Age should be from 18 to 90 years', 'warning');
    e.target.value = '';
  }
});

// Add employe

form.addEventListener('submit', e => {
  e.preventDefault();

  const newEmployee = document.createElement('tr');
  const personName = newEmployee.insertCell(0);
  const personPosition = newEmployee.insertCell(1);
  const personOffice = newEmployee.insertCell(2);
  const personAge = newEmployee.insertCell(3);
  const personSalary = newEmployee.insertCell(4);

  personName.innerText = nameInput.value;
  personPosition.innerText = positionInput.value;
  personOffice.innerText = officeInput.value;
  personAge.innerText = ageInput.value;

  if (salaryInput.value > 999) {
    const value = salaryInput.value.split('');
    const lastChar = value.splice(value.length - 3).join('');

    personSalary.innerText = `$${value.join('')},${lastChar}`;
  } else {
    personSalary.innerText = `$${salaryInput.value}`;
  }
  tbody.prepend(newEmployee);

  nameInput.value = '';
  positionInput.value = '';
  ageInput.value = '';
  salaryInput.value = '';

  Noti('Success', 'New employee is successfully added to the table', 'success');
});

// Notification

function Noti(tittle, text, result) {
  const noti = document.createElement('div');

  noti.setAttribute('data-qa', 'notification');
  noti.classList = `notification ${result}`;
  noti.title = tittle;
  noti.textContent = text;
  body.prepend(noti);

  setTimeout(() => noti.remove(), 2000);
}

// Dblclick

tbody.addEventListener('dblclick', e => {
  const el = e.target.closest('td');
  const input = document.createElement('input');

  el.textContent = '';
  input.className = 'cell-input';
  el.append(input);

  input.addEventListener('blur', eve => {
    el.innerText = eve.target.value;
  });
});
