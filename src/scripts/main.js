'use strict';

const tableHeader = document.querySelector('thead tr');
const tableBody = document.querySelector('tbody');
let temp = null;

tableHeader.addEventListener('click', e => {
  const indexColumn = [...tableHeader.children].findIndex(el =>
    el === e.target
  );

  if (temp !== e.target) {
    const ASC = [...tableBody.children].sort((a, b) => {
      const start = a.children[indexColumn].textContent;
      const end = b.children[indexColumn].textContent;

      if (start.includes('$')) {
        return start.slice(1).replace(',', '') - end.slice(1).replace(',', '');
      }

      if (+start) {
        return start - end;
      }

      return start.localeCompare(end);
    });

    document.querySelector('tbody').append(...ASC);
    temp = e.target;

    return;
  }

  if (temp === e.target) {
    const DESC = [...tableBody.children].sort((a, b) => {
      const start = a.children[indexColumn].textContent;
      const end = b.children[indexColumn].textContent;

      if (start.includes('$')) {
        return end.slice(1).replace(',', '') - start.slice(1).replace(',', '');
      }

      if (+start) {
        return end - start;
      }

      return end.localeCompare(start);
    });

    document.querySelector('tbody').append(...DESC);
    temp = null;
  }
});

let previosTargetRow = null;

document.querySelector('table tbody').addEventListener('click', e => {
  const selectedRow = e.target.closest('tr');

  if (previosTargetRow) {
    previosTargetRow.classList.remove('active');
  }

  if (previosTargetRow === selectedRow) {
    previosTargetRow.classList.remove('active');
    previosTargetRow = null;

    return;
  }

  previosTargetRow = selectedRow;

  selectedRow.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const offices = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];

form.innerHTML = `
  <label>Name:
    <input name="name" type="text" data-qa="name">
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" type="text" data-qa="office">
      <option selected disabled></option>
      ${offices.map(office => `<option>${office}</option>`).join('')}
    </select>
  </label>
  <label>Age:
    <input name="age" type="number" data-qa="age">
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>
  <button type="submit">Save to table</button>
`;

document.querySelector('table').insertAdjacentElement('afterend', form);

form.addEventListener('submit', e => {
  e.preventDefault();

  const newEmployee = document.createElement('tr');
  const data = new FormData(form);
  const formValues = Object.fromEntries(data.entries());

  formValues.salary = `$${(+(formValues.salary)).toLocaleString('en-US')}`;

  const values = [...Object.values(formValues)];

  if (formValues.name.length < 4) {
    return pushNotification(
      450,
      'error',
      'The "Name" must contain more than 4 letters',
      'error'
    );
  }

  if (formValues.position === '') {
    return pushNotification(
      450,
      'error',
      'The "Position" is empty',
      'error'
    );
  }

  if (!formValues.office) {
    return pushNotification(
      450,
      'error',
      'The "Office" is not selected',
      'error'
    );
  }

  if (formValues.age < 18 || formValues.age > 90) {
    return pushNotification(
      450,
      'error',
      'The age must be more than 18 and less than 90',
      'error');
  }

  if (+formValues.salary.slice(1) <= 0) {
    return pushNotification(
      450,
      'error',
      'The "Salary" is empty',
      'error'
    );
  }

  newEmployee.innerHTML = `
    ${values.map(value => `<td>${value}</td>`).join('')}
  `;

  document.querySelector('tbody').append(newEmployee);

  pushNotification(
    10, 'success', 'The data has been added successfully', 'success'
  );
  form.reset();
});

const pushNotification = (
  posTop,
  title,
  description,
  type
) => {
  if (document.body.contains(document.querySelector('.notification'))) {
    document.querySelector('.notification').remove();
  }

  const notification = document.createElement('div');
  const heading = document.createElement('h2');
  const message = document.createElement('p');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  heading.classList.add('title');

  heading.textContent = title;
  message.textContent = description;

  notification.append(heading);
  notification.append(message);
  document.body.append(notification);

  notification.style.top = `${posTop}px`;

  setTimeout(() => {
    notification.remove();
  }, 5000);
};

document.querySelector('table tbody').addEventListener('dblclick', e => {
  if (document.querySelector('.cell-input')) {
    return;
  }

  const selectedCell = e.target.closest('td');
  const textCell = selectedCell.textContent;

  selectedCell.textContent = '';

  const input = document.createElement('input');
  const select = document.createElement('select');

  input.classList.add('cell-input');
  select.classList.add('cell-input');

  selectedCell.append(input);
  input.focus();

  const findIndex = [...e.target.closest('tr').children].findIndex(x =>
    x === e.target.closest('td')
  );

  if (findIndex > 2) {
    input.type = 'number';
  }

  if (findIndex === 2) {
    input.remove();
    selectedCell.append(select);

    select.innerHTML = `
      ${offices.map(office => `<option>${office}</option>`).join('')}
    `;

    select.addEventListener('blur', () => {
      selectedCell.textContent = select.value;
    });

    select.addEventListener('keydown', ev => {
      if (ev.code === 'Enter') {
        select.blur();
      }
    });
  }

  input.addEventListener('blur', () => {
    let text = input.value.trim();

    if (!text) {
      selectedCell.textContent = textCell;

      return;
    }

    if (findIndex === 4) {
      text = `$${(+text).toLocaleString('en-US')}`;
    }

    selectedCell.textContent = text;

    pushNotification(
      10, 'success', 'The data has been successfully changed', 'success'
    );
  });

  input.addEventListener('keydown', ev => {
    if (ev.code === 'Enter') {
      input.blur();

      pushNotification(
        10, 'success', 'The data has been successfully changed', 'success'
      );
    }
  });
});
// for test
