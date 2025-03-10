'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
let isACS = true;
const tbody = table.querySelector('tbody');
const rows = [...tbody.rows];

function createForm() {
  const form = document.createElement('form');
  const nameInput = document.createElement('input');
  const positionInput = document.createElement('input');
  const ageInput = document.createElement('input');
  const salaryInput = document.createElement('input');
  const officeSelect = document.createElement('select');
  const buttonSave = document.createElement('button');
  const inputFields = ['name', 'position', 'office', 'age', 'salary'];
  const offices = [
    `Tokyo`,
    `Singapore`,
    `London`,
    `New York`,
    `Edinburgh`,
    `San Francisco`,
  ];

  buttonSave.textContent = 'Save to table';

  buttonSave.addEventListener('click', () => {
    event.preventDefault();
  });

  ageInput.type = 'number';
  salaryInput.type = 'number';

  offices.forEach((office) => {
    const officeOption = document.createElement('option');

    officeOption.textContent = office;
    officeSelect.append(officeOption);
  });

  form.classList.add('new-employee-form');

  form.appendChild(nameInput);
  form.appendChild(positionInput);
  form.appendChild(officeSelect);
  form.appendChild(ageInput);
  form.appendChild(salaryInput);
  form.appendChild(buttonSave);
  body.appendChild(form);

  const inputs = form.querySelectorAll('form > *');

  inputs.forEach((input, i) => {
    const label = document.createElement('label');

    label.textContent =
      inputFields[i].slice(0, 1).toUpperCase() + inputFields[i].slice(1);
    input.replaceWith(label);
    label.append(input);

    input.setAttribute('data-qa', inputFields[i]);
    input.setAttribute('name', inputFields[i]);
    input.setAttribute('required', true);
  });
}

createForm();

table.querySelector('thead tr').addEventListener('click', (e) => {
  sort(e);
});

table.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', (e) => {
    if (!row) {
      return;
    }

    rows.forEach((el) => el.classList.remove('active'));

    row.classList.toggle('active');
  });
});

function sort(e) {
  const title = e.target.textContent;
  const tHead = table.querySelector('thead');
  const headers = [...tHead.querySelectorAll('tr th')];
  const titles = [];

  headers.forEach((header) => {
    titles.push(header.innerText);
  });

  const indexTitle = titles.indexOf(title);

  rows.sort((a, b) => {
    const aEl = a.children[indexTitle].textContent;
    const bEl = b.children[indexTitle].textContent;

    if (title === 'Salary') {
      const aSalary = parseFloat(
        a.children[indexTitle].textContent.split('$')[1],
      );
      const bSalary = parseFloat(
        b.children[indexTitle].textContent.split('$')[1],
      );

      return isACS ? aSalary - bSalary : bSalary - aSalary;
    }

    return isACS ? aEl.localeCompare(bEl) : bEl.localeCompare(aEl);
  });

  rows.forEach((row) => {
    tbody.append(row);
  });

  isACS = !isACS;
}
