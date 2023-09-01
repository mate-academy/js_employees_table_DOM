'use strict';

const tableBody = document.querySelector('tbody');
const rowsArray = Array.from(document.querySelectorAll('tbody tr'));
const headings = document.querySelectorAll('thead th');

function convertToNumber(string) {
  return parseInt(string.slice(1).replaceAll(',', ''));
}

let columnIndex;
let isAscending = true;

headings.forEach(heading => {
  heading.addEventListener('click', e => {
    const index = e.target.cellIndex;

    if (columnIndex === index) {
      isAscending = !isAscending;
    } else {
      columnIndex = index;
      isAscending = true;
    }

    rowsArray.sort((a, b) => {
      const aText = a.cells[index].textContent;
      const bText = b.cells[index].textContent;
      const callWithA = convertToNumber(aText);
      const callWithB = convertToNumber(bText);

      if (isAscending) {
        if (+aText) {
          return +aText - (+bText);
        } else if (callWithA) {
          return callWithA
          - callWithB;
        } else if (typeof aText === 'string'
        && !callWithA) {
          return aText.localeCompare(bText);
        }
      } else {
        if (+aText) {
          return +bText - (+aText);
        } else if (callWithA) {
          return callWithB
          - callWithA;
        } else if (typeof aText === 'string'
        && !callWithA) {
          return bText.localeCompare(aText);
        }
      }
    });
    tableBody.append(...rowsArray);
  });
});

rowsArray.forEach(row => {
  row.addEventListener('click', () => {
    rowsArray.forEach(tr => {
      tr.classList.remove('active');
    });
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function createInputField(text, tag, type) {
  const element = document.createElement(`${tag}`);

  if (`${tag}` === 'button' || `${tag}` === 'input') {
    element.type = `${type}`;
  }

  if (`${tag}` === 'button') {
    element.textContent = `${text}`;

    return element;
  }

  const label = document.createElement(`label`);

  label.textContent = `${text}`;

  const labelText = label.textContent;
  const textModified = labelText
    .slice(0, labelText.indexOf(':')).toLowerCase();

  element.dataset.qa = textModified;
  element.name = textModified;
  element.required = true;

  if (`${tag}` === 'select') {
    options.forEach(option => {
      const office = document.createElement('option');

      office.value = option;
      office.textContent = option;

      element.appendChild(office);
    });
  }
  label.appendChild(element);

  return label;
}

const nameField = createInputField('Name:', 'input', 'text');
const positionField = createInputField('Position:', 'input', 'text');
const officeField = createInputField('Office:', 'select');
const ageField = createInputField('Age:', 'input', 'number');
const salaryField = createInputField('Salary:', 'input', 'number');
const submitBtn = createInputField('Save to table', 'button', 'submit');

form.appendChild(nameField);
form.appendChild(positionField);
form.appendChild(officeField);
form.appendChild(ageField);
form.appendChild(salaryField);
form.appendChild(submitBtn);

document.body.appendChild(form);

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.classList.add('notification', `${type}`);
  message.dataset.qa = 'notification';

  const messageTitle = document.createElement('h2');

  messageTitle.classList.add('title');
  messageTitle.textContent = `${title}`;
  message.appendChild(messageTitle);

  const messageDescription = document.createElement('p');

  messageDescription.textContent = `${description}`;
  message.appendChild(messageDescription);

  document.body.appendChild(message);
  message.style.top = posTop + 'px';
  message.style.right = posRight + 'px';

  setTimeout(() => {
    message.remove();
  }, 2000);
};

form.addEventListener('submit', e => {
  e.preventDefault();

  const fullName = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = form.elements.age.value;
  const salary = parseInt(form.elements.salary.value);

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary);

  if (fullName.length > 4 && parseInt(age) >= 18) {
    const newEmployee = document.createElement('tr');

    newEmployee.innerHTML = `

  <td>${fullName}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>${formattedSalary}</td>
`;

    rowsArray.push(newEmployee);
    tableBody.appendChild(newEmployee);

    pushNotification(10, 10, 'Title of Success message',
      'Message example.\n '
  + 'Notification should contain title and description.', 'success');
  }

  if (fullName.length < 4 || parseInt(age) < 18) {
    pushNotification(150, 10, 'Title of Error message',
      'Message example.\n '
  + 'Notification should contain title and description.', 'error');
  }
});
