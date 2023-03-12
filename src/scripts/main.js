'use strict';

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
const form = document.createElement('form');

// Form for adding new row to the table

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
    <input
      name="name"
      type="text"
      data-qa="name"
    >
  </label>
  <label>
    Position:
    <input
      name="position"
      type="text"
      data-qa="position"
    >
  </label>
  <label>
    Ofice:
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>
    Age:
    <input
      name="age"
      type="number"
      data-qa="age"
    >
  </label>
  <label>
    Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
    >
  </label>
  <button type="submit">Save to table</button>
`;

const formSubmitHandler = (e) => {
  e.preventDefault();

  const employee = document.createElement('tr');
  const employeeName = document.createElement('td');
  const employeePosition = document.createElement('td');
  const employeeOffice = document.createElement('td');
  const employeeAge = document.createElement('td');
  const employeeSalary = document.createElement('td');
  let title = 'Success';
  let message = 'New employee has been added to the table';
  let result = 'success';

  employeeName.textContent = form.name.value.trim();
  employeePosition.textContent = form.position.value.trim();
  employeeOffice.textContent = form.office.value;
  employeeAge.textContent = form.age.value;

  employeeSalary.textContent
    = `$${form.salary.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  if (employeeName.textContent.length < 4) {
    form.name.focus();

    title = 'Error';
    message = 'Name value should be longer than 3 characters';
    result = 'error';

    pushNotification(title, message, result);

    return;
  } else if (employeePosition.textContent.length < 4) {
    form.position.focus();

    title = 'Error';
    message = 'Position value should be longer than 3 characters';
    result = 'error';

    pushNotification(title, message, result);

    return;
  } else if (employeeAge.textContent < 18 || employeeAge.textContent > 90) {
    form.age.focus();

    title = 'Error';

    message
      = 'Age value should be greater than or equal 18 and less or equal 90';
    result = 'error';

    pushNotification(title, message, result);

    return;
  } else if (form.salary.value < 1000) {
    form.salary.focus();

    title = 'Error';
    message = 'Salary value should be greater than or equal 1000';
    result = 'error';

    pushNotification(title, message, result);

    return;
  };

  employee.append(employeeName, employeePosition,
    employeeOffice, employeeAge, employeeSalary);

  tableBody.append(employee);

  pushNotification(title, message, result);

  form.reset();
};

document.body.append(form);

form.addEventListener('submit', formSubmitHandler);

const pushNotification = (title, message, result) => {
  const container = document.createElement('div');
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationMessage = document.createElement('p');

  notificationTitle.textContent = title;
  notificationMessage.textContent = message;

  notificationTitle.classList.add('title');
  notification.classList.add('notification', result);
  notification.dataset.qa = 'notification';

  notification.style.cssText = `
    position: static;
    border: 1px solid transparent;
  `;

  notification.append(
    notificationTitle, notificationMessage
  );

  container.className = 'container';

  container.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    display: flex;
    gap: 10px;
    flex-direction: column-reverse;
  `;

  const existContainer = document.querySelector('.container');

  if (!existContainer) {
    document.body.append(container);
  }

  document.querySelector('.container').append(notification);

  setTimeout(() => {
    notification.style.opacity = 0;
    notification.style.transition = 'opacity 0.3s';

    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
};

// Implement table sorting by clicking on the title (in two directions)

const compareCellTextAsc = (i) => {
  return (a, b) => {
    return a.cells[i].textContent.localeCompare(b.cells[i].textContent);
  };
};

const compareCellTextDesc = (i) => {
  return (a, b) => {
    return b.cells[i].textContent.localeCompare(a.cells[i].textContent);
  };
};

const compareCellNumberAsc = (i) => {
  return (a, b) => {
    return +a.cells[i].textContent.replace(/[$,]/g, '')
    - +b.cells[i].textContent.replace(/[$,]/g, '');
  };
};

const compareCellNumberDesc = (i) => {
  return (a, b) => {
    return +b.cells[i].textContent.replace(/[$,]/g, '')
    - +a.cells[i].textContent.replace(/[$,]/g, '');
  };
};

const activeElements = [false, false, false, false, false];

const setSortDirection = (num) => {
  const switcher = activeElements[num];

  activeElements.fill(false);
  activeElements[num] = !switcher;
};

const sorter = (index, fieldType) => {
  const sortedRows = [...tableBody.rows];
  const compareCellAsc = fieldType === 'text'
    ? compareCellTextAsc : compareCellNumberAsc;
  const compareCellDesc = fieldType === 'text'
    ? compareCellTextDesc : compareCellNumberDesc;

  if (!activeElements[index]) {
    sortedRows.sort(compareCellAsc(index));
    setSortDirection(index);
  } else {
    sortedRows.sort(compareCellDesc(index));
    setSortDirection(index);
  }

  table.tBodies[0].append(...sortedRows);
};

const sortPeople = (targetName) => {
  if (targetName === 'name') {
    sorter(0, 'text');
  };

  if (targetName === 'position') {
    sorter(1, 'text');
  };

  if (targetName === 'office') {
    sorter(2, 'text');
  };

  if (targetName === 'age') {
    sorter(3, 'number');
  };

  if (targetName === 'salary') {
    sorter(4, 'number');
  };
};

const clickHandler = (e) => {
  sortPeople(e.target.textContent.toLowerCase(), e);
};

table.tHead.addEventListener('click', clickHandler);

// Selecting a row by click

[...tableBody.rows].map(row => row.addEventListener('click', () => {
  [...tableBody.rows].map(row1 => row1.classList.remove('active'));
  row.className = 'active';
}));

// Implement editing of table cells by double-clicking on it

const dbClickHandler = (clickEvent) => {
  if (clickEvent.target.tagName === 'TD') {
    const editCell = clickEvent.target;
    const text = editCell.textContent;
    const input = document.createElement('input');
    const cellStyles = getComputedStyle(editCell);

    input.style.width = cellStyles.width;
    input.value = text;
    input.className = 'cell-input';
    editCell.textContent = '';
    editCell.append(input);
    input.focus();

    if (clickEvent.target.parentElement.children[3] === clickEvent.target) {
      input.type = 'number';
      input.min = 18;
      input.max = 90;
    }

    if (clickEvent.target.parentElement.children[4] === clickEvent.target) {
      input.value = text.replace(/[$,]/g, '');
      input.type = 'number';
      input.min = 1000;
    }

    const saveInputValue = e => {
      if (e.key === 'Enter' || e.type === 'blur') {
        if (+text.replace(/[$,]/g, '') > 90) {
          editCell.textContent
            = `$${input.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        } else {
          editCell.textContent = input.value;
        }

        if (!input.value.trim()) {
          editCell.textContent = text;
        }

        input.remove();
      }
    };

    input.addEventListener('blur', saveInputValue);
    input.addEventListener('keypress', saveInputValue);
  }
};

table.addEventListener('dblclick', dbClickHandler);
