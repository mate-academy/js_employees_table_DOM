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
  // element.required = true;

  if (`${tag}` === 'select') {
    for (const option of options) {
      const office = document.createElement('option');

      office.value = option.toLowerCase();
      office.textContent = option;

      element.appendChild(office);
    }
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

submitBtn.addEventListener('click', () => {
  const fullName = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = parseInt(form.elements.age.value);
  const salary = parseFloat(form.elements.salary.value);

  const row = document.createElement('tr');

  row.innerHTML = `

  <td>${fullName}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>${salary}</td>
`;

  tableBody.appendChild(row);
});
