'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');
const rows = [...tableBody.querySelectorAll('tr')];
let sortDirection = 1;

thead.addEventListener('click', e => {
  const eIndex = e.target.cellIndex;

  const sortRows = rows.sort((row1, row2) => {
    const cell1 = row1.querySelectorAll('td')[eIndex].textContent;
    const cell2 = row2.querySelectorAll('td')[eIndex].textContent;

    switch (e.target.textContent) {
      case 'Name':
      case 'Position':
      case 'Office':
        return sortDirection * cell1.localeCompare(cell2);
      case 'Age':
        return sortDirection * cell1 - cell2;
      case 'Salary':
        return sortDirection * Number(cell1.replace(/[^\d.-]/g, ''))
            - Number(cell2.replace(/[^\d.-]/g, ''));
    }
  });

  tableBody.append(...sortRows);
  sortDirection *= -1;
});

const rowsSorted = [...table.querySelector('tbody').querySelectorAll('tr')];

for (let i = 0; i < rowsSorted.length; i++) {
  rowsSorted[i].addEventListener('click', () => {
    const isActive = document.querySelectorAll('tr.active');

    if (isActive.length > 0) {
      for (let k = 0; k < isActive.length; k++) {
        isActive[k].classList.remove('active');
      }
    }

    rowsSorted[i].classList.add('active');
  });
};

const newForm = document.createElement('form');

newForm.className += ' new-employee-form';

const body = document.querySelector('body');

body.appendChild(newForm);

newForm.innerHTML = `
<label>
Name: <input name="name" type="text"  data-qa="name" required>
</label>
<label>
Position: <input name="position" type="text" data-qa="position" required>
</label>

<label>
Office: <select name="office" data-qa="office" required>
<option>Tokyo</option>
<option>Singapore</option>
<option>London</option>
<option>New York</option>
<option>Edinburgh</option>
<option>San Francisco</option>
</select>
</label>

<label>
Age: <input name="age" data-qa="age" type="number" required>
</label>

<label>
Salary: <input name="salary" type="number" data-qa="salary" required>
</label>

<button type="submit">Save to table</button>
`;

newForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const form = document.querySelector('form');
  const formData = new FormData(form);

  ;

  const newRow = tableBody.insertRow();

  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';

  if (formData.get('name').length < 3) {
    notification.classList.add('error');

    notification.insertAdjacentHTML('afterbegin', `
    <h2 class="title">INCORRECT NAME</h2>
      <span>
        Please type in correct name. Name should have at least 3 letters.
      </span>
    `);
  } else if (formData.get('age') < 18 || formData.get('age') > 90) {
    notification.classList.add('error');

    notification.insertAdjacentHTML('afterbegin', `
    <h2 class="title">INCORRECT AGE</h2>
      <span>
      You are too young or too old
      </span>
    `);
  } else {
    notification.classList.add('success');

    notification.insertAdjacentHTML('afterbegin', `
      <h2 class="title">Welcome!!!</h2>
      <span>
        New employee was added!
      </span>
    `);

    for (const pair of formData.entries()) {
      const nameCell = pair[0];
      let value = pair[1];

      if (nameCell === 'salary') {
        value = (+value).toLocaleString('en-US', {
          style: 'currency', currency: 'USD',
        });
      }

      const newCell = newRow.insertCell();

      newCell.textContent = value;
    }
  }

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 1500);
});
