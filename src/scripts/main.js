'use strict';

const table = document.querySelector('table');
const head = document.querySelector('thead');
const th = head.querySelectorAll('th');
const tbody = document.querySelector('tbody');

const sortDirection = {};

th.forEach((th, index) => {
th.addEventListener('click', () => {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  sortDirection[index] = !sortDirection[index];
  const isAsc = sortDirection[index];

  rows.sort((a, b) => {
    const listA = a.children[index].textContent.trim();
    const listB = b.children[index].textContent.trim();

    const numA = parseFloat(listA.replace(/[$,]/g, ''));
    const numB = parseFloat(listB.replace(/[$,]/g, ''));
    const bothNum = !isNaN(numA) && !isNaN(numB);

    if (bothNum) {
      return isAsc ? numA - numB : numB - numA;
    }

    return isAsc

    ? listA.localeCompare(listB, 'uk', { numeric: true })
    : listB.localeCompare(listA, 'uk', { numeric: true });

  });

  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
})
})

tbody.addEventListener('click', (event) => {
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const clickRows = event.target.closest('tr');

  if (clickRows) {
  const className = document.querySelector('.active');
  if (className) {
  className.classList.remove('active');
  }
  clickRows.classList.add('active');
  }

})

const form = document.createElement('form');
form.classList.add('new-employee-form');

const label = document.createElement('label');
label.textContent = 'Name: ';

const input = document.createElement('input');
input.name = 'name';
input.type = 'text';
input.setAttribute('data-qa', 'name');

label.appendChild(input);
form.appendChild(label);

const label1 = document.createElement('label');
label1.textContent = 'Position: ';

const input1 = document.createElement('input');
input1.name = 'position';
input1.type = 'text';
input1.setAttribute('data-qa', 'position');

label1.appendChild(input1);
form.appendChild(label1);

const label2 = document.createElement('label');
label2.textContent = 'Age: ';

const input2 = document.createElement('input');
input2.name = 'age';
input2.type = 'number';
input2.setAttribute('data-qa', 'age');

label2.appendChild(input2);
form.appendChild(label2);

const label3 = document.createElement('label');
label3.textContent = 'Salary: ';

const input3 = document.createElement('input');
input3.name = 'salary';
input3.type = 'number';
input3.setAttribute('data-qa', 'salary');

label3.appendChild(input3);
form.appendChild(label3);

const label4 = document.createElement('label');
label4.textContent = 'Office: ';

const select = document.createElement('select');
select.name = 'office';
select.setAttribute('data-qa', 'office');

const options = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

options.forEach(city => {
 const option = document.createElement('option');
 option.value = city;
 option.textContent = city;
 select.appendChild(option);
})

label4.appendChild(select);
form.appendChild(label4);

const button = document.createElement('button');
button.type = 'submit';
button.textContent = 'Save to table';
form.appendChild(button);

document.body.insertBefore(form, table);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const inp = document.querySelectorAll('input');
  const se = document.querySelectorAll('select');
  const name = inp[0].value.trim();
  const position = inp[1].value.trim();
  const age = parseInt(inp[2].value);
  const salary = parseFloat(inp[3].value);
  const office = se[0].value;

  if (name.length < 4) {
    showNotification('Name must be at least 4 characters', 'error');
    return;
  }

  if (age < 18 || age > 90 || isNaN(age)) {
    showNotification('Age must be between 18 and 90', 'error');
    return;
  }

  const tr = document.createElement('tr');

  [name, position, office, age, `$${salary.toLocaleString('en-US')}`].forEach(text => {
    const td = document.createElement('td');
    td.textContent = text;
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
  showNotification('Employee added successfully!', 'success');

  form.reset();
});

tbody.addEventListener('dblclick', (event) => {
  const td = event.target.closest('td');

  if (!td || td.querySelector('input')) return;

  const originalValue = td.textContent;
  const input = document.createElement('input');
  input.classList.add('cell-input');
  input.value = originalValue;
  td.textContent = '';
  td.appendChild(input);
  input.focus();

  const save = () => {
    const newValue = input.value.trim();
    td.textContent = newValue === '' ? originalValue : newValue;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    }
  });
});

function showNotification(message, type) {
  const note = document.createElement('div');
  note.textContent = message;
  note.className = `notification ${type}`;
  document.body.appendChild(note);

  setTimeout(() => note.remove(), 3000);
}
