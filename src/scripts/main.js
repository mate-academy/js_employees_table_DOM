'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tbodyTr = document.querySelectorAll('tbody tr');
const body = document.querySelector('body');
const arrayTbodyTr = Array.from(tbody.querySelectorAll('tr'));
const rowBody = Array.from(tbody.rows);
const arryTheadTH = Array.from(thead.querySelectorAll('th'));

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function createLabel(content, inputName, data, type, tegName = 'label') {
  const label = document.createElement(tegName);
  const input = document.createElement('input');

  label.textContent = content;

  input.setAttribute('data-qa', data);
  input.setAttribute('name', inputName);
  input.setAttribute('type', type);
  input.setAttribute('required', '');

  label.appendChild(input);

  return label;
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');

  div.classList = `notification ${type}`;
  div.setAttribute('data-qa', 'notification');

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;

  div.appendChild(h2);
  div.appendChild(p);

  div.style.position = 'absolute';
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const labelName = createLabel('name :', 'name', 'name', 'text');
  const labelPosition = createLabel(
    'Position :',
    'position',
    'position',
    'text',
  );
  const labelAge = createLabel('Age :', 'age', 'age', 'number');
  const labelSalry = createLabel('Salary :', 'salary', 'salary', 'number');
  const Office = document.createElement('label');

  Office.textContent = 'Office :';
  Office.setAttribute('for', 'office');

  const officeSelection = document.createElement('select');

  officeSelection.setAttribute('data-qa', 'office');
  officeSelection.setAttribute('name', 'office');
  officeSelection.setAttribute('type', 'type');
  officeSelection.setAttribute('required', '');

  Office.appendChild(officeSelection);

  cities.forEach((el) => {
    const option = document.createElement('option');

    option.value = el;
    option.textContent = el;
    option.setAttribute('value', el);

    officeSelection.appendChild(option);
  });

  const button = document.createElement('button');

  button.textContent = 'Save to table';

  button.addEventListener('click', (elemForm) => {
    elemForm.preventDefault();

    const names = form.querySelector('[name="name"]').value.trim();
    const position = form.querySelector('[name="position"]').value;
    const offices = form.querySelector('[name="office"]').value;
    const age = form.querySelector('[name="age"]').value;
    const salary = form.querySelector('[name="salary"]').value;

    if (names.length < 4) {
      pushNotification(
        150,
        10,
        'Title of Error message',
        'Message example.\n ' + 'Name must be at least 4 characters long!',
        'error',
      );

      return;
    }

    if (position.length < 4) {
      pushNotification(
        150,
        10,
        'Title of Error message',
        'Message example.\n ' + 'Position cannot be empty.',
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      pushNotification(
        150,
        10,
        'Title of Error message',
        'Message example.\n ' + 'Age must be between 18 and 90!.',
        'error',
      );

      return;
    }

    if (salary < 50) {
      pushNotification(
        150,
        10,
        'Title of Error message',
        'Message example.\n ' + 'The salary cannot be less 50$.',
        'error',
      );

      return;
    }

    const row = document.createElement('tr');
    const formattedSalary = new Intl.NumberFormat('en-US').format(salary);

    row.innerHTML = `
    <td>${names}</td>
    <td>${position}</td>
    <td>${offices}</td>
    <td>${age}</td>
    <td>${`$${formattedSalary}`}</td>
  `;
    tbody.appendChild(row);

    pushNotification(
      10,
      10,
      'Title of Success message',
      'Message example.\n ' + 'Employee successfully added.',
      'success',
    );
  });

  body.appendChild(form);
  form.appendChild(labelName);
  form.appendChild(labelPosition);
  form.appendChild(Office);
  form.appendChild(labelAge);
  form.appendChild(labelSalry);
  form.appendChild(button);
}

createForm();

function classRemove(arr, clasName, targetel) {
  arr
    .filter((el) => el !== targetel)
    .forEach((el) => {
      el.classList.remove(clasName);
    });
}

thead.addEventListener('click', (even) => {
  if (even.target.tagName === 'TH') {
    const columIndex = even.target.cellIndex;

    classRemove(arryTheadTH, 'asc', even.target);

    const asc = even.target.classList.toggle('asc');

    const sort = rowBody.sort((a, b) => {
      const positionA = a.cells[columIndex].textContent.trim();
      const positionB = b.cells[columIndex].textContent.trim();

      return asc
        ? positionA.localeCompare(positionB, undefined, { numeric: true })
        : positionB.localeCompare(positionA, undefined, { numeric: true });
    });

    sort.forEach((el) => tbody.appendChild(el));
  }
});

tbodyTr.forEach((elem) => {
  elem.addEventListener('click', (even) => {
    classRemove(arrayTbodyTr, 'active', even.target);
    even.target.closest('tr').classList.toggle('active');
  });
});

tbody.addEventListener('dblclick', (element) => {
  const cell = element.target;
  const cellText = cell.textContent.trim();

  cell.innerHTML = `<input class='td-cell' value=''>`;

  const tdField = cell.querySelector('.td-cell');

  tdField.focus();

  function saveValue() {
    const newValue = tdField.value.trim();

    if (newValue === '') {
      cell.textContent = cellText;
    } else {
      cell.textContent = newValue;
    }
  }
  tdField.addEventListener('blur', saveValue);

  tdField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveValue();
      tdField.blur();
    }
  });
});
