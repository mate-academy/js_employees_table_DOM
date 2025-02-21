'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const stateSort = {
  Name: 1,
  Position: 1,
  Office: 1,
  Age: 1,
  Salary: 1,
};
let attrActive = true;

thead.addEventListener('click', (e) => {
  let allRows = [...tbody.querySelectorAll('tr')];
  const nameClick = e.target.textContent;
  const names = ['Name', 'Position', 'Office', 'Age', 'Salary'];
  const indexName = names.indexOf(nameClick);

  Object.keys(stateSort).forEach((key) => {
    if (key !== nameClick) {
      stateSort[key] = 1;
    }
  });

  if (stateSort[nameClick] === 1) {
    stateSort[nameClick] = -1;

    allRows.sort((td1, td2) => {
      let elem1 = td1.querySelectorAll('td')[indexName].innerText;
      let elem2 = td2.querySelectorAll('td')[indexName].innerText;

      if (['Name', 'Position', 'Office'].includes(nameClick)) {
        return elem1.localeCompare(elem2);
      }

      if (nameClick === 'Age') {
        return parseInt(elem1) - parseInt(elem2);
      }

      if (nameClick === 'Salary') {
        elem1 = parseInt(elem1.replace('$', '').replace(',', ''));
        elem2 = parseInt(elem2.replace('$', '').replace(',', ''));

        return elem1 - elem2;
      }
    });
  } else {
    stateSort[nameClick] = 1;
    allRows = allRows.reverse();
  }

  allRows.forEach((row) => tbody.appendChild(row));
});

tbody.addEventListener('click', (e) => {
  const field = e.target.closest('tr');

  if (attrActive) {
    field.classList.add('active');
    attrActive = false;
  } else if (field.classList.contains('active')) {
    attrActive = true;
    field.classList.remove('active');
  }
});

const form = document.createElement('form');
const selectOffice = `
    <option>Tokio</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
  `;

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" data-qa="name" type="text"></label>
  <label>Position: <input name="position" data-qa="position" type="text"></label>
  <label>Office:
    <select data-qa="office" name="office">
      ${selectOffice}
    </select>
  </label>
  <label>Age: <input name="age" data-qa="age" type="number"></label>
  <label>Salary: <input name="salary" data-qa="salary" type="number"></label>
  <button name="button" type="submit">Save to table</button>
  `;

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameForm = form.querySelector('[data-qa="name"]').value.trim();
  const positionForm = form.querySelector('[data-qa="position"]').value.trim();
  const officeForm = form.querySelector('[data-qa="office"]').value;
  const ageForm = form.querySelector('[data-qa="age"]').value;
  const salaryForm = form.querySelector('[data-qa="salary"]').value;

  if (!nameForm || !positionForm || !ageForm || !salaryForm) {
    getNotification('Empty field', 'Please fill in all fields', 'error');
  } else if (nameForm.length < 4) {
    getNotification(
      'Short name',
      'Name must be longer than 4 characters',
      'error',
    );
  } else if (parseInt(ageForm) < 18 || parseInt(ageForm) > 90) {
    getNotification(
      'Wrong age',
      'Age  must be between 18 and 90 years old',
      'error',
    );
  } else {
    const newPerson = `
      <tr>
        <td>${nameForm}</td>
        <td>${positionForm}</td>
        <td>${officeForm}</td>
        <td>${ageForm}</td>
        <td>${convertSalary(salaryForm)}</td>
      </tr>
    `;

    tbody.innerHTML += newPerson;

    getNotification(
      'Created employee!',
      `Employee ${nameForm} successful created `,
      'success',
    );
  }
});

function getNotification(title, desc, type) {
  const notification = document.createElement('div');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');

  h3.innerText = title;
  p.textContent = desc;
  notification.appendChild(h3);
  notification.appendChild(p);
  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

function convertSalary(num) {
  return '$' + Intl.NumberFormat('en-US').format(num);
}

let isActiveInput = false;

tbody.addEventListener('dblclick', (e) => {
  if (isActiveInput) {
    return;
  }

  const target = e.target;
  const oldValue = e.target.textContent;
  const allFields = target.closest('tr').children;
  const fieldName = allFields[0];
  const fieldOffice = allFields[2];
  const fieldAge = allFields[3];
  const fieldSalary = allFields[4];
  const isFieldName = fieldName === target;
  const isFieldOffice = fieldOffice === target;
  const isFieldAge = fieldAge === target;
  const isFieldSalary = fieldSalary === target;
  let isSaved = false;
  let input;

  if (isFieldOffice) {
    input = document.createElement('select');
    input.innerHTML = selectOffice;
  } else {
    input = document.createElement('input');
    input.setAttribute('type', isFieldAge || isFieldSalary ? 'number' : 'text');
  }

  isActiveInput = true;
  e.target.textContent = '';
  target.appendChild(input);
  input.focus();

  input.addEventListener('keypress', (e2) => {
    const newValue = e2.target.value.trim();

    if (e2.code === 'Enter') {
      if (isFieldAge) {
        if (parseInt(newValue) < 18 || parseInt(newValue) > 90) {
          getNotification(
            'Wrong age',
            'Age  must be between 18 and 90 years old',
            'error',
          );

          return;
        }
      }

      if (isFieldName) {
        if (newValue.length < 4) {
          getNotification(
            'Short name',
            'Name must be longer than 4 characters',
            'error',
          );

          return;
        }
      }

      isSaved = true;
      isActiveInput = false;
      input.remove();

      if (newValue) {
        e.target.textContent = isFieldSalary
          ? convertSalary(parseInt(newValue))
          : newValue;
      } else {
        e.target.textContent = oldValue;
      }
    }
  });

  input.addEventListener('blur', () => {
    if (!isSaved) {
      isActiveInput = false;
      input.remove();
      target.textContent = oldValue;
    }
  });
});
