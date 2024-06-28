'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

// #region sorting

const headings = document.querySelectorAll('th');
const footerHeadings = document.querySelectorAll('tfoot th');
const rows = [...tbody.querySelectorAll('tr')];

const sortDirections = Array.from({ length: headings.length }, () => 1);

headings.forEach((heading, index) => {
  heading.addEventListener('click', () => {
    sortColumn(index);
  });
});

footerHeadings.forEach((footerHeading, index) => {
  footerHeading.addEventListener('click', () => {
    sortColumn(index);
  });
});

function sortColumn(index) {
  sortDirections[index] *= -1;

  rows.sort((a, b) => {
    const aParams = a.cells[index].textContent;
    const bParams = b.cells[index].textContent;

    return (
      sortDirections[index] *
      aParams.localeCompare(bParams, undefined, { numeric: true })
    );
  });

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.append(row));
}

// #endregion

// #region active row
tbody.addEventListener('click', activateRow);

function activateRow(e) {
  const arrOfRows = [...tbody.querySelectorAll('tr')];

  arrOfRows.forEach((row) => {
    row.className = '';
  });

  e.target.closest('tr').className = 'active';
}

// #endregion

// #region create form

const newCustomerForm = createForm();

document.body.appendChild(newCustomerForm);

function createForm() {
  const form = document.createElement('form');

  form.setAttribute('class', 'new-employee-form');

  const labelName = createInput('name');
  const labelPosition = createInput('position');
  const labelAge = createInput('age', 'number');
  const labelSalary = createInput('salary', 'number');
  const select = createSelect('office');
  const button = createButton();

  form.insertAdjacentElement('beforeend', labelName);
  form.insertAdjacentElement('beforeend', labelPosition);
  form.insertAdjacentElement('beforeend', select);
  form.insertAdjacentElement('beforeend', labelAge);
  form.insertAdjacentElement('beforeend', labelSalary);
  form.insertAdjacentElement('beforeend', button);

  return form;
}

function createInput(inputName, type = 'text') {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const labelName = inputName[0].toUpperCase() + inputName.slice(1);

  input.name = inputName;
  input.type = type;
  input.dataset.qa = inputName;

  label.insertAdjacentText('afterbegin', `${labelName}`);
  label.insertAdjacentElement('beforeend', input);

  return label;
}

function createSelect(nameSelect) {
  const labelSelect = document.createElement('label');
  const select = document.createElement('select');

  select.name = nameSelect;
  select.dataset.qa = 'office';

  const labelText = nameSelect[0].toUpperCase() + nameSelect.slice(1);

  labelSelect.insertAdjacentText('afterbegin', labelText);

  const options = [
    `Tokyo`,
    `Singapore`,
    `London`,
    `New York`,
    `Edinburgh`,
    `San Francisco`,
  ].map((city) => {
    const option = document.createElement('option');

    option.value = city;
    option.insertAdjacentText('beforeend', city);

    return option;
  });

  options.forEach((option) => {
    select.insertAdjacentElement('beforeend', option);
  });

  labelSelect.insertAdjacentElement('beforeend', select);

  return labelSelect;
}

function createButton() {
  const button = document.createElement('button');

  button.type = 'submit';

  button.insertAdjacentText('beforeend', 'Save to table');

  return button;
}

// #endregion
