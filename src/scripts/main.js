'use strict';

'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const keys = ['name', 'position', 'office', 'age', 'salary'];
const data = Array.from(tbody.rows).map((row) => {
  const cells = Array.from(row.cells);
  const object = {};

  cells.forEach((cell, index) => {
    object[keys[index]] = cell.textContent;
  });

  return object;
});

function getSorted() {
  tbody.innerHTML = '';

  data.forEach((row) => {
    const tr = document.createElement('tr');

    Object.values(row).forEach((cellContent) => {
      const td = document.createElement('td');

      td.textContent = cellContent;
      tr.appendChild(td);
    });
    tbody.append(tr);
  });
}

const sortOrder = {
  name: true,
  position: true,
  office: true,
  age: true,
  salary: true,
};

table.addEventListener('click', (e) => {
  if (e.target === table.tHead.rows[0].cells[0]) {
    data.sort((a, b) => {
      return sortOrder.name
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    sortOrder.name = !sortOrder.name;
    getSorted();
  }

  if (e.target === table.tHead.rows[0].cells[1]) {
    data.sort((a, b) => {
      return sortOrder.position
        ? a.position.localeCompare(b.position)
        : b.position.localeCompare(a.position);
    });
    sortOrder.position = !sortOrder.position;
    getSorted();
  }

  if (e.target === table.tHead.rows[0].cells[2]) {
    data.sort((a, b) => {
      return sortOrder.office
        ? a.office.localeCompare(b.office)
        : b.office.localeCompare(a.office);
    });
    sortOrder.office = !sortOrder.office;
    getSorted();
  }

  if (e.target === table.tHead.rows[0].cells[3]) {
    data.sort((a, b) => (sortOrder.age ? a.age - b.age : b.age - a.age));
    sortOrder.age = !sortOrder.age;
    getSorted();
  }

  if (e.target === table.tHead.rows[0].cells[4]) {
    data.sort((a, b) => {
      return sortOrder.salary
        ? +a.salary.replace(/[$,]/g, '') - +b.salary.replace(/[$,]/g, '')
        : +b.salary.replace(/[$,]/g, '') - +a.salary.replace(/[$,]/g, '');
    });
    sortOrder.salary = !sortOrder.salary;
    getSorted();
  }
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((row) => {
    row.classList.remove('active');
  });

  clickedRow.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const inputName = document.createElement('input');
const labelName = document.createElement('label');

inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');
inputName.setAttribute('required', '');
labelName.textContent = 'Name:';
labelName.appendChild(inputName);
form.append(labelName);

const inputPosition = document.createElement('input');
const labelPosition = document.createElement('label');

inputPosition.type = 'text';
inputPosition.setAttribute('data-qa', 'position');
inputPosition.setAttribute('required', '');
labelPosition.textContent = 'Position:';
labelPosition.appendChild(inputPosition);
form.append(labelPosition);

const inputOffice = document.createElement('select');
const labelOffice = document.createElement('label');

inputOffice.setAttribute('data-qa', 'office');
inputOffice.setAttribute('required', '');
labelOffice.textContent = 'Office:';

const select = [
  { value: 'Tokyo', text: 'Tokyo' },
  { value: 'Singapore', text: 'Singapore' },
  { value: 'London', text: 'London' },
  { value: 'New York', text: 'New York' },
  { value: 'Edinburgh', text: 'Edinburgh' },
  { value: 'San Francisco', text: 'San Francisco' },
];

select.forEach((selectData) => {
  const option = document.createElement('option');

  option.value = selectData.value;
  option.textContent = selectData.text;
  inputOffice.append(option);
});

labelOffice.appendChild(inputOffice);
form.append(labelOffice);

const inputAge = document.createElement('input');
const labelAge = document.createElement('label');

inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'age');
inputAge.setAttribute('required', '');
labelAge.textContent = 'Age:';
labelAge.appendChild(inputAge);
form.append(labelAge);

const inputSalary = document.createElement('input');
const labelSalary = document.createElement('label');

inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.setAttribute('required', '');
labelSalary.textContent = 'Salary:';
labelSalary.appendChild(inputSalary);
form.append(labelSalary);

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';
form.append(button);

document.body.append(form);

button.addEventListener('click', (e) => {
  e.preventDefault();

  const existingNotification = document.querySelector('.notification');

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.className = 'notification';

  notification.setAttribute('data-qa', 'notification');

  let isValid = true;

  if (
    inputName.value.trim().length < 4 ||
    !/^[a-zA-Z\s]+$/.test(inputName.value)
  ) {
    isValid = false;
    notification.classList.add('error');

    notification.textContent =
      'Error! Name value should have more than 4 letters!';
    document.body.append(notification);
  }

  if (inputAge.value < 18 || inputAge.value > 90) {
    isValid = false;
    notification.classList.add('error');

    notification.textContent =
      'Error! Age value should be more than 18 and less than 90';
    document.body.append(notification);
  }

  if (!isValid) {
    e.preventDefault();

    return;
  }

  const additionalRow = document.createElement('tr');

  for (let i = 0; i <= 4; i++) {
    const additionalCell = document.createElement('td');

    additionalRow.append(additionalCell);
  }

  additionalRow.cells[0].textContent = inputName.value;
  additionalRow.cells[1].textContent = inputPosition.value;
  additionalRow.cells[2].textContent = inputOffice.value;
  additionalRow.cells[3].textContent = inputAge.value;

  const modifiedSalary = () => {
    if (inputSalary.value.length <= 3) {
      return '$' + inputSalary.value;
    }

    return (
      '$' + inputSalary.value.slice(0, -3) + ',' + inputSalary.value.slice(-3)
    );
  };

  additionalRow.cells[4].textContent = modifiedSalary();
  tbody.append(additionalRow);

  notification.classList.add('success');

  notification.textContent =
    'Congratulations! Your info has been successfully added!';

  document.body.append(notification);
});

tbody.addEventListener('dblclick', (e) => {
  const currentEditingCell = tbody.querySelector('.editing');

  if (currentEditingCell) {
    const input = currentEditingCell.querySelector('input');

    if (input) {
      currentEditingCell.textContent = input.value;
    }

    currentEditingCell.classList.remove('editing');
  }

  const clickedCell = e.target.tagName === 'TD' ? e.target : null;

  if (!clickedCell) {
    return;
  }

  const previousText = clickedCell.textContent;

  clickedCell.textContent = '';
  clickedCell.classList.add('editing');

  const cleanInput = document.createElement('input');

  cleanInput.className = 'cell-input';
  cleanInput.value = previousText;
  clickedCell.append(cleanInput);

  cleanInput.addEventListener('blur', () => {
    if (cleanInput.value === '') {
      clickedCell.textContent = previousText;
      clickedCell.classList.remove('editing');

      return;
    }
    clickedCell.textContent = cleanInput.value;
    clickedCell.classList.remove('editing');
  });

  cleanInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      if (cleanInput.value === '') {
        clickedCell.textContent = previousText;
        clickedCell.classList.remove('editing');

        return;
      }
      clickedCell.textContent = cleanInput.value;
      clickedCell.classList.remove('editing');
    }
  });
});
