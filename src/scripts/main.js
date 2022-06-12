'use strict';

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
const body = document.querySelector('body');

table.addEventListener('click', e => {
  const item = e.target.closest('th');
  const index = item.cellIndex;
  let sortedArray = [];

  if (!('direction' in item)) {
    item.direction = 'ASC';
  }

  if (item.direction === 'ASC') {
    item.direction = 'DESC';

    sortedArray = [...tableBody.rows].sort((a, b) => {
      const aValue = a.cells[index].innerText.replace(/[$,]/g, '');
      const bValue = b.cells[index].innerText.replace(/[$,]/g, '');

      if (isNaN(aValue)) {
        return aValue.localeCompare(bValue);
      } else {
        return aValue - bValue;
      };
    });
  } else {
    item.direction = 'ASC';

    sortedArray = [...tableBody.rows].sort((a, b) => {
      const aValue = a.cells[index].innerText.replace(/[$,]/g, '');
      const bValue = b.cells[index].innerText.replace(/[$,]/g, '');

      if (isNaN(aValue)) {
        return bValue.localeCompare(aValue);
      } else {
        return bValue - aValue;
      };
    });
  }

  tableBody.append(...sortedArray);
});

tableBody.addEventListener('click', e => {
  e.stopPropagation();

  const row = e.target.closest('tr');
  const activeRow = document.querySelector('.active');

  if (!activeRow) {
    row.classList.add('active');
  } else {
    activeRow.classList.remove('active');
    row.classList.add('active');
  }
});

const pushNotification = (title, description, type) => {
  const divEl = document.createElement('div');
  const h2El = document.createElement('h2');
  const pEl = document.createElement('p');

  divEl.classList = 'notification';
  divEl.dataset.qa = 'notification';
  divEl.classList.add(type);
  h2El.classList = 'title';
  h2El.textContent = title;
  pEl.textContent = description;
  divEl.append(h2El);
  divEl.append(pEl);

  h2El.style.marginTop = '10px';
  h2El.style.marginBottom = '0';
  pEl.style.marginTop = '10px';
  pEl.style.marginBottom = '10px';

  body.append(divEl);

  setTimeout(() => {
    divEl.remove();
  }, 2000);
};

body.insertAdjacentHTML('beforeend',
  `<form class="new-employee-form">
      <label>Name:
        <input name="name" type="text" data-qa="name">
      </label>
      <label>Position:
        <input name="position" type="text" data-qa="position">
      </label>
      <label> Office:
        <select name="office" data-qa="office" >
         <option value="Tokyo">Tokyo</option>
         <option value="Singapore">Singapore</option>
         <option value="London">London</option>
         <option value="New York">New York</option>
         <option value="Edinburgh">Edinburgh</option>
         <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age:
        <input name="age" type="number" data-qa="age">
      </label>
      <label>Salary:
        <input name="salary" type="number" data-qa="salary">
      </label>
      <button>Save to table</button>
     </form>`
);

const form = document.querySelector('form');
const inputs = form.querySelectorAll('input');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const tr = document.createElement('tr');

  const formDataArray = [
    formData.get('name'),
    formData.get('position'),
    formData.get('office'),
    formData.get('age'),
    formData.get('salary'),
  ];

  if (formData.get('name').length < 4) {
    pushNotification('Name is too short!',
      'Name should have at least 4 letters.',
      'error');

    return;
  }

  if (!formData.get('name') || !formData.get('position')
    || !formData.get('age') || !formData.get('salary')) {
    pushNotification('Something went wrong...',
      'All fields must be filled',
      'error');

    return;
  }

  if (formData.get('age') < 18 || formData.get('age') > 90) {
    pushNotification('Age is incorrect',
      'Age must be between 18 and 90',
      'error');

    return;
  }

  for (let i = 0; i < formDataArray.length; i++) {
    const td = document.createElement('td');

    if (i === formDataArray.length - 1) {
      const num = parseInt(formDataArray[i]);

      td.textContent = `$${num.toLocaleString('en-US')}`;
    } else {
      td.textContent = formDataArray[i];
    }

    tr.append(td);
  }

  tableBody.append(tr);

  pushNotification('Success',
    'New data is already in table', 'success');

  inputs.forEach(input => {
    input.value = null;
  });
});
