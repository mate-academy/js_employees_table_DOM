'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

document.body.insertAdjacentHTML('beforeend', `
  <form action="/" method="get" class="new-employee-form">
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
        minlength="4"
      >
    </label>
    <label>
      Position:
      <input name="position" type="text" data-qa="position" required>
    </label>
    <label for="office">
      Office:
      <select id="office" data-qa="office" required>
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
      <input name="age" type="number" data-qa="age" required min="18" max="90">
    </label>
    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="submit"> Save to table </button>
  </form>
`);

const form = document.forms[0];
const select = form.querySelector('[data-qa="office"]');

form.name.addEventListener('submit', e => {
  if (!form.name.validity.valid) {
    form.name.setCustomValidity(
      'Error! Less 4 letters are entered in the field'
    );
  }
});

form.age.addEventListener('submit', e => {
  if (!form.age.validity.valid) {
    form.age.setCustomValidity(
      'Error! Age range should be from 18 to 90 years'
    );
  }
});

const createRow = (...arg) => {
  const firstField = form.name.value;
  const secondField = form.position.value;
  const thirdField = select.value;
  const fourthField = form.age.value;
  const fifthField = parseFloat(form.salary.value);
  const format = fifthField.toLocaleString('en-US');

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${firstField}</td>
      <td>${secondField}</td>
      <td>${thirdField}</td>
      <td>${fourthField}</td>
      <td>$${format}</td>
    </tr>
  `);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  createRow();
  e.target.reset();
});

let toggleSwitch = true;

thead.addEventListener('click', (e) => {
  const item = e.target;
  const cellIndex = item.cellIndex;

  let data = [...tbody.children];

  data.sort((a, b) => {
    const contentA = a.cells[cellIndex].textContent;
    const contentB = b.cells[cellIndex].textContent;

    if (contentA.toUpperCase() !== contentA.toLowerCase()) {
      return contentA.localeCompare(contentB);
    }

    if (parseInt(contentA)) {
      return contentA - contentB;
    } else {
      return parseInt(contentA.slice(1)) - parseInt(contentB.slice(1));
    }
  });

  if (!toggleSwitch) {
    data = data.reverse();
  }

  toggleSwitch = !toggleSwitch;

  data.forEach((elem, i) => {
    elem.innerHTML = data[i].innerHTML;
  });

  tbody.append(...data);
});

tbody.addEventListener('dblclick', (e) => {
  const item = e.target;
  const targetCell = item.cellIndex;
  const prevValue = item.innerText;
  const normValue = prevValue.replace(/[$,]/g, '');
  const targetInput
    = form.querySelectorAll('input')[targetCell].cloneNode(true);

  targetInput.classList.add('cell-input');
  targetInput.value = normValue;
  item.firstChild.replaceWith(targetInput);
  targetInput.focus();
});
