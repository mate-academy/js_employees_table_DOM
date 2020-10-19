'use strict';

// notification

const pushNotification = (top, right, title, description, type) => {
  const bodySection = document.querySelector('body');
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  notification.style.top = top;
  notification.style.right = right;

  bodySection.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

// sort table

const table = document.querySelector('table');
const tableHead = [...table.rows[0].cells];
const tableRows = [...table.tBodies[0].rows];

table.addEventListener('click', (event) => {
  if (tableHead.includes(event.target)) {
    const sortString = (a, b) => {
      return a.localeCompare(b);
    };

    const sortAge = (a, b) => {
      return +a - +b;
    };

    const sortSalary = (a, b) => {
      return +(a.replace(/[\s.,$]/g, '')) - +(b.replace(/[\s.,$]/g, ''));
    };

    const selectedRow = event.target.textContent;

    if (selectedRow === 'Name' || selectedRow === 'Position') {
      return sortTable(event.target, sortString);
    }

    if (selectedRow === 'Age') {
      return sortTable(event.target, sortAge);
    }

    if (selectedRow === 'Salary') {
      return sortTable(event.target, sortSalary);
    }
  }
});

function sortTable(columnHeader, compareFunction) {
  const index = tableHead.indexOf(columnHeader);

  const sortedRows = tableRows.sort((a, b) => {
    const columnA = a.querySelectorAll('td')[index].textContent;
    const columnB = b.querySelectorAll('td')[index].textContent;

    return compareFunction(columnA, columnB);
  });

  for (const row of sortedRows) {
    table.tBodies[0].append(row);
  }
}

// choosing row

table.addEventListener('click', (event) => {
  if (!event.target.closest('TR') || event.target.tagName === 'TH') {
    return;
  }

  const selectedRow = event.target.closest('TR');
  const aciveSelect = table.querySelector('.active');

  if (aciveSelect) {
    aciveSelect.classList.remove('active');
  }
  selectedRow.classList.add('active');
});

// new-employee-form

const form = document.createElement('form');
const tBody = table.children[1];

form.classList.add('new-employee-form');

document.body.append(form);

form.innerHTML = `
<label>
Name:
<input
  required
  name="name"
  type="text"
>
</label>
<label>
Position:
<input
  required
  name="position"
  type="text"
>
</label>
<label>
Office:
<select required name="office">
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
</select>
</label>
<label>
Age:
<input
  required
  name="age"
  type="number"
>
</label>
<label>
Salary:
<input
  required
  name="salary"
  type="number"
>
</label>
<button type="submit">Save to table</button>
`;

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (form.children[0].firstElementChild.value.length <= 3) {
    pushNotification(10, 40, 'Invalid name', `
    Please enter valid name`, 'error');

    return;
  }

  const inputAge = form.children[3].firstElementChild.value;
  const inputSalary = form.children[4].firstElementChild.value;

  if (inputAge < 18 || inputAge > 90) {
    pushNotification(10, 40, 'Invalid age', 'Young baby:)', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${form.children[0].firstElementChild.value}</td>
    <td>${form.children[1].firstElementChild.value}</td>
    <td>${form.children[2].firstElementChild.value}</td>
    <td>${form.children[3].firstElementChild.value}</td>
    <td>$${parseInt(inputSalary).toLocaleString()}</td>
  `;

  tBody.append(newRow);

  pushNotification(10, 40, 'Congratulations', `
  Your data has been added`, 'success');
});
