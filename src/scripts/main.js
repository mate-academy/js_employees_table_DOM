'use strict';

const tHead = document.querySelector('thead');

tHead.querySelectorAll('th').forEach((th) => {
  let clickCount = 0;

  th.addEventListener('click', () => {
    clickCount++;

    const index = Array.from(tHead.querySelectorAll('th')).indexOf(th);

    const allTrArray = document.querySelectorAll('tbody tr');
    const cellValues = [];

    allTrArray.forEach((tr) => {
      const cell = tr.cells[index];

      cellValues.push({ row: tr, value: cell.textContent });
    });

    const callback = (a, b) => {
      const columnName = th.textContent.trim();

      if (columnName === 'Name' && clickCount % 2 === 1) {
        return a.value.localeCompare(b.value);
      }

      if (columnName === 'Position' && clickCount % 2 === 1) {
        return a.value.localeCompare(b.value);
      }

      if (columnName === 'Office' && clickCount % 2 === 1) {
        return a.value.localeCompare(b.value);
      }

      if (columnName === 'Name' && clickCount % 2 === 0) {
        return b.value.localeCompare(a.value);
      }

      if (columnName === 'Position' && clickCount % 2 === 0) {
        return b.value.localeCompare(a.value);
      }

      if (columnName === 'Office' && clickCount % 2 === 0) {
        return b.value.localeCompare(a.value);
      }

      if (columnName === 'Age' && clickCount % 2 === 1) {
        return Number(a.value) - Number(b.value);
      }

      if (columnName === 'Age' && clickCount % 2 === 0) {
        return Number(b.value) - Number(a.value);
      }

      if (columnName === 'Salary' && clickCount % 2 === 1) {
        return (
          Number(a.value.replace(/[^0-9.]/g, '')) -
          Number(b.value.replace(/[^0-9.]/g, ''))
        );
      }

      if (columnName === 'Salary' && clickCount % 2 === 0) {
        return (
          Number(b.value.replace(/[^0-9.]/g, '')) -
          Number(a.value.replace(/[^0-9.]/g, ''))
        );
      }
    };

    const sorted = cellValues.sort(callback);

    sorted.forEach(({ row }) => {
      document.querySelector('tbody').appendChild(row);
    });
  });
});

const tBody = document.querySelector('tbody');

tBody.querySelectorAll('tr').forEach((tr) => {
  tr.addEventListener('click', () => {
    tBody.querySelectorAll('tr').forEach((row) => {
      row.classList.remove('active');
    });
    tr.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.querySelector('body').appendChild(form);

form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position: <input name="position" type="text" data-qa="position" required></label>
<label>Office: <select name="office" data-qa="office" required>
<option value="Tokyo">Tokyo</option>
<option value="Singapore">Singapore</option>
<option value="London">London</option>
<option value="New York">New York</option>
<option value="Edinburgh">Edinburgh</option>
<option value="San Francisco">San Francisco</option>
</select></label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
<button>Save to table</button>
`;

const pushNotification = (title, description, type) => {
  const block = document.createElement('div');

  block.classList.add('notification');
  block.setAttribute('data-qa', 'notification');
  block.classList.add(type);
  document.body.appendChild(block);

  const descriptionArr = description.split('\n');

  block.innerHTML = `
  <h2 class="title">${title}</h2>
  <p>${descriptionArr[0]}<br>${descriptionArr[1]}</p>
  `;

  setTimeout(() => {
    block.style.display = 'none';
  }, 2000);
};

const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const newRow = document.createElement('tr');

  const userName = document.querySelector('[data-qa="name"]').value;
  const position = document.querySelector('[data-qa="position"]').value;
  const office = document.querySelector('[data-qa="office"]').value;
  const age = document.querySelector('[data-qa="age"]').value;
  const salary =
    '$' +
    document
      .querySelector('[data-qa="salary"]')
      .value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (userName.length < 4 || age < 18 || age > 90) {
    pushNotification(
      'Title of Error message',
      'Message example.\n ' +
        'Notification should contain title and description.',
      'error',
    );
  } else {
    newRow.innerHTML = `
  <td>${userName}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>${salary}</td>
  `;

    tBody.appendChild(newRow);

    pushNotification(
      'Title of Success message',
      'Message example.\n ' +
        'Notification should contain title and description.',
      'success',
    );
  }
});
