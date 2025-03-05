'use strict';

const formHTML = `
  <form
    action="#"
    class="new-employee-form"
    name="employee"
    novalidate
  >
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
        minlength="4"
      />
    </label>
    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
      />
    </label>

    <label>
      Office:
      <select
        name="office"
        id="Office"
        data-qa="office"
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

    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        required
        min="18"
        max="90"
      />
    </label>
    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
      />
    </label>

    <button type="submit">Save to table</button>
  </form>
`;

document.body.insertAdjacentHTML('beforeend', formHTML);

const theadElement = document.querySelector('thead');
const tbodyElement = document.querySelector('tbody');
const formElement = document.forms.employee;
let eventTarget = null;

theadElement.addEventListener('click', (e) => {
  const personElements = [...document.querySelectorAll('tbody tr')];

  if (e.target === eventTarget) {
    personElements.reverse();
  } else {
    if (e.target.cellIndex <= 2) {
      personElements.sort((a, b) => {
        return a.children[e.target.cellIndex].textContent.localeCompare(
          b.children[e.target.cellIndex].textContent,
        );
      });
    } else {
      personElements.sort(
        (a, b) =>
          a.children[e.target.cellIndex].textContent.replace(/\D/g, '') -
          b.children[e.target.cellIndex].textContent.replace(/\D/g, ''),
      );
    }
  }

  eventTarget = e.target;

  tbodyElement.append(...personElements);
});

tbodyElement.addEventListener('click', (e) => {
  const personElements = [...document.querySelectorAll('tbody tr')];

  personElements.forEach((el) => el.classList.remove('active'));
  e.target.parentElement.classList.add('active');
});

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const validationElement = document.createElement('div');

  validationElement.setAttribute('data-qa', 'notification');

  const validTitleElem = document.createElement('span');

  validTitleElem.classList.add('title');

  if (!formElement.checkValidity()) {
    validationElement.classList.add('notification', 'error');
    validTitleElem.textContent = 'Error';
  } else {
    validationElement.classList.add('notification', 'success');
    validTitleElem.textContent = 'success';

    const myFormData = new FormData(formElement);
    const objFormData = Object.fromEntries(myFormData);

    const trElem = document.createElement('tr');

    for (const key in objFormData) {
      const tdElem = document.createElement('td');

      tdElem.textContent =
        key === 'salary'
          ? `$${(+objFormData[key]).toLocaleString('en-US')}`
          : objFormData[key];

      trElem.append(tdElem);
    }

    tbodyElement.append(trElem);

    formElement.reset();
  }

  validationElement.append(validTitleElem);
  document.body.append(validationElement);
});
