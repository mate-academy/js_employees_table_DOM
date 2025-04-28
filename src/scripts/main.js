'use strict';

// JS+DOM, table variables
const tableOfWorkers = document.querySelector('table');
const tableHeader = document.querySelector('table');
const tableRows = Array.from(tableOfWorkers.querySelectorAll('tbody > tr'));

// Add form
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');
document.body.appendChild(employeeForm);

// Form labels and input
// #region form_data
// Add labels
// NAME
const labelName = document.createElement('label');

labelName.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.type = 'text';
nameInput.name = 'name';
nameInput.setAttribute('data-qa', 'name');

// POSITION
const labelPosition = document.createElement('label');

labelPosition.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.type = 'text';
positionInput.name = 'position';
positionInput.setAttribute('data-qa', 'position');

// OFFICE
const labelOffice = document.createElement('label');

labelOffice.textContent = 'Office: ';

const officeInput = document.createElement('select');

officeInput.name = 'office';
officeInput.setAttribute('data-qa', 'position');

// Add options for office location
const option1 = document.createElement('option');

option1.text = 'Tokyo';
officeInput.add(option1);

const option2 = document.createElement('option');

option2.text = 'Singapore';
officeInput.add(option2);

const option3 = document.createElement('option');

option3.text = 'London';
officeInput.add(option3);

const option4 = document.createElement('option');

option4.text = 'New York';
officeInput.add(option4);

const option5 = document.createElement('option');

option5.text = 'Edinburgh';
officeInput.add(option5);

const option6 = document.createElement('option');

option6.text = 'San Francisco';
officeInput.add(option6);

// AGE
const labelAge = document.createElement('label');

labelAge.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.type = 'number';
ageInput.name = 'age';
ageInput.setAttribute('data-qa', 'age');

// SALARY
const labelSalary = document.createElement('label');

labelSalary.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.type = 'number';
salaryInput.name = 'salary';
salaryInput.setAttribute('data-qa', 'salary');

// SUBMIT BUTTON
const submitButton = document.createElement('button');

submitButton.type = 'button';
submitButton.name = 'button';
submitButton.textContent = 'Save to table';

// Appending labels and inputs to the form

// Append input field into lables
labelName.appendChild(nameInput);
labelPosition.appendChild(positionInput);
labelOffice.appendChild(officeInput);
labelAge.appendChild(ageInput);
labelSalary.appendChild(salaryInput);

// Append labels to the form
employeeForm.appendChild(labelName);
employeeForm.appendChild(labelPosition);
employeeForm.appendChild(labelOffice);
employeeForm.appendChild(labelAge);
employeeForm.appendChild(labelSalary);
employeeForm.appendChild(submitButton);
// #endregion

// Utility variables
// 0 = ASC
// 1 = DESC
let sortingDirection = 0;

// Functions
function sortColumn(list, index, direction) {
  // Sort in decreasing order
  if (direction === 0) {
    // Change direction of sorting.
    return list.sort((a, b) => {
      let valA = a.cells[index].textContent.trim();
      let valB = b.cells[index].textContent.trim();

      // Sort by length of 'title'
      if (index !== 4 && index !== 3) {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();

        return valA.length - valB.length;
      }

      // Othervise sort in numerical order.
      valA = parseInt(valA.replace(/[^0-9.]/g, ''));
      valB = parseInt(valB.replace(/[^0-9.]/g, ''));

      return valA - valB;
    });
  }

  if (direction === 1) {
    return list.sort((a, b) => {
      // Extract data.
      let valA = a.cells[index].textContent.trim();
      let valB = b.cells[index].textContent.trim();

      if (index !== 4 && index !== 3) {
        // Do it to equailly compare A and B.
        valA.toLowerCase();
        valB.toLowerCase();

        return valB.length - valA.length;
      }

      valA = parseInt(valA.replace(/[^0-9.]/g, ''));
      valB = parseInt(valB.replace(/[^0-9.]/g, ''));

      return valB - valA;
    });
  }
}

function updateTable(sortedArrOfRows) {
  // DONE
  const tableBody = tableOfWorkers.querySelector('tbody');

  tableBody.innerHTML = '';

  sortedArrOfRows.forEach((worker) => {
    tableBody.appendChild(worker);
  });
}

tableRows.forEach((row) => {
  row.addEventListener('click', (e) => {
    tableRows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

submitButton.addEventListener('click', (e) => {
  const statusNotification = document.createElement('div');

  statusNotification.setAttribute('data-qa', 'notification');
  statusNotification.textContent = 'Employee added successfully!';
  statusNotification.className = 'notification success';
  statusNotification.style.display = 'block';

  const statusNotificationTitle = document.createElement('h3');

  statusNotificationTitle.textContent = 'Success!';
  statusNotificationTitle.classList.add('title');
  statusNotification.appendChild(statusNotificationTitle);

  // Create a new row
  const newEmployee = document.createElement('tr');
  const employeeName = newEmployee.insertCell();
  const employeePosition = newEmployee.insertCell();
  const employeeOffice = newEmployee.insertCell();
  const employeeAge = newEmployee.insertCell();
  const employeeSalary = newEmployee.insertCell();

  // Populate the new row with input values
  if (nameInput.value.length < 4) {
    statusNotification.className = 'notification error';

    statusNotification.textContent =
      'Employee name should be at least 4 characters!!!';
    statusNotificationTitle.textContent = 'Error!';
    statusNotification.appendChild(statusNotificationTitle);
    document.body.appendChild(statusNotification);

    setTimeout(() => {
      statusNotification.style.display = 'none';
    }, 2000);

    return;
  } else {
    employeeName.textContent = nameInput.value;
  }
  employeePosition.textContent = positionInput.value;
  employeeOffice.textContent = officeInput.value;

  if (Number(ageInput.value) < 18) {
    statusNotification.className = 'notification error';
    statusNotification.textContent = 'Employee age is below 18!';
    statusNotificationTitle.textContent = 'Error!';
    statusNotification.appendChild(statusNotificationTitle);
    document.body.appendChild(statusNotification);

    setTimeout(() => {
      statusNotification.style.display = 'none';
    }, 2000);

    return;
  } else {
    employeeAge.textContent = Number(ageInput.value);
  }
  employeeSalary.textContent = '$' + Number(salaryInput.value).toLocaleString();

  // Append the new row to the table body
  const tableBody = tableOfWorkers.querySelector('tbody');

  tableBody.appendChild(newEmployee);
  statusNotification.className = 'notification success';
  document.body.appendChild(statusNotification);

  // Remove notification after 2 seconds
  setTimeout(() => {
    statusNotification.style.display = 'none';
  }, 2000);

  // Recalculate `tableRows` to include the new row
  const updatedRows = Array.from(tableOfWorkers.querySelectorAll('tbody > tr'));

  tableRows.length = 0; // Clear the old array
  tableRows.push(...updatedRows); // Update with new rows

  // Add click event for the new row to allow selection
  newEmployee.addEventListener('click', () => {
    tableRows.forEach((row) => row.classList.remove('active'));
    newEmployee.classList.add('active');
  });

  // Optionally, clear the form inputs after saving
  nameInput.value = '';
  positionInput.value = '';
  officeInput.value = 'Tokyo'; // Reset to default option
  ageInput.value = '';
  salaryInput.value = '';
});

tableHeader.addEventListener('click', (e) => {
  const columnIndex = e.target.cellIndex;

  // Table rows is an array made of <tr> rows of the table.
  // columnIndex is an index of the column that should be sorted.
  // Sorted rows is essentially just an array of new sorted rows ???
  const sortedRows = sortColumn(tableRows, columnIndex, sortingDirection);

  updateTable(sortedRows);

  // update direction ON CLCIK
  if (sortingDirection === 0) {
    sortingDirection = 1;
  } else {
    sortingDirection = 0;
  }
});
