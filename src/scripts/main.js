'use strict';

const headers = document.querySelectorAll('thead tr');
const rows = document.querySelectorAll('tbody tr');
let rowsArray = Array.from(rows);
let currentSortColumn = -1;
let ascending = true;
let currentRow = -1;

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const index = Array.from(tbody.querySelectorAll('tr')).indexOf(row);

  if (index === -1) {
    return;
  }

  if (currentRow >= 0) {
    rowsArray[currentRow].classList.remove('active');
  }

  if (currentRow === index) {
    currentRow = -1;
  } else {
    row.classList.add('active');
    currentRow = index;
  }
});

function addEmployeeForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const nameLabel = document.createElement('label');

  nameLabel.innerHTML = 'Name: ';

  const nameInput = document.createElement('input');

  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.setAttribute('data-qa', 'name');
  nameInput.required = true;
  nameLabel.appendChild(nameInput);
  form.appendChild(nameLabel);

  const positionLabel = document.createElement('label');

  positionLabel.innerHTML = 'Position: ';

  const positionInput = document.createElement('input');

  positionInput.type = 'text';
  positionInput.name = 'position';
  positionInput.setAttribute('data-qa', 'position');
  positionInput.required = true;
  positionLabel.appendChild(positionInput);
  form.appendChild(positionLabel);

  const officeLabel = document.createElement('label');

  officeLabel.innerHTML = 'Office: ';

  const officeSelect = document.createElement('select');

  officeSelect.name = 'office';
  officeSelect.setAttribute('data-qa', 'office');
  officeSelect.required = true;

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

    option.value = office;
    option.textContent = office;
    officeSelect.appendChild(option);
  });

  officeLabel.appendChild(officeSelect);
  form.appendChild(officeLabel);

  const ageLabel = document.createElement('label');

  ageLabel.innerHTML = 'Age: ';

  const ageInput = document.createElement('input');

  ageInput.type = 'number';
  ageInput.name = 'age';
  ageInput.setAttribute('data-qa', 'age');
  ageInput.required = true;
  ageLabel.appendChild(ageInput);
  form.appendChild(ageLabel);

  const salaryLabel = document.createElement('label');

  salaryLabel.innerHTML = 'Salary: ';

  const salaryInput = document.createElement('input');

  salaryInput.type = 'number';
  salaryInput.name = 'salary';
  salaryInput.setAttribute('data-qa', 'salary');
  salaryInput.required = true;
  salaryLabel.appendChild(salaryInput);
  form.appendChild(salaryLabel);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const employeeName = nameInput.value;
    const position = positionInput.value;
    const office = officeSelect.value;
    const age = parseInt(ageInput.value, 10);
    const salary = parseInt(salaryInput.value, 10);

    if (employeeName.length < 4) {
      pushNotification(
        10,
        10,
        'Invalid Name',
        'Name must be at least 4 characters long.',
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      pushNotification(
        10,
        10,
        'Invalid Age',
        'Age must be between 18 and 90 years.',
        'error',
      );

      return;
    }

    const formattedSalary = '$' + salary.toLocaleString('en-US');

    const newRow = document.createElement('tr');

    const cells = [employeeName, position, office, age, formattedSalary];

    cells.forEach((cellText) => {
      const cell = document.createElement('td');

      cell.textContent = cellText;
      newRow.appendChild(cell);
    });

    tbody.appendChild(newRow);

    rowsArray.push(newRow);

    pushNotification(
      10,
      10,
      'Employee Added Successfully',
      'The new employee has been added to the table.',
      'success',
    );
    form.reset();
  });

  document.body.appendChild(form);
}
addEmployeeForm();

for (const header of headers) {
  header.addEventListener('click', clickHandlerHeader);
}

function clickHandlerHeader(e) {
  const columnIndex = e.target.cellIndex;

  if (currentSortColumn === columnIndex) {
    ascending = !ascending;
  } else {
    ascending = true;
    currentSortColumn = columnIndex;
  }

  sortTable(columnIndex, ascending);
}

function sortTable(columnIndex, sortOrder) {
  let selectedRowContent = null;

  if (currentRow >= 0 && currentRow < rowsArray.length) {
    const selectedRow = rowsArray[currentRow];

    selectedRowContent = Array.from(selectedRow.cells).map(
      (cell) => cell.textContent,
    );
  }

  rowsArray.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex];
    const cellB = rowB.cells[columnIndex];

    const textA = cellA.textContent.trim();
    const textB = cellB.textContent.trim();

    const numA = Number(textA.replace(/[$,]/g, ''));
    const numB = Number(textB.replace(/[$,]/g, ''));

    const isNumA = !isNaN(numA);
    const isNumB = !isNaN(numB);

    let result;

    if (isNumA && isNumB) {
      result = numA - numB;
    } else {
      result = textA.localeCompare(textB);
    }

    return sortOrder ? result : -result;
  });

  tbody.innerHTML = '';

  const fragment = document.createDocumentFragment();

  const newRows = rowsArray.map((row) => {
    const clone = row.cloneNode(true);

    clone.classList.remove('active');

    return clone;
  });

  newRows.forEach((clonedRow) => {
    fragment.appendChild(clonedRow);
  });

  tbody.appendChild(fragment);

  rowsArray = Array.from(document.querySelectorAll('tbody tr'));

  if (selectedRowContent) {
    let newSelectedRowIndex = -1;

    rowsArray.forEach((row, index) => {
      const rowContent = Array.from(row.cells).map((cell) => cell.textContent);
      const contentMatches = selectedRowContent.every(
        (content, i) => content === rowContent[i],
      );

      if (contentMatches) {
        newSelectedRowIndex = index;
      }
    });

    if (newSelectedRowIndex !== -1) {
      rowsArray[newSelectedRowIndex].classList.add('active');
      currentRow = newSelectedRowIndex;
    }
  }
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const body = document.querySelector('body');
  const element = document.createElement('div');

  element.classList.add('notification');
  element.classList.add(type);
  element.setAttribute('data-qa', 'notification');
  element.style.top = posTop + 'px';
  element.style.right = posRight + 'px';

  const titleText = document.createElement('h2');
  const descriptionText = document.createElement('p');

  titleText.classList.add('title');
  titleText.textContent = title;
  descriptionText.textContent = description;
  element.append(titleText);
  element.append(descriptionText);

  body.append(element);

  setTimeout(() => {
    if (element) {
      element.remove();
    }
  }, 2000);
};
