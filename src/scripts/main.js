'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

thead.addEventListener('click', (e) => {
  const target = e.target;

  if (target.tagName === 'TH') {
    const index = target.cellIndex;

    sortTable(index);
  }
});

function sortTable(indexColumn) {
  const column = indexColumn;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    if (column === 4) {
      const aValue = a.cells[column].innerText.replace(/[$,]/g, '');
      const bValue = b.cells[column].innerText.replace(/[$,]/g, '');

      return aValue - bValue;
    }

    if (column === 3) {
      return a.cells[column].innerText - b.cells[column].innerText;
    }

    const aText = a.cells[column].innerText.toLowerCase();
    const bText = b.cells[column].innerText.toLowerCase();

    return aText.localeCompare(bText);
  });

  rows.forEach((row) => tbody.appendChild(row));
}

const newForm = document.createElement('form');
const body = document.querySelector('body');

body.appendChild(newForm);
newForm.setAttribute('class', 'new-employee-form');

function makeLabel(newName) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  if (newName === 'Office') {
    const select = document.createElement('select');
    const offices = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    offices.forEach((office) => {
      const option = document.createElement('option');

      option.textContent = office;
      select.appendChild(option);
    });

    newForm.appendChild(label);
    label.textContent = `${newName}:`;
    label.append(select);
    select.setAttribute('name', 'name');
    select.setAttribute('data-qa', newName.toLowerCase());

    newForm.appendChild(label);
  } else if (newName === 'Salary' || newName === 'Age') {
    newForm.appendChild(label);
    label.textContent = `${newName}:`;
    label.append(input);
    input.setAttribute('name', 'name');
    input.setAttribute('type', 'number');
    input.setAttribute('data-qa', newName.toLowerCase());

    newForm.appendChild(label);
  } else {
    newForm.appendChild(label);
    label.textContent = `${newName}:`;
    label.append(input);
    input.setAttribute('name', 'name');
    input.setAttribute('type', 'text');
    input.setAttribute('data-qa', newName.toLowerCase());

    newForm.appendChild(label);
  }
}

function createButton() {
  const button = document.createElement('button');

  button.setAttribute('type', 'button');
  button.textContent = 'Save to table';

  newForm.appendChild(button);
}

makeLabel('Name');
makeLabel('Position');
makeLabel('Office');
makeLabel('Age');
makeLabel('Salary');
createButton();

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  const h2Element = document.createElement('h2');

  h2Element.classList.add('title');
  h2Element.textContent = title;

  const pElement = document.createElement('p');

  pElement.innerText = description;
  notification.appendChild(h2Element);
  notification.appendChild(pElement);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.visibility = 'hidden';

    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 2000);
};

pushNotification(
  10,
  10,
  'Title of Success message',
  'Message example.\n ' + 'Notification should contain title and description.',
  'success',
);

pushNotification(
  150,
  10,
  'Title of Error message',
  'Message example.\n ' + 'Notification should contain title and description.',
  'error',
);

pushNotification(
  290,
  10,
  'Title of Warning message',
  'Message example.\n ' + 'Notification should contain title and description.',
  'warning',
);
