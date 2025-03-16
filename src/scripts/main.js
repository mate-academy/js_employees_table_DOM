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

  buttonSave.addEventListener('click', (cklicker) => {
    cklicker.preventDefault();

    const ageValid = ageInput.value < 18 || ageInput.value > 90;

    let notificationDesc;
    let typeStatus = 'error';

    if (
      nameInput.value === '' ||
      positionInput.value === '' ||
      ageInput.value === '' ||
      salaryInput.value === ''
    ) {
      notificationDesc = 'All fields should be filled';
      showNotification(typeStatus, 'Error', notificationDesc);

      return;
    }

    if (nameInput.value.length < 4) {
      notificationDesc = 'Name should contain more than 4 letters';
      showNotification(typeStatus, 'Error', notificationDesc);

      return;
    }

    if (ageValid) {
      notificationDesc = 'Your age is not available';
      showNotification(typeStatus, 'Error', notificationDesc);

      return;
    }

    if (
      nameInput.value !== '' ||
      positionInput.value !== '' ||
      ageInput.value !== '' ||
      salaryInput.value !== ''
    ) {
      const newRow = document.createElement('tr');
      const tdName = document.createElement('td');
      const tdPosition = document.createElement('td');
      const tdOffice = document.createElement('td');
      const tdAge = document.createElement('td');
      const tdSalary = document.createElement('td');

      typeStatus = 'success';
      notificationDesc = 'Congratulations! New employee is added';
      showNotification(typeStatus, 'Success', notificationDesc);

      tdName.textContent = nameInput.value.trim();
      tdPosition.textContent = positionInput.value.trim();
      tdOffice.textContent = officeSelect.value.trim();
      tdAge.textContent = ageInput.value.trim();

      tdSalary.textContent = `$${salaryInput.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

      newRow.appendChild(tdName);
      newRow.appendChild(tdPosition);
      newRow.appendChild(tdOffice);
      newRow.appendChild(tdAge);
      newRow.appendChild(tdSalary);

      tbody.appendChild(newRow);

      rows.push(newRow);

      nameInput.value = '';
      positionInput.value = '';
      ageInput.value = '';
      salaryInput.value = '';
    }
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

    if (!inputFields[i]) {
      return;
    }

    label.textContent =
      inputFields[i].slice(0, 1).toUpperCase() + inputFields[i].slice(1);
    input.replaceWith(label);
    label.append(input);

    input.setAttribute('data-qa', inputFields[i]);
    input.setAttribute('name', inputFields[i]);
    input.setAttribute('required', 'true');
  });
}

createForm();

table.querySelector('thead tr').addEventListener('click', (e) => {
  sort(e);
});

function chooseRow() {
  table.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => {
      const activeRows = table.querySelectorAll('tbody tr.active');

      activeRows.forEach((el) => el.classList.remove('active'));

      row.classList.toggle('active');
    });
  });
}

chooseRow();

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
      const aSalary = parseFloat(aEl.replace(/[$,]/g, ''));
      const bSalary = parseFloat(bEl.replace(/[$,]/g, ''));

      return isACS ? aSalary - bSalary : bSalary - aSalary;
    }

    return isACS ? aEl.localeCompare(bEl) : bEl.localeCompare(aEl);
  });

  rows.forEach((row) => {
    tbody.append(row);
  });

  isACS = !isACS;
}

function showNotification(type, title, description) {
  const notBlock = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const descriptionMessage = document.createElement('p');

  if (type === 'success') {
    notBlock.classList.add('success');
    titleMessage.innerText = title;
    descriptionMessage.innerText = description;
  }

  if (type === 'error') {
    notBlock.classList.add('error');
    titleMessage.innerText = title;
    descriptionMessage.innerText = description;
  }

  notBlock.classList.add('notification');
  titleMessage.classList.add('title');
  notBlock.setAttribute('data-qa', 'notification');

  body.appendChild(notBlock);
  notBlock.appendChild(titleMessage);
  notBlock.appendChild(descriptionMessage);

  setTimeout(() => {
    notBlock.style.display = 'none';
  }, 2000);
}

function changeCell() {
  table.querySelectorAll('tr td').forEach((cell) => {
    cell.addEventListener('dblclick', (e) => {
      const input = document.createElement('input');
      const initialValue = e.target.textContent;

      input.value = e.target.textContent;

      e.target.replaceWith(input);
      input.classList.add('cell-input');
      input.focus();

      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          save(ev);
        }
      });

      input.addEventListener('blur', (ev) => {
        save(ev);
      });

      function save(ev) {
        ev.preventDefault();

        const td = document.createElement('td');

        td.textContent = input.value.trim() || initialValue;
        input.replaceWith(td);
        changeCell();
      }
    });
  });
}

changeCell();
