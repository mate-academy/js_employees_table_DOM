'use strict';

// write code here
const table = document.querySelector('table');
const headers = [...table.querySelectorAll('th')];
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];
let lastSortedColumn = null;
let isDescending = false;

const getNumber = (n) => Number(n.replace(/[^0-9.-]+/g, ''));

headers.forEach((header, i) => {
  header.addEventListener('click', () => {
    if (lastSortedColumn === i) {
      isDescending = !isDescending;
    } else {
      lastSortedColumn = i;
      isDescending = false;
    }

    rows.sort((a, b) => {
      const cellA = a.querySelectorAll('td')[i].textContent;
      const cellB = b.querySelectorAll('td')[i].textContent;

      if (Number(getNumber(cellA))) {
        return isDescending
          ? getNumber(cellB) - getNumber(cellA)
          : getNumber(cellA) - getNumber(cellB);
      } else {
        return isDescending
          ? cellB.localeCompare(cellA)
          : cellA.localeCompare(cellB);
      }
    });

    rows.forEach((row) => tbody.appendChild(row));
  });
});

table.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (row) {
    table.querySelectorAll('tr').forEach((i) => i.classList.remove('active'));
    row.classList.add('active');
  }
});

const forma = document.createElement('form');

forma.className = 'new-employee-form';

forma.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <button data-qa="save-button">Save to table</button>
`;

document.body.append(forma);

const form = document.forms[0];
const button = form.querySelector('button[data-qa="save-button"]');

const getFormData = () => ({
  name: form.elements.name.value.trim(),
  position: form.elements.position.value.trim(),
  office: form.elements.office.value.trim(),
  age: parseInt(form.elements.age.value, 10),
  salary: parseFloat(form.elements.salary.value.replace(/[^0-9.]/g, '')),
});

button.addEventListener('click', (e) => {
  e.preventDefault();

  if (!validate()) {
    return;
  }

  const newPerson = getFormData();

  form.reset();

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${newPerson.name}</td>
    <td>${newPerson.position}</td>
    <td>${newPerson.office}</td>
    <td>${newPerson.age}</td>
    <td>$${newPerson.salary.toLocaleString('en')}</td>
  `;

  tbody.prepend(newRow);
  message('Well done!', ' Mission complete', 'success');
});

const message = (title, description, type) => {
  const div = document.createElement('div');

  div.className = `notification ${type}`;
  div.setAttribute('data-qa', 'notification');

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;
  div.appendChild(h2);

  const p = document.createElement('p');

  p.textContent = description;
  div.appendChild(p);
  document.body.appendChild(div);

  setTimeout(() => {
    div.style.visibility = 'hidden';
  }, 2000);
};

const validate = () => {
  let isValid = true;

  form.querySelectorAll('input').forEach((input) => {
    if (input.value.trim().length === 0) {
      message('Error', 'All fields must be filled', 'error');
      isValid = false;
    }
  });

  const personName = form.elements.name.value.trim();

  if (personName.length < 4 && personName.length > 0) {
    message('Error', 'The minimum name length is 4 letters', 'error');
    isValid = false;
  }

  const age = parseInt(form.elements.age.value, 10);

  if ((age < 18 && age > 0) || age > 90) {
    message('Error', 'Still small', 'error');
    isValid = false;
  }

  return isValid;
};
