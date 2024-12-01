'use strict';

// write code here
function formatSalary(salary) {
  let value = salary.replace(/\D/g, '');

  if (value) {
    value = parseInt(value).toLocaleString('en-US');
  }

  return value;
}

const pushNotification = (
  title,
  description,
  type,
  posTop = 10,
  posRight = 10,
) => {
  const body = document.querySelector('body');
  const notification = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  notification.setAttribute('class', `notification ${type}`);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  notification.setAttribute('data-qa', 'notification');
  notification.classList.add(type);

  messageTitle.setAttribute('class', 'title');
  messageTitle.innerText = title;
  messageDescription.innerText = description;

  notification.appendChild(messageTitle);
  notification.appendChild(messageDescription);
  body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, '2000');
};

const sortTable = (sortType, element) => {
  const tbody = document.querySelector('tbody');
  const rows = Array.from(tbody.rows);

  if (element.textContent === 'Name') {
    rows.sort((rowA, rowB) => {
      const A = rowA.cells[0].innerText.toLowerCase();
      const B = rowB.cells[0].innerText.toLowerCase();

      return sortType === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
    });
  }

  if (element.textContent === 'Position') {
    rows.sort((rowA, rowB) => {
      const A = rowA.cells[1].innerText.toLowerCase();
      const B = rowB.cells[1].innerText.toLowerCase();

      return sortType === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
    });
  }

  if (element.textContent === 'Office') {
    rows.sort((rowA, rowB) => {
      const A = rowA.cells[2].innerText.toLowerCase();
      const B = rowB.cells[2].innerText.toLowerCase();

      return sortType === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
    });
  }

  if (element.textContent === 'Age') {
    rows.sort((rowA, rowB) => {
      const A = parseInt(rowA.cells[3].innerText, 10);
      const B = parseInt(rowB.cells[3].innerText, 10);

      return sortType === 'asc' ? A - B : B - A;
    });
  }

  if (element.textContent === 'Salary') {
    rows.sort((rowA, rowB) => {
      const A = parseInt(rowA.cells[4].innerText.replace('$', ''), 10);
      const B = parseInt(rowB.cells[4].innerText.replace('$', ''), 10);

      return sortType === 'asc' ? A - B : B - A;
    });
  }

  rows.forEach((row) => tbody.appendChild(row));
};

const activateRow = () => {
  const tbody = document.querySelector('tbody');

  tbody.addEventListener('click', (e) => {
    const clickedRow = e.target.closest('tr');

    const activeRow = document.querySelector('.active');

    if (activeRow && activeRow !== clickedRow) {
      activeRow.classList.remove('active');
    }

    clickedRow.classList.toggle('active');
  });
};

const createForm = () => {
  const table = document.querySelector('table');
  const form = document.createElement('form');
  const button = document.createElement('button');
  const inputNames = ['name', 'position', 'age', 'salary'];
  const selectOptions = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.classList.add('new-employee-form');
  table.insertAdjacentElement('afterend', form);

  inputNames.forEach((inputName) => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    input.name = inputName;
    input.setAttribute('data-qa', inputName);
    input.required = true;

    input.type =
      inputName === 'age' || inputName === 'salary' ? 'number' : 'text';

    label.textContent =
      inputName.charAt(0).toUpperCase() + inputName.slice(1) + ': ';
    label.appendChild(input);
    form.appendChild(label);

    if (inputName === 'position') {
      const selectLabel = document.createElement('label');
      const select = document.createElement('select');

      select.name = 'office';
      select.setAttribute('data-qa', 'office');
      select.required = true;

      selectOptions.forEach((city) => {
        const option = document.createElement('option');

        option.textContent = city;
        select.appendChild(option);
      });

      selectLabel.textContent = 'Office: ';
      selectLabel.appendChild(select);

      form.appendChild(selectLabel);
    }
  });

  button.type = 'submit';
  button.textContent = 'Save to table';

  form.appendChild(button);
};

const saveToTable = () => {
  // const button = document.querySelector('button');

  const form = document.querySelector('.new-employee-form');
  const data = new FormData(form);
  const dataToSave = {
    name: data.get('name'),
    position: data.get('position'),
    office: data.get('office'),
    age: `${data.get('age')}`,
    salary: `$${formatSalary(data.get('salary'))}`,
  };
  const tbody = document.querySelector('tbody');
  const tr = document.createElement('tr');

  for (const field in dataToSave) {
    const td = document.createElement('td');

    td.textContent = dataToSave[field];

    tr.appendChild(td);
  }

  tbody.appendChild(tr);
};

const addSortingListeners = () => {
  const th = document.querySelector('thead').children[0].children;
  let sortType = 'desc';

  Array.from(th).forEach((element) => {
    element.addEventListener('click', () => {
      sortType = sortType === 'asc' ? 'desc' : 'asc';
      sortTable(sortType, element);
    });
  });
};

const dataValidation = () => {
  const button = document.querySelector('button');

  button.addEventListener('click', (e) => {
    e.preventDefault();

    const form = document.querySelector('.new-employee-form');
    const data = new FormData(form);
    const dataToValidate = {
      name: data.get('name'),
      position: data.get('position'),
      office: data.get('office'),
      age: data.get('age'),
      salary: `$${formatSalary(data.get('salary'))}`,
    };

    if (
      dataToValidate.name.length < 4 ||
      dataToValidate.age < 18 ||
      dataToValidate.age > 90
    ) {
      pushNotification('Error', 'Name or age not suitable', 'error');

      return;
    }

    pushNotification('Success', 'New employee added succesfully', 'success');
    saveToTable();
  });
};

activateRow();
createForm();
dataValidation();
// saveToTable();
addSortingListeners();
