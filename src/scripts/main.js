'use strict';

// write code here

const table = document.querySelector('table');
const tHead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

let sortColumn = null;
let sortDirection = 'asc';

tHead.addEventListener('click', (events) => {
  if (events.target.tagName !== 'TH') {
    return;
  }

  const th = events.target;
  const thI = th.cellIndex;

  if (thI === sortColumn) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = thI;
    sortDirection = 'asc';
  }

  const rows = Array.from(table.querySelectorAll('tbody tr'));

  rows.sort((a, b) => {
    const valueA = a.cells[thI].textContent.trim();
    const valueB = b.cells[thI].textContent.trim();

    let result;

    if (thI === 3) {
      result = Number(valueA) - Number(valueB);
    } else if (thI === 4) {
      const cleanA = Number(valueA.replace(/[$,]/g, ''));
      const cleanB = Number(valueB.replace(/[$,]/g, ''));

      result = cleanA - cleanB;
    } else {
      result = valueA.localeCompare(valueB);
    }

    return sortDirection === 'asc' ? result : -result;
  });

  rows.forEach((row) => tbody.appendChild(row));
});

tbody.addEventListener('click', (events) => {
  if (!events.target.closest('tr')) {
    return;
  }

  const tr = events.target.closest('tr');

  const trActive = document.querySelectorAll('tr.active');

  trActive.forEach((el) => {
    el.classList.remove('active');
  });

  tr.classList.add('active');
});

const form = document.createElement('form');

document.body.append(form);

form.classList.add('new-employee-form');

const input1 = document.createElement('input');
const input2 = document.createElement('input');
const select = document.createElement('select');
const input3 = document.createElement('input');
const input4 = document.createElement('input');

input1.dataset.qa = 'name';
input2.dataset.qa = 'position';
select.dataset.qa = 'office';
input3.dataset.qa = 'age';
input4.dataset.qa = 'salary';

input1.type = 'text';
input2.type = 'text';
input3.type = 'number';
input4.type = 'number';

const submit = document.createElement('button');

submit.textContent = 'Save to table';
submit.type = 'submit';

const label1 = document.createElement('label');
const label2 = document.createElement('label');
const label3 = document.createElement('label');
const label4 = document.createElement('label');
const label5 = document.createElement('label');

label1.textContent = 'Name:';
label1.append(input1);

label2.textContent = 'Position:';
label2.append(input2);

label3.textContent = 'Office:';
label3.append(select);

label4.textContent = 'Age:';
label4.append(input3);

label5.textContent = 'Salary:';
label5.append(input4);

const option1 = document.createElement('option');
const option2 = document.createElement('option');
const option3 = document.createElement('option');
const option4 = document.createElement('option');
const option5 = document.createElement('option');
const option6 = document.createElement('option');

option1.textContent = 'Tokyo';
option2.textContent = 'Singapore';
option3.textContent = 'London';
option4.textContent = 'New York';
option5.textContent = 'Edinburgh';
option6.textContent = 'San Francisco';

select.append(option1, option2, option3, option4, option5, option6);

form.append(label1, label2, label3, label4, label5, submit);

form.addEventListener('submit', (events) => {
  events.preventDefault();

  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  const nameValue = input1.value;
  const positionValue = input2.value;
  const officeValue = select.value;
  const ageValue = input3.value;
  const salaryValue = input4.value;

  const div = document.createElement('div');

  div.classList.add('notification');
  div.dataset.qa = 'notification';

  const isValid =
    nameValue.length >= 4 &&
    ageValue >= 18 &&
    ageValue <= 90 &&
    positionValue.length > 0 &&
    salaryValue.length > 0;

  if (!isValid) {
    div.classList.add('error');
    div.textContent = 'error';
  } else {
    div.classList.add('success');
    div.textContent = 'success';

    const tr = document.createElement('tr');

    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    const td5 = document.createElement('td');

    td1.textContent = nameValue.trim();
    td2.textContent = positionValue.trim();
    td3.textContent = officeValue;
    td4.textContent = Number(ageValue);

    td5.textContent = Number(salaryValue).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    tr.append(td1, td2, td3, td4, td5);

    tbody.append(tr);

    form.reset();
    input1.focus();
  }

  document.body.append(div);
});
