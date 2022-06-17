'use strict';

const table = document.querySelector('table');
const tabBody = document.querySelector('tbody');
const body = document.querySelector('body');

table.addEventListener('click', eve => {
  const item = eve.target.closest('th');
  const idx = item.cellIndex;
  let sortArr = [];

  if (!('direction' in item)) {
    item.direction = 'ASC';
  }

  if (item.direction === 'ASC') {
    item.direction = 'DESC';

    sortArr = [...tabBody.rows].sort((a, b) => {
      const valueA = a.cells[idx].innerText.replace(/[$,]/g, '');
      const valueB = b.cells[idx].innerText.replace(/[$,]/g, '');

      if (isNaN(valueA)) {
        return valueB.localeCompare(valueA);
      } else {
        return valueB - valueA;
      };
    });
  }
  tabBody.append(...sortArr);
});

tabBody.addEventListener('click', eve => {
  eve.stopPropagation();

  const row = eve.target.closest('tr');
  const rowIsActive = document.querySelector('.active');

  if (!rowIsActive) {
    row.classList.add('active');
  } else {
    rowIsActive.classList.remove('active');
    row.classList.add('active');
  }
});

const addNotifications = (title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList = 'notification';
  div.dataset.qa = 'notification';
  div.classList.add(type);
  h2.classList = 'title';
  h2.textContent = title;
  p.textContent = description;
  div.append(h2);
  div.append(p);

  h2.style.marginTop = '10px';
  h2.style.marginBottom = '0';
  p.style.marginTop = '10px';
  p.style.marginBottom = '10px';

  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

body.insertAdjacentHTML('beforeend', `
<form class="new-employee-form">
  <label>Name: 
    <input name="name"
           type="text"
           data-qa="name"
           class="name"
           required
    >
  </label>
  <label>Position: 
    <input name="position"
           type="text"
           data-qa="position"
           class="position"
           required
    >
  </label>
  <label>Office: 
    <select name="office"
           data-qa="office"
           class="office"
           required
    >
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input name="age"
           type="number"
           data-qa="age"
           class="age"
           required
    >
  </label>
  <label>Salary: 
    <input name="salary"
           type="number"
           data-qa="salary"
           class="salary"
           required
    >
  </label>
  <button class="button" type="submit">Save to table</button>
</form>
`);

const forms = document.querySelector('form');
const inputs = forms.querySelectorAll('input');

forms.addEventListener('submit', even => {
  even.preventDefault();

  const formData = new FormData(forms);
  const tr = document.createElement('tr');
  const formDataArr = [
    formData.get('name'),
    formData.get('position'),
    formData.get('office'),
    formData.get('age'),
    formData.get('salary'),
  ];

  if (formData.get('name').length < 4) {
    addNotifications('Name is too short!',
      'Name should have at least 4 letters.',
      'error');

    return;
  }

  if (!formData.get('name') || !formData.get('position')
    || !formData.get('age') || !formData.get('salary')) {
    addNotifications('Something wrong...',
      'All fields must be filled',
      'error');

    return;
  }

  if (formData.get('age') < 18 || formData.get('age') > 90) {
    addNotifications('Age is incorrect',
      'Age must be between 18 and 90',
      'error');

    return;
  }

  for (let i = 0; i < formDataArr.length; i++) {
    const td = document.createElement('td');

    if (i === formDataArr.length - 1) {
      const num = parseInt(formDataArr[i]);

      td.textContent = `$${num.toLocaleString('en-US')}`;
    } else {
      td.textContent = formDataArr[i];
    }

    tr.append(td);
  };

  tabBody.append(tr);

  addNotifications('Success',
    'New data is already in table', 'success');

  inputs.forEach(input => {
    input.value = null;
  });
});
