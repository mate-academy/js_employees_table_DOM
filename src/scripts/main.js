'use strict';

const table = document.querySelector('table');
const headOfTable = table.tHead;
const bodyOfTable = document.querySelector('tbody');
const headers = headOfTable.querySelectorAll('th');
const body = document.body;
const form = document.createElement('form');
const submitButton = document.createElement('button');

let lastClickedIndex = null;
let sortDirection = 'ASC';

const sortTable = (index) => {
  const rows = Array.from(document.querySelectorAll('tbody tr'));

  if (lastClickedIndex === index) {
    sortDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
  } else {
    sortDirection = 'ASC';
  }

  rows.sort((a, b) => {
    const textA = a.cells[index].innerText.trim();
    const textB = b.cells[index].innerText.trim();

    const extractNumericValue = (text) => {
      return parseFloat(text.replace(/[$,]/g, ''));
    };

    const valueA = extractNumericValue(textA);
    const valueB = extractNumericValue(textB);

    if (!isNaN(valueA) && !isNaN(valueB)) {
      return sortDirection === 'ASC' ? valueA - valueB : valueB - valueA;
    } else {
      return sortDirection === 'ASC'
        ? textA.localeCompare(textB)
        : textB.localeCompare(textA);
    }
  });

  rows.forEach((row) => {
    bodyOfTable.appendChild(row);
  });

  lastClickedIndex = index;
};

const rowSelection = (e) => {
  const clickedElement = e.target.parentElement;

  if (clickedElement.classList.contains('active')) {
    clickedElement.classList.remove('active');
  } else {
    document.querySelectorAll('.active').forEach((el) => {
      el.classList.remove('active');
    });

    clickedElement.classList.add('active');
  }
};

const pushNotification = (title, description, type) => {
  console.log(type);
  const newDiv = document.createElement('div');
  const newHeading = document.createElement('h2');
  const newParagraph = document.createElement('p');

  newDiv.style.position = 'fixed';
  newDiv.style.top = '10px';
  newDiv.style.right = '10px';
  newDiv.style.zIndex = '1000';
  newDiv.setAttribute('data-qa', 'notification');
  newDiv.classList.add('notification', type);

  newHeading.classList.add('title');
  newParagraph.classList.add('description');

  newHeading.textContent = title;
  newParagraph.textContent = description;

  newDiv.appendChild(newHeading);
  newDiv.appendChild(newParagraph);
  body.appendChild(newDiv);

  setTimeout(() => {
    newDiv.style.display = 'none';
  }, 4000);
};

const createFormElement = (labelText, n, type, qaAttribute, options) => {
  const label = document.createElement('label');

  label.innerText = `${labelText}: `;

  if (type === 'select') {
    const select = document.createElement('select');

    select.name = n;
    select.setAttribute('data-qa', qaAttribute);

    options.forEach((optionText) => {
      const option = document.createElement('option');

      option.value = optionText;
      option.innerText = optionText;
      select.appendChild(option);
    });

    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.name = n;
    input.type = type;
    input.setAttribute('data-qa', qaAttribute);
    label.appendChild(input);
  }

  return label;
};

headers.forEach((nav, index) => {
  nav.addEventListener('click', () => sortTable(index));
});

document.querySelector('tbody').addEventListener('click', rowSelection);

form.className = 'new-employee-form';

const fields = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Office',
    name: 'office',
    type: 'select',
    qa: 'office',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    label: 'Age',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

fields.forEach((field) => {
  form.appendChild(
    createFormElement(
      field.label,
      field.name,
      field.type,
      field.qa,
      field.options,
    ),
  );
});

submitButton.type = 'submit';
submitButton.innerText = 'Save to table';

form.appendChild(submitButton);

document.body.appendChild(form);

document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  let error = false;
  let errorMessage = '';

  if (formData.get('name').length < 5) {
    error = true;
    errorMessage = 'Name must be at least 5 characters long.';
  }

  if (
    parseInt(formData.get('age'), 10) > 90 ||
    parseInt(formData.get('age'), 10) < 18
  ) {
    error = true;
    errorMessage = 'Age must be between 18 and 90.';
  }

  if (error) {
    pushNotification('Title of Error message', errorMessage, 'error');
  } else {
    const employee = {
      name: formData.get('name'),
      position: formData.get('position'),
      office: formData.get('office'),
      age: parseInt(formData.get('age'), 10),
      salary: '$' + parseFloat(formData.get('salary')),
    };

    const newRow = document.createElement('tr');

    for (const key in employee) {
      if (employee.hasOwnProperty(key)) {
        const cell = document.createElement('td');

        cell.textContent = employee[key];
        newRow.appendChild(cell);
      }
    }

    bodyOfTable.appendChild(newRow);

    pushNotification('Success', 'New employee added successfully.', 'success');
  }
});
