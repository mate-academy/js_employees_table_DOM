'use strict';

// Sort
document.addEventListener('click', (e) => {
  const tH = e.target.closest('th');

  if (!tH) {
    return;
  }

  const table = document.querySelector('table');
  const tBody = table.tBodies[0];

  const columnIndex = tH.cellIndex;

  const rows = [...tBody.rows];

  if (tH.classList.contains('ASC')) {
    rows.sort((rowA, rowB) => {
      let valueA = rowA.cells[columnIndex].textContent;
      let valueB = rowB.cells[columnIndex].textContent;

      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        return valueB.localeCompare(valueA);
      }

      if (columnIndex === 4) {
        valueA = Number(valueA.replaceAll('$', '').replaceAll(',', ''));
        valueB = Number(valueB.replaceAll('$', '').replaceAll(',', ''));

        return valueB - valueA;
      }

      return Number(valueB) - Number(valueA);
    });
    tH.classList.remove('ASC');
    tH.classList.add('DESC');

    for (const row of rows) {
      tBody.appendChild(row);
    }

    return;
  }
  // tH.classList.remove('DESC');
  // tH.classList.add('ASC');

  rows.sort((rowA, rowB) => {
    let valA = rowA.cells[columnIndex].textContent;
    let valB = rowB.cells[columnIndex].textContent;

    if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
      return valA.localeCompare(valB);
    }

    if (columnIndex === 4) {
      valA = Number(valA.replaceAll('$', '').replaceAll(',', ''));
      valB = Number(valB.replaceAll('$', '').replaceAll(',', ''));

      return valA - valB;
    }

    return Number(valA) - Number(valB);
  });

  tH.classList.remove('DESC');
  tH.classList.add('ASC');

  for (const row of rows) {
    tBody.appendChild(row);
  }
});

// Add Active Rows
document.addEventListener('click', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  const row = td.closest('tr');
  const rows = [...document.querySelector('table').rows];

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].classList.contains('active')) {
      rows[i].classList.remove('active');
    }
  }

  row.classList.add('active');
});

function addForm() {
  const body = document.querySelector('body');
  const form = document.createElement('form');
  const nameInput = ['Name', 'Position', 'Office', 'Age', 'Salary'];
  const valueSelect = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.classList.add('new-employee-form');
  body.appendChild(form);

  for (let i = 0; i < nameInput.length; i++) {
    const label = document.createElement('label');
    const input = document.createElement('input');

    if (i === 2) {
      const select = document.createElement('select');

      label.append(nameInput[i] + ': ');
      form.appendChild(label);
      label.append(select);
      select.required = true;
      select.setAttribute('data-qa', 'office');
      select.setAttribute('name', nameInput[i].toLowerCase());

      for (let j = 0; j < valueSelect.length; j++) {
        const option = document.createElement('option');

        option.setAttribute('value', valueSelect[j]);
        option.append(valueSelect[j]);

        select.appendChild(option);
      }
      continue;
    }

    form.appendChild(label);
    label.append(nameInput[i] + ': ');
    label.appendChild(input);

    if (nameInput[i] === 'Age' || nameInput[i] === 'Salary') {
      input.setAttribute('name', nameInput[i].toLowerCase());
      input.setAttribute('type', 'number');
      input.setAttribute('data-qa', nameInput[i].toLowerCase());
      input.required = true;
      continue;
    }

    input.setAttribute('name', nameInput[i].toLowerCase());
    input.setAttribute('type', 'text');
    input.setAttribute('data-qa', nameInput[i].toLowerCase());
    input.required = true;
  }

  const button = document.createElement('button');

  button.textContent = 'Save to table';
  button.setAttribute('type', 'submit');
  form.appendChild(button);
}

function addNewPersonTable() {
  const form = document.querySelector('form');

  form.noValidate = true;
  form.setAttribute('novalidate', '');

  const body = document.querySelector('body');
  const notification = document.createElement('div');
  const title = document.createElement('h2');
  const p = document.createElement('p');

  title.classList.add('title');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (form.elements.name.value.length < 4) {
      notification.className = 'notification';

      notification.classList.add('error');
      body.appendChild(notification);

      title.textContent = 'Error';
      p.textContent = 'Name lenght less 4';
      notification.appendChild(title);
      notification.appendChild(p);

      setTimeout(() => {
        notification.remove();
      }, 1000);

      return;
    }

    if (form.elements.position.value.length === 0) {
      notification.className = 'notification';

      notification.classList.add('error');
      body.appendChild(notification);

      title.textContent = 'Error';
      p.textContent = 'Position is required';

      notification.appendChild(title);
      notification.appendChild(p);

      setTimeout(() => {
        notification.remove();
      }, 1000);

      return;
    }

    if (
      form.elements.age.value.length === 0 ||
      Number(form.elements.age.value) < 18 ||
      Number(form.elements.age.value) > 90
    ) {
      notification.className = 'notification';

      notification.classList.add('error');
      body.appendChild(notification);

      title.textContent = 'Error';
      p.textContent = 'Age less 18 or more 90';
      notification.appendChild(title);
      notification.appendChild(p);

      setTimeout(() => {
        notification.remove();
      }, 1000);

      return;
    }

    if (form.elements.salary.value.length === 0) {
      notification.className = 'notification';

      notification.classList.add('error');
      body.appendChild(notification);

      title.textContent = 'Error';
      p.textContent = 'Salary is required';
      notification.appendChild(title);
      notification.appendChild(p);

      setTimeout(() => {
        notification.remove();
      }, 1000);

      return;
    }

    const nameF = form.elements.name.value;
    const position = form.elements.position.value;
    const office = form.elements.office.value;
    const age = Number(form.elements.age.value);
    let salary = Number(form.elements.salary.value).toLocaleString('en-US');

    salary = '$' + salary;

    const valueForm = [nameF, position, office, age, salary];

    const table = document.querySelector('table');
    const tBody = table.tBodies[0];
    const tr = document.createElement('tr');

    tBody.appendChild(tr);

    for (let j = 0; j < valueForm.length; j++) {
      const td = document.createElement('td');

      td.textContent = valueForm[j];

      tr.appendChild(td);
    }
    notification.className = 'notification';
    notification.classList.add('success');
    body.appendChild(notification);

    title.textContent = 'Success';
    p.textContent = 'Employee added of table';
    notification.appendChild(title);
    notification.appendChild(p);

    setTimeout(() => {
      notification.remove();
    }, 1000);

    form.reset();
  });
}

addForm();
addNewPersonTable();
