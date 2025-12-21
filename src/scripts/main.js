'use strict';

const headers = document.querySelectorAll('th');
const table = document.querySelector('table');
let tbody;

for (const elem of table.children) {
  if (elem.tagName === 'TBODY') tbody = elem;
}

for (const header of headers) {
  header.addEventListener('click', () => {
    const thIndex = [...header.parentElement.children].indexOf(header);
    const rows = [...tbody.children];

    rows.sort((a, b) => {
      const valA = a.children[thIndex].textContent;
      const valB = b.children[thIndex].textContent;

      if (!isNaN(parseFloat(valA))) {
        return parseFloat(valA) - parseFloat(valB);
      } else {
        return valA.localeCompare(valB);
      }
    });

    rows.forEach(row => tbody.appendChild(row));
  });
}

const body = document.querySelector('body');
const form = document.createElement('form');
form.classList.add('new-employee-form');

form.append(
  createLabeledInput('Name', 'name', 'text', 'name'),
  createLabeledInput('Position', 'position', 'text', 'position'),
  createOfficeSelect(),
  createLabeledInput('Age', 'age', 'number', 'age'),
  createLabeledInput('Salary', 'salary', 'number', 'salary'),
  createButton()
);

body.append(form);

function createLabeledInput(text, name, type, qa) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = `${text}: `;
  input.name = name;
  input.type = type;
  input.dataset.qa = qa;

  label.append(input);
  return label;
}

function createOfficeSelect() {
  const label = document.createElement('label');
  const select = document.createElement('select');
  const options = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

  label.textContent = 'Office: ';
  select.name = 'office';
  select.dataset.qa = 'office';

  for (const city of options) {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    select.append(option);
  }

  label.append(select);
  return label;
}

function createButton() {
  const btn = document.createElement('button');
  btn.textContent = 'Save to table';

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const data = getFormData(form);
    const validation = validateFormData(data);

    if (!validation.valid) {
      showNotification(validation.message, 'error');
      return;
    }

    addEmployeeToTable(data);
    showNotification('Employee added successfully', 'success');
    form.reset();
  });

  return btn;
}

function getFormData(form) {
  return {
    name: form.querySelector('[name="name"]').value.trim(),
    position: form.querySelector('[name="position"]').value.trim(),
    office: form.querySelector('[name="office"]').value,
    age: Number(form.querySelector('[name="age"]').value),
    salary: Number(form.querySelector('[name="salary"]').value),
  };
}

function validateFormData(data) {
  if (data.name.length < 4) return { valid: false, message: 'Name must be at least 4 characters' };
  if (data.age < 18 || data.age > 90) return { valid: false, message: 'Age must be between 18 and 90' };
  if (!data.position || !data.office || !data.salary) return { valid: false, message: 'All fields are required' };
  return { valid: true };
}

function addEmployeeToTable(data) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${data.age}</td>
    <td>${data.salary}</td>
  `;

  tbody.appendChild(row);

  row.addEventListener('click', () => {
    document.querySelectorAll('tr.active').forEach(r => r.classList.remove('active'));
    row.classList.add('active');
  });
}

function showNotification(message, type) {
  const notif = document.createElement('div');
  notif.textContent = message;
  notif.dataset.qa = 'notification';
  notif.classList.add(type);

  document.body.append(notif);

  setTimeout(() => notif.remove(), 3000);
}
