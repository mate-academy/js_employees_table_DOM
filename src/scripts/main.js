'use strict';

const table = document.querySelector('table');

const tableBody = table.children[1];
const tableBodyRows = tableBody.children;
const tableHeadRow = table.firstElementChild.firstElementChild;

const getNumber = (row) => {
  return +row.lastElementChild.textContent.slice(1).replace(',', '');
};

let sortParam = '';

tableHeadRow.addEventListener('click', (e) => {
  const title = e.target.textContent;

  const rows = [...tableBodyRows];

  const cases = {
    name: 'Name',
    position: 'Position',
    office: 'Office',
    age: 'Age',
    salary: 'Salary',
  };

  switch (title) {
    case cases.name:
    case cases.position:
    case cases.office:
      if (title === sortParam) {
        rows.reverse();
        sortParam = '';

        break;
      }

      rows.sort((row1, row2) => {
        let childNumber = 0;

        if (title === cases.position) {
          childNumber = 1;
        } else if (title === cases.office) {
          childNumber = 2;
        }

        return row1.children[childNumber].textContent.localeCompare(
          row2.children[childNumber].textContent
        );
      });

      sortParam = title;

      break;

    case cases.age:
    case cases.salary:
      if (title === sortParam) {
        rows.reverse();
        sortParam = '';

        break;
      }

      (title === cases.age)
        ? rows.sort((row1, row2) => (
          +row1.children[3].textContent - +row2.children[3].textContent
        ))
        : rows.sort((row1, row2) => getNumber(row1) - getNumber(row2));

      sortParam = title;

      break;

    default:
      break;
  }

  rows.forEach(row => tableBody.append(row));
});

tableBody.addEventListener('click', (e) => {
  const targetRow = e.target.closest('TR');

  const oldActiveRow = document.querySelector('tr.active');

  if (oldActiveRow) {
    oldActiveRow.classList.remove('active');
  }

  if (targetRow) {
    targetRow.classList.add('active');
  }
});

const form = document.createElement('form');

form.className = 'new-employee-form';

document.body.append(form);

form.innerHTML = `
  <label>Name: <input name="name" type="text" required></label>
  <label>Position: <input name="position" type="text" required></label>
  <label>Office: <select name="office" required></select></label>
  <label>
    Age:
    <input
      name="age"
      type="number"
      required
    >
  </label>
  <label>
    Salary:
    <input
      name="salary"
      type="number"
      step="25"
      min="30000"
      required
    >
  </label>
`;

const labels = [...form.children];

labels.forEach(child => {
  child.firstElementChild.dataset.qe = child.firstElementChild.name;
});

const select = document.querySelector('select');

const optionValues = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

optionValues.forEach(optionValue => {
  const option = document.createElement('option');

  option.value = optionValue;
  option.innerText = optionValue;

  select.append(option);
});

const notificationText = {
  title: '',
  description: '',
};

const errorEvent = new CustomEvent('loadError', {
  detail: notificationText,
});
const successEvent = new CustomEvent('success', {
  detail: notificationText,
});

const sendButton = document.createElement('button');

sendButton.innerText = 'Save to table';

form.append(sendButton);

sendButton.addEventListener('click', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (data.get('name').length < 4) {
    errorEvent.detail.title = 'Error';
    errorEvent.detail.description = 'Your entered name is so small';

    notification.dispatchEvent(errorEvent);

    return;
  }

  if (+data.get('age') < 18 || +data.get('age') > 90) {
    errorEvent.detail.title = 'Error';
    errorEvent.detail.description = 'Your age is not valid';
    notification.dispatchEvent(errorEvent);

    return;
  }

  errorEvent.detail.title = 'Done';
  errorEvent.detail.description = 'Your data successfully added';
  notification.dispatchEvent(successEvent);

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${data.get('name')}</td>
    <td>${data.get('position')}</td>
    <td>${data.get('office')}</td>
    <td>${data.get('age')}</td>
    <td>$${(+data.get('salary')).toLocaleString('en-US')}</td>
  `;

  tableBody.append(row);
});

const notification = document.createElement('div');

notification.className = 'notification';

notification.dataset.qe = 'notification';

notification.innerHTML = `
  <h2 class="title"></h2>
  <p></p>
`;

notification.addEventListener('loadError', (e) => {
  document.body.append(notification);

  notification.classList.add('error');
  notification.firstElementChild.innerText = errorEvent.detail.title;
  notification.lastElementChild.innerText = errorEvent.detail.description;

  setTimeout(() => {
    document.body.removeChild(notification);
    notification.classList.remove('error');
  }, 2000);
});

notification.addEventListener('success', (e) => {
  document.body.append(notification);

  notification.classList.add('success');
  notification.firstElementChild.innerText = successEvent.detail.title;
  notification.lastElementChild.innerText = successEvent.detail.description;

  setTimeout(() => {
    document.body.removeChild(notification);
    notification.classList.remove('success');
  }, 2000);
});

tableBody.addEventListener('dblclick', (e) => {
  const targetCell = e.target.closest('td');

  const prevValue = targetCell.innerText;

  targetCell.innerHTML = `<input
    type="text"
    class="cell-input"
  >`;

  const input = targetCell.children[0];

  input.focus();
  input.value = prevValue;

  if (prevValue[0] === '$') {
    input.value = prevValue.slice(1).replace(',', '');
  }

  const saveValue = () => {
    let newValue = input.value;

    if (prevValue[0] === '$') {
      newValue = `$${(+newValue).toLocaleString('en-US')}`;
    }

    targetCell.innerText = newValue ? `${newValue}` : prevValue;
  };

  input.addEventListener('blur', () => {
    saveValue();
  });

  input.addEventListener('keypress', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      saveValue();
    }
  });
});
