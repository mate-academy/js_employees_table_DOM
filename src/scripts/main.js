'use strict';

const thead = document.querySelector('thead');
const th = thead.querySelectorAll('th');

let lastSortedColumnIndex = null;
let sortDirection = 'asc';

thead.addEventListener('click', (even) => {
  const target = even.target;

  if (even.target.tagName !== 'TH') {
    return;
  }

  const index = Array.from(th).indexOf(target);
  const rowsArr = Array.from(document.querySelector('tbody').rows);

  if (index === lastSortedColumnIndex) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortDirection = 'asc';
  }

  rowsArr.sort((a, b) => {
    const aInfo = a.children[index].textContent;
    const bInfo = b.children[index].textContent;

    const aClean = aInfo.replace(/\$|,/g, '');
    const bClean = bInfo.replace(/\$|,/g, '');

    if (!isNaN(Number(aClean)) && !isNaN(Number(bClean))) {
      if (sortDirection === 'asc') {
        return aClean - bClean;
      } else {
        return bClean - aClean;
      }
    } else {
      if (sortDirection === 'asc') {
        return aClean.localeCompare(bClean);
      } else {
        return bClean.localeCompare(aClean);
      }
    }
  });

  lastSortedColumnIndex = index;

  const tbody = document.querySelector('tbody');

  tbody.innerHTML = '';
  rowsArr.forEach((row) => tbody.appendChild(row));
});

const rows = document.querySelectorAll('tbody tr');

rows.forEach((row) => {
  row.addEventListener('click', function () {
    rows.forEach((r) => r.classList.remove('active'));

    this.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const labelName = document.createElement('label');

labelName.textContent = 'Name:';

const inputName = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');
inputName.required = true;

const labelAge = document.createElement('label');

labelAge.textContent = 'Age:';

const inputAge = document.createElement('input');

inputAge.name = 'age';
inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'age');
inputAge.required = true;

const labelPosition = document.createElement('label');

labelPosition.textContent = 'Position:';

const inputPosition = document.createElement('input');

inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.setAttribute('data-qa', 'position');
inputPosition.required = true;

const labelSalary = document.createElement('label');

labelSalary.textContent = 'Salary:';

const inputSalary = document.createElement('input');

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.required = true;

const labelOffice = document.createElement('label');

labelOffice.textContent = 'Office:';

const select = document.createElement('select');

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

cities.forEach((city) => {
  const option = document.createElement('option');

  option.textContent = city;
  select.appendChild(option);
});

select.setAttribute('data-qa', 'office');

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

labelName.appendChild(inputName);
form.appendChild(labelName);
labelPosition.appendChild(inputPosition);
form.appendChild(labelPosition);
labelOffice.appendChild(select);
form.appendChild(labelOffice);
labelAge.appendChild(inputAge);
form.appendChild(labelAge);
labelSalary.appendChild(inputSalary);
form.appendChild(labelSalary);
form.appendChild(button);
document.body.appendChild(form);

const pushNotification = (type, title, description) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');

  notification.classList.add('notification', type);

  const heading = document.createElement('h2');

  heading.className = 'title';
  heading.textContent = title;

  const text = document.createElement('p');

  text.textContent = description;

  notification.appendChild(heading);
  notification.appendChild(text);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

form.addEventListener('submit', (sendForm) => {
  sendForm.preventDefault();

  const valueName = inputName.value;
  const valueAge = inputAge.value;
  const valueSalary = inputSalary.value;
  const valuePosition = inputPosition.value;
  const valueOffice = select.value;

  if (valuePosition.trim().length < 1) {
    pushNotification(
      'error',
      'Position field is required',
      'Please enter a valid position',
    );

    return;
  }

  if (
    valueName.length >= 4 &&
    valueAge >= 18 &&
    valueAge <= 90 &&
    valueSalary !== undefined &&
    valuePosition.trim().length >= 1 &&
    valueOffice !== undefined
  ) {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdAge = document.createElement('td');
    const tdSalary = document.createElement('td');
    const tdPosition = document.createElement('td');
    const tdOffice = document.createElement('td');
    const tbody = document.querySelector('tbody');

    tdName.textContent = valueName;
    tdPosition.textContent = valuePosition;
    tdOffice.textContent = valueOffice;
    tdAge.textContent = valueAge;
    tdSalary.textContent = `$${Number(valueSalary).toLocaleString()}`;

    tr.appendChild(tdName);
    tr.appendChild(tdPosition);
    tr.appendChild(tdOffice);
    tr.appendChild(tdAge);
    tr.appendChild(tdSalary);
    tbody.appendChild(tr);

    pushNotification(
      'success',
      'Employee added',
      'The new employee was added to the table.',
    );

    tr.addEventListener('click', function () {
      document
        .querySelectorAll('tbody tr')
        .forEach((r) => r.classList.remove('active'));
      this.classList.add('active');
    });
  } else {
    pushNotification('error', 'Error', 'Please check the form fields');
  }
});

const tbodyDbl = document.querySelector('tbody');
let activeInput = null;

tbodyDbl.addEventListener('dblclick', (remove) => {
  if (remove.target.tagName === 'TD') {
    if (activeInput !== null) {
      return;
    }

    const td = remove.target;
    let initialValue = td.textContent;

    td.textContent = '';

    const input = document.createElement('input');

    input.classList.add('cell-input');
    td.appendChild(input);
    activeInput = input;
    input.focus();

    input.value = initialValue;

    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        td.textContent = initialValue;
      } else {
        initialValue = input.value.trim();
      }

      input.innerHTML = '';
      td.textContent = initialValue;
      activeInput = null;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  }
});
