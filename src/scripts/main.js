'use strict';

const table = document.querySelector('table');

if (table) {
  const headers = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  let rows = [...tbody.querySelectorAll('tr')];
  let editing = null;

  if (headers && rows) {
    let previousKey = null;
    let asc = 1;

    headers.addEventListener('click', (ev) => {
      const key = ev.target.closest('th');

      if (key) {
        const colNumber = [...headers.firstElementChild.children].indexOf(key);

        if (previousKey === key && asc === 1) {
          asc = -1;
        } else {
          previousKey = key;
          asc = 1;
        }

        if (['Salary', 'Age'].includes(key.textContent)) {
          rows.sort((a, b) => compareRowsByNumbers(a, b, colNumber, asc));
        } else {
          rows.sort((a, b) => compareRowsByStrings(a, b, colNumber, asc));
        }

        table.querySelector('tbody').replaceChildren(...rows);
      }
    });

    tbody.addEventListener('click', (ev) => {
      const selectedRow = ev.target.closest('tr');

      const active = tbody.querySelector('.active');

      if (active) {
        active.removeAttribute('class');
      }

      if (selectedRow) {
        selectedRow.className = 'active';
      }
    });

    tbody.addEventListener('dblclick', (ev) => {
      if (!editing) {
        editing = ev.target.closest('td');

        const prevValue = editing.textContent;
        const input = document.createElement('input');

        editing.textContent = '';
        editing.insertAdjacentElement('afterbegin', input);
        input.className = 'cell-input';
        input.focus();
        input.value = prevValue;

        input.addEventListener('blur', () => {
          editing.textContent = input.value || prevValue;
          editing = null;
          input.remove();
        });

        input.addEventListener('keypress', (eventKey) => {
          if (eventKey.key === 'Enter') {
            input.blur();
          }
        });
      }
    });
  }

  const form = createForm();

  table.insertAdjacentElement('afterend', form);

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const empl = getEmployee(form);

    if (empl) {
      const notification = validEmployee(empl);

      document.body.insertAdjacentElement('afterbegin', notification);
      setTimeout(() => notification.remove(), 2000);

      if (notification.className.includes('success')) {
        addEmployee(tbody, empl);
        rows = [...tbody.querySelectorAll('tr')];
      }
    }
  });
}

function parseCellToNumber(row, index) {
  const digits = row.children[index].textContent.match(/\d+/g);

  if (digits && digits.length > 0) {
    return parseInt(digits.join(''));
  }

  return 0;
}

function compareRowsByNumbers(a, b, index, asc) {
  return asc * (parseCellToNumber(a, index) - parseCellToNumber(b, index));
}

function compareRowsByStrings(a, b, index, asc) {
  return (
    asc *
    a.children[index].textContent.localeCompare(b.children[index].textContent)
  );
}

function createForm() {
  const valuesForSelect = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];
  const fields = {
    Name: 'text',
    Position: 'text',
    Office: 'select',
    Age: 'number',
    Salary: 'number',
  };
  const newForm = document.createElement('form');

  newForm.className = 'new-employee-form';

  for (const field in fields) {
    createFormField(
      newForm,
      field,
      fields[field],
      field === 'Office' ? valuesForSelect : undefined,
    );
  }
  createButtonForm(newForm, 'Save to table', 'submit');

  return newForm;
}

function createFormField(form, nameField, type, selectedValues) {
  const labelField = document.createElement('label');
  const tagName = type !== 'select' ? 'input' : type;
  const inputField = document.createElement(tagName);

  inputField.id = nameField.toLowerCase();
  inputField.setAttribute('data-qa', nameField.toLowerCase());

  labelField.textContent = nameField + ': ';
  labelField.htmlFor = inputField.id;

  if (type === 'select') {
    for (const item of selectedValues) {
      const option = document.createElement('option');

      option.value = item;
      option.textContent = item;
      inputField.insertAdjacentElement('beforeend', option);
    }
  } else {
    inputField.type = type;
  }

  inputField.setAttribute('required', '');
  labelField.insertAdjacentElement('beforeend', inputField);
  form.insertAdjacentElement('beforeend', labelField);
}

function createButtonForm(form, nameButton, type) {
  const button = document.createElement('button');

  button.type = type;
  button.textContent = nameButton;

  form.insertAdjacentElement('beforeend', button);
}

function getEmployee(form) {
  const values = form.elements;

  for (let i = 0; i < 5; i++) {
    if (!values[i].value) {
      return false;
    }
  }

  return {
    name: values.name.value,
    position: values.position.value,
    office: values.office.value,
    age: values.age.value,
    salary: values.salary.value,
  };
}

function validEmployee(employee) {
  const notification = document.createElement('div');
  const title = document.createElement('h2');
  const descriptionText = document.createElement('p');
  const age = parseInt(employee.age);
  const titles = ['Success', 'Name format wrong', 'Age value wrong'];
  const messages = [
    'Employee added successfully',
    'Name should be more length then 4',
    'Age should be more then 18 and less then 90',
  ];

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');
  title.className = 'title';

  notification.insertAdjacentElement('beforeend', descriptionText);
  notification.insertAdjacentElement('afterbegin', title);

  if (employee.name.length < 4) {
    setValuesToNotification(
      notification,
      'error',
      title,
      descriptionText,
      titles,
      messages,
      1,
    );
  }

  if (age < 18 || age > 90) {
    setValuesToNotification(
      notification,
      'error',
      title,
      descriptionText,
      titles,
      messages,
      2,
    );
  }

  if (!notification.className.includes('error')) {
    setValuesToNotification(
      notification,
      'success',
      title,
      descriptionText,
      titles,
      messages,
      0,
    );
  }

  return notification;
}

function setValuesToNotification(
  notification,
  statusNot,
  title,
  text,
  dataTitle,
  dataText,
  index,
) {
  notification.classList.add(statusNot);
  title.textContent = dataTitle[index];
  text.textContent = dataText[index];
}

function addEmployee(tbody, employee) {
  const employeeRow = document.createElement('tr');

  for (const field in employee) {
    const cell = document.createElement('td');

    cell.textContent =
      field !== 'salary' ? employee[field] : parseSalary(employee[field]);
    employeeRow.insertAdjacentElement('beforeend', cell);
  }

  tbody.insertAdjacentElement('beforeend', employeeRow);
}

function parseSalary(value) {
  if (value.length <= 3) {
    return '$' + value;
  }

  let count = Math.floor(value.length / 3);
  const digits = value.split('');

  if (value.length % 3 === 0) {
    count--;
  }

  for (let i = digits.length - 4; count > 0; count--) {
    digits[i] += ',';
    i -= 3;
  }

  return '$' + digits.join('');
}
