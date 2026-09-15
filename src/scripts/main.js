'use strict';

// write code here
const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const people = [];

let selectedTableRow;
let sortOrder = true;
let sortColumn = '';

[...document.querySelectorAll('tbody tr')].map((row) => {
  const rowCells = [...row.children].map((cell) => cell.textContent);

  rowCells[4] = rowCells[4].replaceAll(/\W/g, '');

  addPerson(...rowCells);
});

document.body.append(createForm());

tableHead.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    if (sortColumn !== e.target.textContent) {
      sortOrder = true;
    } else {
      sortOrder = !sortOrder;
    }

    sortColumn = e.target.textContent;

    sortTableData(sortOrder, sortColumn);
    updateTableBody();
  }
});

table.addEventListener('click', (e) => {
  if (e.target.tagName === 'TD') {
    const par = e.target.parentNode;

    if (selectedTableRow) {
      selectedTableRow.className = '';
    }

    par.className = 'active';
    selectedTableRow = par;
  }
});

function sortTableData(isSortAscending, sortBy) {
  let person1, person2;

  people.sort((p1, p2) => {
    if (isSortAscending) {
      [person1, person2] = [p1, p2];
    } else {
      [person1, person2] = [p2, p1];
    }

    if (['Age', 'Salary'].includes(sortColumn)) {
      return +person1[sortBy] - +person2[sortBy];
    } else {
      return person1[sortBy].localeCompare(person2[sortBy]);
    }
  });
}

function updateTableBody() {
  const newTableBody = document.createElement('tbody');

  for (const person of people) {
    const newRow = document.createElement('tr');

    for (const [k, v] of Object.entries(person)) {
      const cell = document.createElement('td');

      cell.textContent =
        k === 'Salary' ? `$${(+v).toLocaleString('en-US')}` : v;

      newRow.append(cell);
    }

    newTableBody.append(newRow);
  }

  document.querySelector('tbody').replaceWith(newTableBody);
}

function addPerson(personName, position, office, age, salary) {
  const person = {};

  if (personName.length < 4 || +age < 18 || +age > 90 || position.length < 4) {
    throw new Error('Invalid name or age entered');
  }

  person.Name = personName;
  person.Position = position;
  person.Office = office;
  person.Age = age;
  person.Salary = salary;

  people.push(person);
}

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';
  form.noValidate = true;

  form.innerHTML = `
    <label>Name: <input data-qa="name" type="text" name="name" required></label>
    <label>Position: <input data-qa="position" type="text" name="position" required></label>
    <label>Office: <select data-qa="office" name="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select></label>
    <label>Age: <input data-qa="age" type="number" name="age" required></label>
    <label>Salary: <input data-qa="salary" type="number" name="salary" required></label>
    <button type="submit">Save to table</button>
  `;

  form.addEventListener('submit', (e) => {
    const formData = new FormData(form);

    e.preventDefault();

    try {
      addPerson(...[...formData.values()]);
    } catch {
      createNotification('error');

      return;
    }

    createNotification('success');

    if (sortColumn) {
      sortTableData();
    }

    updateTableBody();
  });

  return form;
}

function createNotification(notificationType) {
  const notification = document.createElement('div');
  const title = document.createElement('h2');

  notification.className = 'notification';
  notification.dataset.qa = 'notification';

  switch (notificationType) {
    case 'error':
      notification.classList.add('error');
      title.textContent = 'Error';

      notification.textContent = `
      An error has occured, 
      try checking the values entered.
      `;

      break;
    case 'success':
      notification.classList.add('success');
      title.textContent = 'Success';

      notification.textContent = `
      New person was succesfully added.
      `;

      break;
  }

  notification.prepend(title);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}
