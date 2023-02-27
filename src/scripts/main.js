'use strict';

function numStr(string) {
  return +string.split('$').join('').split(',').join('');
}

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

let ASCsort = null;

function tableSort(column) {
  const sortedRows = Array.from(table.rows)
    .slice(1, table.rows.length - 1);

  if (isNaN(numStr(table.rows[1].children[column].textContent))) {
    sortedRows.sort((a, b) =>
      a.cells[column].innerHTML > b.cells[column].innerHTML ? 1 : -1
    );
  } else {
    sortedRows.sort((a, b) =>
      numStr(a.cells[column].innerHTML)
      < numStr(b.cells[column].innerHTML)
        ? 1
        : -1
    );
  }

  if (ASCsort === column) {
    table.tBodies[0].append(...sortedRows);
    ASCsort = null;
  } else {
    table.tBodies[0].append(...sortedRows.reverse());
    ASCsort = column;
  }
}

[...table.rows[0].children].forEach((column, index) =>
  column.addEventListener('click', e => {
    e.preventDefault();

    tableSort(index);
  }));

tbody.addEventListener('click', (e) => {
  const item = e.target;

  [...tbody.children].forEach(row => row.classList.remove('active'));

  item.closest('tr').className = 'active';
});

const form = document.createElement('form');

form.className = ('new-employee-form');

const labels = ['name', 'position', 'age', 'salary'];

labels.forEach(element => {
  const attribute = element;
  const labelsName = element[0].toUpperCase() + element.slice(1) + ':';

  const label = document.createElement('label');

  label.innerHTML = labelsName;

  const input = document.createElement('input');

  input.setAttribute('data-qa', attribute);
  input.setAttribute('type', 'text');
  input.setAttribute('name', attribute);
  input.id = attribute;
  input.required = true;

  label.append(input);

  return form.append(label);
});

const labelOffice = document.createElement('label');

labelOffice.innerHTML = 'Office:';

const selectOffice = document.createElement('select');

selectOffice.setAttribute('data-qa', 'office');
selectOffice.setAttribute('name', 'office');
selectOffice.required = true;

const officeOptions
  = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

officeOptions.forEach((variable) => {
  const option = document.createElement('option');

  option.innerText = variable;
  option.setAttribute('value', variable);

  selectOffice.append(option);
});

labelOffice.append(selectOffice);
form.insertBefore(labelOffice, form.children[2]);

const button = document.createElement('button');

button.innerText = 'Save to table';
button.setAttribute('type', 'submit');

form.append(button);
document.body.append(form);

const inputAge = document.getElementById('age');
const inputSalary = document.getElementById('salary');

inputAge.setAttribute('type', 'number');
inputSalary.setAttribute('type', 'number');

form.addEventListener(
  'submit',
  (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const toAdd = {
      name: formData.get('name'),
      position: formData.get('position'),
      office: formData.get('office'),
      age: formData.get('age'),
      salary: +formData.get('salary'),
    };

    if (toAdd.name.length < 4) {
      pushNotification(10, 10, 'Check the correctness of the entered data',
        'The name field must have more than 4 letters.', 'error');
    } else if (toAdd.age < 18 || toAdd.age > 90) {
      pushNotification(10, 10, 'Check the correctness of the entered data',
        'Your age must be more than 18 and less than 90', 'error');
    } else if (toAdd.salary <= 0) {
      pushNotification(10, 10, 'Check the correctness of the entered data',
        'Your salary must be more than 0', 'error');
    } else {
      tbody.insertAdjacentHTML('beforeend',
        `<tr>
          <td>${toAdd.name}</td>
          <td>${toAdd.position}</td>
          <td>${toAdd.office}</td>
          <td>${toAdd.age}</td>
          <td>${'$' + toAdd.salary.toLocaleString('en')}</td>
        </tr>`);

      e.target.reset();

      pushNotification(10, 10, 'Successfully!',
        'The employee has been added to the table!', 'success');
    }
  }
);

const pushNotification = (posTop, posRight, title, description, type) => {
  const notificationContainer = document.createElement('div');

  notificationContainer.classList.add('container');

  notificationContainer.style.cssText = `
    top: ${posTop}px;
    right: ${posRight}px;
    position : absolute;`;

  const notification = document.createElement('div');

  notification.classList.add('notification', type);

  notification.style.cssText = `
  position: static;
  border: 1px solid transparent;
  margin-top: 10px;`;

  const titleOfNotification = document.createElement('h2');

  titleOfNotification.classList.add('title');
  titleOfNotification.textContent = title;

  const message = document.createElement('p');

  message.textContent = description;

  notification.append(titleOfNotification, message);

  const container = document.querySelector('.container');

  if (!container) {
    document.body.append(notificationContainer);
  }

  document.querySelector('.container').prepend(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
};
