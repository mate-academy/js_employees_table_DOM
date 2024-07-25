const body = document.querySelector('body');
const headers = document.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');
const sortOrder = Array.from(headers, () => true);
const selectedRows = document.querySelectorAll('tbody tr');

// sorting table
headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sort(index, sortOrder[index]);
    sortOrder[index] = !sortOrder[index];
  });
});

function sort(index, ascending) {
  const rows = Array.from(document.querySelectorAll('tbody tr'));

  const rowData = rows.map((row) => {
    return Array.from(row.cells).map((cell) => cell.textContent);
  });

  const isNumericColumn = index === 4;

  rowData.sort((a, b) => {
    let aValue = a[index];
    let bValue = b[index];

    if (isNumericColumn) {
      aValue = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
      bValue = parseFloat(bValue.replace(/[^0-9.-]/g, ''));
    }

    if (ascending) {
      if (isNumericColumn) {
        return aValue - bValue;
      } else {
        return aValue.localeCompare(bValue);
      }
    } else {
      if (isNumericColumn) {
        return bValue - aValue;
      } else {
        return bValue.localeCompare(aValue);
      }
    }
  });

  rows.forEach((row, rowIndex) => {
    row.innerHTML = rowData[rowIndex]
      .map((cellData) => `<td>${cellData}</td>`)
      .join('');
  });
}

// setting sctive row selection
selectedRows.forEach((row) => {
  row.addEventListener('click', () => {
    if (row.classList.contains('active')) {
      selectedRows.forEach((item) => {
        item.classList.remove('active');
      });
    } else {
      selectedRows.forEach((item) => {
        item.classList.remove('active');
      });
      row.classList.add('active');
    }
  });
});

// creating and appending form
const form = document.createElement('form');

form.classList.add('new-employee-form');

const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelOffice = document.createElement('label');
const labelAge = document.createElement('label');
const labelSalary = document.createElement('label');

labelName.textContent = 'Name: ';
labelPosition.textContent = 'Position: ';
labelOffice.textContent = 'Office: ';
labelAge.textContent = 'Age: ';
labelSalary.textContent = 'Salary: ';

const inputName = document.createElement('input');

inputName.setAttribute('name', 'name');
inputName.setAttribute('type', 'text');
inputName.setAttribute('data-qa', 'name');

const inputPosition = document.createElement('input');

inputPosition.setAttribute('name', 'position');
inputPosition.setAttribute('type', 'text');
inputPosition.setAttribute('data-qa', 'position');

const select = document.createElement('select');

select.setAttribute('data-qa', 'office');

const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

selectOptions.forEach((optionName) => {
  const option = document.createElement('option');

  option.textContent = optionName;
  option.setAttribute('value', optionName.toLowerCase());
  select.appendChild(option);
});

const inputAge = document.createElement('input');

inputAge.setAttribute('name', 'age');
inputAge.setAttribute('type', 'number');
inputAge.setAttribute('data-qa', 'age');

const inputSalary = document.createElement('input');

inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'text');
inputSalary.setAttribute('data-qa', 'salary');

labelName.appendChild(inputName);
labelPosition.appendChild(inputPosition);
labelOffice.appendChild(select);
labelAge.appendChild(inputAge);
labelSalary.appendChild(inputSalary);

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';

form.appendChild(labelName);
form.appendChild(labelPosition);
form.appendChild(labelOffice);
form.appendChild(labelAge);
form.appendChild(labelSalary);
form.appendChild(button);

body.append(form);

// creating notifications
const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const titleEl = document.createElement('h2');
  const descriptionEl = document.createElement('p');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  titleEl.className = 'title';
  titleEl.textContent = title;

  descriptionEl.textContent = description;

  notification.append(titleEl);
  notification.append(descriptionEl);
  document.documentElement.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

// validation and addition persons
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (inputName.value.length < 4 || inputPosition.value.length < 4) {
    pushNotification(
      'Error!',
      'Name must be at least 4 letters long!',
      'error',
    );
  } else if (inputAge.value < 18 || inputAge.value > 90) {
    pushNotification('Error!', 'Age must be between 18 and 90!', 'error');
  } else {
    const newRow = document.createElement('tr');
    const cellName = document.createElement('td');
    const cellPosition = document.createElement('td');
    const cellOffice = document.createElement('td');
    const cellAge = document.createElement('td');
    const cellSalary = document.createElement('td');

    cellName.textContent = inputName.value;
    cellPosition.textContent = inputPosition.value;

    cellOffice.textContent = select.options[select.selectedIndex].text;
    cellAge.textContent = inputAge.value;

    const formattedSalary = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(inputSalary.value);

    cellSalary.textContent = formattedSalary;

    newRow.appendChild(cellName);
    newRow.appendChild(cellPosition);
    newRow.appendChild(cellOffice);
    newRow.appendChild(cellAge);
    newRow.appendChild(cellSalary);
    tbody.appendChild(newRow);

    inputName.value = '';
    inputPosition.value = '';
    select.selectedIndex = 0;
    inputAge.value = '';
    inputSalary.value = '';

    pushNotification('Success!', 'Employee added successfully!', 'success');
  }
});
