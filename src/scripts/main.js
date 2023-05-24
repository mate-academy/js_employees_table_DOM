'use strict';

const table = document.querySelector('table');

table.tHead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const tableBody = [...table.tBodies][0];

  const sorted = [ ...tableBody.rows ].sort((a, b) => {
    const aText = a.cells[index].innerText.replace(/\W/g, '');
    const bText = b.cells[index].innerText.replace(/\W/g, '');
    let result;

    if (!e.target.classList.contains('sort')) {
      result = !isNaN(parseFloat(aText))
        ? +aText - +bText
        : aText.localeCompare(bText);
    } else {
      result = !isNaN(parseFloat(aText))
        ? +bText - +aText
        : bText.localeCompare(aText);
    }

    return result;
  });

  e.target.classList.toggle('sort');

  tableBody.append(...sorted);
});

table.tBodies[0].addEventListener('click', (e) => {
  const allOtherTr = [ ...table.tBodies[0].children ].filter(tr => {
    return (tr !== e.target.parentNode);
  });

  allOtherTr.forEach(tr => {
    tr.classList.remove('active');
  });

  e.target.parentNode.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('action', '#');
form.setAttribute('method', 'post');

table.after(form);

form.insertAdjacentHTML('beforeend',
  `<label>Name:
    <input
      name="name"
      type="text"
      required
      data-qa="name">
  </label>

  <label>Position:
    <input
      name="position"
      type="text"
      required
      data-qa="position"
    >
  </label>

  <label>Office:
    <select
      name="office"
      required
      data-qa="office"
    >
      <option value="" disabled selected></option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label>Age:
    <input
      name="age"
      type="number"
      required
      data-qa="age"
    >
  </label>

  <label>Salary:
    <input
      name="salary"
      type="number"
      required
      data-qa="salary"
    >
  </label>

<button type="submit">Save to table</button>`);

const submitBtn = document.querySelector('button');

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const dataObject = Object.fromEntries(formData.entries());

  if (dataObject.name.length < 4) {
    showNotification('Incorrect name', 'error',
      'Name should have more than 4 letters');
  } else if (Number(dataObject.age) < 18 || Number(dataObject.age) > 90) {
    showNotification('Incorrect age', 'error',
      'Age must be between 18 to 90. Please, enter correct number.');
  } else if (dataObject.office === '' || dataObject.position === '') {
    showNotification('Empty fiels', 'error',
      'No empty fields allowed');
  } else if (dataObject.salary < 0) {
    showNotification('Incorrect salary', 'error',
      'No negative numbers allowed. Please, enter correct number');
  } else {
    showNotification('Success!', 'success', 'New employee added');

    const salary = Number(form.salary.value).toLocaleString('en-US');

    table.tBodies[0].insertAdjacentHTML('beforeend',
      `<tr>
         <td>${form.name.value}</td>
         <td>${form.position.value}</td>
         <td>${form.office.value}</td>
         <td>${form.age.value}</td>
         <td>$${salary}</td>
        </tr>`
    );
  }
});

function showNotification(type, state, description) {
  const body = document.querySelector('body');

  body.insertAdjacentHTML(`beforeend`, `
    <div class="notification ${state}"
      data-qa="notification"
    >
      <h2 class="title">
        ${type}
      </h2>

      <p>
        ${description}
      </p>
    </div>`);

  const notification = document.querySelectorAll('.notification');

  setTimeout(() => {
    notification.forEach(message => message.remove());
  }, 2000);
}
