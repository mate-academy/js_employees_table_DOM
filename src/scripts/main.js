'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Implement sorting table by clicking on headers

  const allHeaders = document.querySelectorAll('thead th');
  const tbody = document.querySelector('tbody');

  let thIndex = null;
  let methodOfSort = 'ASC';

  const columnTypes = ['string', 'string', 'string', 'number', 'number'];

  allHeaders.forEach((th, index) => {
    th.addEventListener('click', () => {
      const rows = [...tbody.querySelectorAll('tr')];

      if (thIndex === index) {
        methodOfSort = methodOfSort === 'ASC' ? 'DESC' : 'ASC';
      } else {
        thIndex = index;
        methodOfSort = 'ASC';
      }

      const type = columnTypes[index];

      rows.sort((tr1, tr2) => {
        let first = tr1.cells[index].textContent.trim();
        let second = tr2.cells[index].textContent.trim();

        if (type === 'number') {
          first = Number(first.replace(/[$,]/g, ''));
          second = Number(second.replace(/[$,]/g, ''));
        }

        if (type === 'string') {
          return methodOfSort === 'ASC'
            ? first.localeCompare(second)
            : second.localeCompare(first);
        } else {
          return methodOfSort === 'ASC' ? first - second : second - first;
        }
      });

      rows.forEach((tr) => tbody.appendChild(tr));
    });
  });

  // Selection by click

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));

    tr.classList.add('active');
  });

  // Creating Form
  const body = document.querySelector('body');
  const form = document.createElement('form');
  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.classList.add('new-employee-form');

  function createInput(labelText, inputName, type, qaAttr) {
    const label = document.createElement('label');

    label.textContent = labelText + ' ';

    const input = document.createElement('input');

    input.setAttribute('name', inputName);
    input.setAttribute('type', type);
    input.setAttribute('data-qa', qaAttr);
    input.required = true;

    label.appendChild(input);

    return label;
  }

  // Creating form elements
  const labName = createInput('Name:', 'name', 'text', 'name');
  const labPosition = createInput('Position:', 'position', 'text', 'position');
  const labAge = createInput('Age:', 'age', 'number', 'age');
  const labSalary = createInput('Salary:', 'salary', 'number', 'salary');

  // Creating select
  const labOffice = document.createElement('label');

  labOffice.textContent = 'Office: ';

  const selectOffice = document.createElement('select');

  selectOffice.setAttribute('name', 'office');
  selectOffice.setAttribute('data-qa', 'office');

  offices.forEach((city) => {
    const option = document.createElement('option');

    option.value = city;
    option.textContent = city;
    selectOffice.appendChild(option);
  });

  labOffice.appendChild(selectOffice);

  // Creating save button
  const saveButton = document.createElement('button');

  saveButton.type = 'submit';
  saveButton.textContent = 'Save to table';

  // Adding all elements to form and adding form to body
  form.append(labName, labPosition, labOffice, labAge, labSalary, saveButton);
  body.appendChild(form);

  // from form to sheet

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const tr = document.createElement('tr');
    const formData = new FormData(form);

    const nameVal = formData.get('name').trim();
    const positionVal = formData.get('position').trim();
    const officeVal = formData.get('office');
    const ageVal = Number(formData.get('age'));
    const salaryVal = Number(formData.get('salary'));

    const fields = [
      nameVal,
      positionVal,
      officeVal,
      ageVal,
      `$${salaryVal.toLocaleString('en-US')}`,
    ];

    if (nameVal.length < 4) {
      return pushNotification(
        'Error!',
        'Name value should be more than 4 symbols',
        'error',
      );
    }

    if (positionVal.length < 2) {
      return pushNotification(
        'Error!',
        'Position value should have at least 2 symbols',
        'error',
      );
    }

    if (isNaN(ageVal) || ageVal < 18 || ageVal > 90) {
      return pushNotification(
        'Error!',
        'Age should be not bigger than 90 and not smaller than 18',
        'error',
      );
    }

    if (isNaN(salaryVal) || salaryVal <= 0) {
      return pushNotification(
        'Error!',
        'Salary must be a valid number (bigger than 0)',
        'error',
      );
    }

    fields.forEach((field) => {
      const td = document.createElement('td');

      td.textContent = field;
      tr.appendChild(td);
    });

    tbody.append(tr);
    form.reset();

    pushNotification('Success!', 'Employee has been added!', 'success');
  });

  // Showing notification

  const pushNotification = (title, description, type) => {
    const notification = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');

    notification.classList.add('notification', type);
    notification.setAttribute('data-qa', 'notification');
    h2.classList.add('title');

    h2.textContent = title;
    p.textContent = description;
    notification.append(h2, p);

    notification.style.position = 'fixed';
    notification.style.top = '480px';
    notification.style.right = '10px';

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.visibility = 'hidden';
    }, 5000);
  };

  // Changing information on DoubleClick

  tbody.addEventListener('dblclick', (e) => {
    const td = e.target.closest('td');

    if (!td) {
      return;
    }

    if (tbody.querySelector('.cell-input')) {
      return;
    }

    const oldText = td.textContent;

    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.type = 'text';
    input.value = oldText;

    td.textContent = '';
    td.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        td.textContent = input.value.trim() || oldText;
      }
    });

    input.addEventListener('blur', () => {
      td.textContent = input.value.trim() || oldText;
    });
  });
});
