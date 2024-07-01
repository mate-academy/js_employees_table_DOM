'use strict';

const body = document.querySelector('body');
const table = document.querySelector('tbody');
const headerItems = document.querySelectorAll('thead th');
const tableRows = document.querySelectorAll('tbody tr');
const form = document.createElement('form');

form.className = 'new-employee-form';
form.action = '#';
form.method = 'post';

form.innerHTML = `
  <label>Name: <input data-qa="name" name="name" type="text"></label>
  <label>Position: <input data-qa="position" name="position" type="text"></label>
  <label>Office: <select data-qa="office" name="office">
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input data-qa="age" name="age" type="number"></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number"></label>
  <button type="submit">Save to table</button>
`;

body.append(form);

function pushNotification(posTop, posRight, title, description, type = '') {
  const mesage = document.createElement('div');

  mesage.className = `notification ${type}`;
  mesage.dataset.qa = 'notification';
  mesage.style.top = `${posTop}px`;
  mesage.style.right = `${posRight}px`;

  mesage.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  body.append(mesage);

  setTimeout(() => {
    mesage.hidden = true;
  }, 2000);
}

function checkData(formData) {
  if (formData.name.trim().length < 4) {
    pushNotification(
      500,
      10,
      'Error!',
      `The name should contain at least 4 letters.!`,
      'error',
    );

    return false;
  }

  if (!formData.position.trim()) {
    pushNotification(
      500,
      10,
      'Error!',
      `Position field cannot be empty!`,
      'error',
    );

    return false;
  }

  if (+formData.salary < 0) {
    pushNotification(
      500,
      10,
      'Error!',
      `Salary field cannot be negative!`,
      'error',
    );

    return false;
  }

  if (+formData.age < 18 || +formData.age > 90) {
    pushNotification(500, 10, 'Error!', `Age must be more 18`, 'error');

    return false;
  }

  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  const newRow = document.createElement('tr');

  const valueSalary = Number(data.salary).toLocaleString('en-US');

  newRow.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${data.age}</td>
    <td>${'$' + valueSalary}</td>
  `;

  if (checkData(data)) {
    pushNotification(
      500,
      10,
      'Success!',
      'Employee has been added!',
      'success',
    );

    table.append(newRow);
    form.reset();
  } else {
    checkData(data);
  }
});

function sortTable() {
  let getIndexForReverse = null;
  let isReverse = false;

  headerItems.forEach((headerItem) => {
    headerItem.addEventListener('click', (item) => {
      const itemIndex = [...headerItems].indexOf(item.target);

      if (itemIndex === getIndexForReverse) {
        isReverse = !isReverse;
      } else {
        getIndexForReverse = itemIndex;
      }

      const sortedTable = [...tableRows].sort((row1, row2) => {
        const contentRow1 = row1.children[itemIndex].innerHTML;
        const contentRow2 = row2.children[itemIndex].innerHTML;

        if (contentRow1.includes('$')) {
          return (
            contentRow1.replace('$', '').replace(',', '') -
            contentRow2.replace('$', '').replace(',', '')
          );
        }

        return contentRow1.localeCompare(contentRow2);
      });

      if (isReverse) {
        sortedTable.reverse();
      }

      table.append(...sortedTable);
    });
  });
}

sortTable();

table.addEventListener('click', (e) => {
  [...tableRows].map((row) => row.classList.remove('active'));
  e.target.parentNode.classList.add('active');
});
