'use strict';

const tableHeaders = document.querySelectorAll('th');
const rowsArray = Array.from(document.querySelectorAll('tbody tr'));
const sortDirection = {};

// tableHeaders.forEach((header, index) => {
//   sortDirection[index] = true;

//   header.addEventListener('click', (e) => {
//     const sortedRows = rowsArray.sort((rowA, rowB) => {
//       const cellA = rowA.cells[index].textContent.trim();
//       const cellB = rowB.cells[index].textContent.trim();

//       if (index === 4) {
//         const salaryA = parseFloat(cellA.replace(/[$,]/g, ''));
//         const salaryB = parseFloat(cellB.replace(/[$,]/g, ''));

//         return sortDirection[index] ? salaryA - salaryB : salaryB - salaryA;
//       } else {
//         return sortDirection[index]
//           ? cellA.localeCompare(cellB)
//           : cellB.localeCompare(cellA);
//       }
//     });

//     const tbody = document.querySelector('tbody');

//     tbody.innerHTML = '';
//     sortedRows.forEach((row) => tbody.appendChild(row));

//     sortDirection[index] = !sortDirection[index];
//   });
// });

function sortRows(index, isAscending, rowsArr) {
  return rowsArr.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent.trim();
    const cellB = rowB.cells[index].textContent.trim();

    if (index === 4) {
      const salaryA = parseFloat(cellA.replace(/[$,]/g, ''));
      const salaryB = parseFloat(cellB.replace(/[$,]/g, ''));

      return isAscending ? salaryA - salaryB : salaryB - salaryA;
    } else {
      return isAscending
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
  });
}

function updateTable(sortedRows) {
  const tbody = document.querySelector('tbody');

  tbody.innerHTML = '';

  sortedRows.forEach((row) => tbody.appendChild(row));
}

function handleHeaderClick(index, arraySort, directionSort) {
  const isAscending = directionSort[index];

  const sortedRows = sortRows(index, isAscending, arraySort);

  updateTable(sortedRows);

  directionSort[index] = !isAscending;
}

tableHeaders.forEach((header, index) => {
  sortDirection[index] = true;

  header.addEventListener('click', () => {
    handleHeaderClick(index, rowsArray, sortDirection);
  });
});

const rows = document.querySelectorAll('tbody tr');

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

// const form = document.createElement('form');

// form.classList.add('new-employee-form');

// const nameLabel = document.createElement('label');

// nameLabel.innerHTML =
//   'Name: <input name="name" type="text" data-qa="name" required>';
// form.appendChild(nameLabel);

// const positionLabel = document.createElement('label');

// positionLabel.innerHTML =
//   'Position: <input name="position" type="text" data-qa="position">';
// form.appendChild(positionLabel);

// const ageLabel = document.createElement('label');

// ageLabel.innerHTML =
//   'Age: <input name="age" type="number" data-qa="age" required>';
// form.appendChild(ageLabel);

// const salaryLabel = document.createElement('label');

// salaryLabel.innerHTML =
//   'Salary: <input name="salary" type="number" data-qa="salary" required>';
// form.appendChild(salaryLabel);

// const officeSelectLabel = document.createElement('label');

// officeSelectLabel.innerHTML = 'Office: ';

// const officeSelect = document.createElement('select');

// officeSelect.name = 'office';
// officeSelect.setAttribute('data-qa', 'office');

// const cities = [
//   'Tokyo',
//   'Singapore',
//   'London',
//   'New York',
//   'Edinburgh',
//   'San Francisco',
// ];

// cities.forEach((city) => {
//   const option = document.createElement('option');

//   option.value = city;
//   option.textContent = city;
//   officeSelect.appendChild(option);
// });

// officeSelectLabel.appendChild(officeSelect);
// form.appendChild(officeSelectLabel);

// const button = document.createElement('button');

// button.type = 'submit';
// button.textContent = 'Save to table';
// form.appendChild(button);

// document.body.appendChild(form);

const formHTML = `
  <form class="new-employee-form">
    <label>
      Name: <input name="name" type="text" data-qa="name" required>
    </label>
    <label>
      Position: <input name="position" type="text" data-qa="position">
    </label>
    <label>
      Age: <input name="age" type="number" data-qa="age" required>
    </label>
    <label>
      Salary: <input name="salary" type="number" data-qa="salary" required>
    </label>
    <label>
      Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <button type="submit">Save to table</button>
  </form>
`;

document.body.insertAdjacentHTML('beforeend', formHTML);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  validateForm();
});

// function validateForm() {
//   const nameEmployee = form.elements.name.value;
//   const position = form.elements.position.value;
//   const office = form.elements.office.value;
//   const age = parseInt(form.elements.age.value, 10);
//   const salary = parseFloat(form.elements.salary.value);

//   if (nameEmployee.length < 4) {
//     showNotification(
//       'Error',
//       'Name must be at least 4 characters long.',
//       'error',
//     );

//     return;
//   }

//   if (!position) {
//     showNotification('Error', 'Please choose a valid position.', 'error');

//     return;
//   }

//   if (age < 18 || age > 90) {
//     showNotification('Error', 'Age must be between 18 and 90.', 'error');

//     return;
//   }

//   if (isNaN(salary) || salary <= 0) {
//     showNotification('Error', 'Salary must be a positive number.', 'error');

//     return;
//   }

//   addEmployeeToTable(nameEmployee, position, office, age, salary);
//   showNotification('Success', 'Employee added successfully!', 'success');
// }

function validateForm() {
  const nameEmployee = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = parseInt(form.elements.age.value, 10);
  const salary = parseFloat(form.elements.salary.value);

  const validationError = validateEmployeeDetails(
    nameEmployee,
    position,
    age,
    salary,
  );

  if (validationError) {
    showNotification('Error', validationError, 'error');

    return;
  }

  addEmployeeToTable(nameEmployee, position, office, age, salary);
  showNotification('Success', 'Employee added successfully!', 'success');
}

function validateEmployeeDetails(nameWorker, position, age, salary) {
  if (nameWorker.length < 4) {
    return 'Name must be at least 4 characters long.';
  }

  if (!position) {
    return 'Please choose a valid position.';
  }

  if (age < 18 || age > 90) {
    return 'Age must be between 18 and 90.';
  }

  if (isNaN(salary) || salary <= 0) {
    return 'Salary must be a positive number.';
  }

  return null;
}

// function showNotification(title, message, type) {
//   const notification = document.createElement('div');

//   notification.classList.add('notification');
//   notification.classList.add(type);
//   notification.setAttribute('data-qa', 'notification');

//   const titleElement = document.createElement('span');

//   titleElement.classList.add('title');
//   titleElement.textContent = title;

//   const messageElement = document.createElement('span');

//   messageElement.textContent = message;

//   notification.appendChild(titleElement);
//   notification.appendChild(messageElement);
//   document.body.appendChild(notification);

//   setTimeout(() => {
//     notification.style.visibility = 'hidden';
//   }, 1000);
// }

function showNotification(title, message, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <span class="title">${title}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.visibility = 'hidden';
  }, 1000);
}

function addEmployeeToTable(nameEmployee, position, office, age, salary) {
  const tbody = document.querySelector('tbody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameEmployee}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(newRow);
  form.reset();
}
