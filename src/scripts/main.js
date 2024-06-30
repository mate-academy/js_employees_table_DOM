/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
'use strict';

const NAME = 'Name';
const POSITION = 'Position';
const OFFICE = 'Office';
const AGE = 'Age';
const SALARY = 'Salary';

const DONE = 'done';
const NOT_DONE = 'not-done';

const body = document.getElementsByTagName('body')[0];
const tbody = document.getElementsByTagName('tbody')[0];
const headers = document.querySelectorAll('th');
const topHeaders = Array.from(headers).slice(0, 5);
let table = tbody.querySelectorAll('tr');
const staff = [];

let isClickedName = false;
let isClickedPosition = false;
let isClickedOffice = false;
let isClickedAge = false;
let isClickedSalary = false;

table.forEach((row) => {
  const memberStaff = {};

  memberStaff.name = row.querySelectorAll('td')[0].textContent;
  memberStaff.position = row.querySelectorAll('td')[1].textContent;
  memberStaff.office = row.querySelectorAll('td')[2].textContent;
  memberStaff.age = row.querySelectorAll('td')[3].textContent;
  memberStaff.salary = row.querySelectorAll('td')[4].textContent;

  staff.push(memberStaff);
});

topHeaders.forEach((header) => {
  header.addEventListener('click', (event) => {
    switch (event.target.textContent) {
      case NAME:
        const acsSortedName = staff.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        const sortedByName = isClickedName
          ? acsSortedName.reverse()
          : acsSortedName;

        table.forEach((row, index) => {
          row.querySelectorAll('td')[0].textContent = sortedByName[index].name;

          row.querySelectorAll('td')[1].textContent =
            sortedByName[index].position;

          row.querySelectorAll('td')[2].textContent =
            sortedByName[index].office;

          row.querySelectorAll('td')[3].textContent = sortedByName[index].age;

          row.querySelectorAll('td')[4].textContent =
            sortedByName[index].salary;
        });

        isClickedName = !isClickedName;

        break;

      case POSITION:
        const acsSortedPosition = staff.sort((a, b) =>
          a.position.localeCompare(b.position),
        );

        const sortedByPosition = isClickedPosition
          ? acsSortedPosition.reverse()
          : acsSortedPosition;

        table.forEach((row, index) => {
          row.querySelectorAll('td')[0].textContent =
            sortedByPosition[index].name;

          row.querySelectorAll('td')[1].textContent =
            sortedByPosition[index].position;

          row.querySelectorAll('td')[2].textContent =
            sortedByPosition[index].office;

          row.querySelectorAll('td')[3].textContent =
            sortedByPosition[index].age;

          row.querySelectorAll('td')[4].textContent =
            sortedByPosition[index].salary;
        });

        isClickedPosition = !isClickedPosition;

        break;

      case OFFICE:
        const acsSortedOffice = staff.sort((a, b) =>
          a.office.localeCompare(b.office),
        );

        const sortedByOffice = isClickedOffice
          ? acsSortedOffice.reverse()
          : acsSortedOffice;

        table.forEach((row, index) => {
          row.querySelectorAll('td')[0].textContent =
            sortedByOffice[index].name;

          row.querySelectorAll('td')[1].textContent =
            sortedByOffice[index].position;

          row.querySelectorAll('td')[2].textContent =
            sortedByOffice[index].office;

          row.querySelectorAll('td')[3].textContent = sortedByOffice[index].age;

          row.querySelectorAll('td')[4].textContent =
            sortedByOffice[index].salary;
        });

        isClickedOffice = !isClickedOffice;
        break;

      case AGE:
        const acsSortedAge = staff.sort((a, b) => a.age - b.age);
        const sortedByAge = isClickedAge
          ? acsSortedAge.reverse()
          : acsSortedAge;

        table.forEach((row, index) => {
          row.querySelectorAll('td')[0].textContent = sortedByAge[index].name;

          row.querySelectorAll('td')[1].textContent =
            sortedByAge[index].position;

          row.querySelectorAll('td')[2].textContent = sortedByAge[index].office;

          row.querySelectorAll('td')[3].textContent = sortedByAge[index].age;

          row.querySelectorAll('td')[4].textContent = sortedByAge[index].salary;
        });

        isClickedAge = !isClickedAge;

        break;

      case SALARY:
        const acsSortedSalary = staff.sort(
          (a, b) =>
            a.salary.slice(1).replace(',', '') -
            b.salary.slice(1).replace(',', ''),
        );

        const sortedBySalary = isClickedSalary
          ? acsSortedSalary.reverse()
          : acsSortedSalary;

        table.forEach((row, index) => {
          row.querySelectorAll('td')[0].textContent =
            sortedBySalary[index].name;

          row.querySelectorAll('td')[1].textContent =
            sortedBySalary[index].position;

          row.querySelectorAll('td')[2].textContent =
            sortedBySalary[index].office;

          row.querySelectorAll('td')[3].textContent = sortedBySalary[index].age;

          row.querySelectorAll('td')[4].textContent =
            sortedBySalary[index].salary;
        });

        isClickedSalary = !isClickedSalary;
        break;
    }
  });
});

const setActiveClick = (prop) => {
  prop.forEach((cell) => {
    cell.addEventListener('click', () => {
      table.forEach((cell) => {
        cell.classList.remove('active');
      });

      cell.classList.add('active');
    });
  });
};

setActiveClick(table);

const addForm = () => {
  const containerForm = document.createElement('form');
  const submitButton = document.createElement('button');

  submitButton.setAttribute('submit', '');
  submitButton.textContent = 'Save to table';
  containerForm.classList.add('new-employee-form');

  topHeaders.forEach((header) => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    input.setAttribute('required', '');

    input.style.marginLeft = '16px';

    switch (header.textContent) {
      case NAME:
        label.textContent = `${header.textContent}:`;
        input.setAttribute('name', 'name');
        input.setAttribute('type', 'text');
        input.setAttribute('data-qa', 'name');

        label.appendChild(input);
        containerForm.appendChild(label);
        break;

      case POSITION:
        label.textContent = `${header.textContent}:`;
        input.setAttribute('name', 'position');
        input.setAttribute('type', 'text');
        input.setAttribute('data-qa', 'position');

        label.appendChild(input);
        containerForm.appendChild(label);
        break;

      case OFFICE:
        label.textContent = `${header.textContent}:`;

        const selectElement = document.createElement('select');
        const optionValues = [
          'Tokyo',
          'Singapore',
          'London',
          'Edinburgh',
          'San Francisco',
        ];

        optionValues.forEach((value) => {
          const option = document.createElement('option');

          option.textContent = value;
          option.value = value;

          selectElement.appendChild(option);
        });

        selectElement.setAttribute('name', 'office');
        selectElement.setAttribute('type', 'select');
        selectElement.setAttribute('data-qa', 'office');

        label.appendChild(selectElement);
        containerForm.appendChild(label);
        break;

      case AGE:
        label.textContent = `${header.textContent}:`;
        input.setAttribute('name', 'age');
        input.setAttribute('type', 'number');
        input.setAttribute('data-qa', 'age');
        input.setAttribute('min', '18');
        input.setAttribute('max', '90');

        label.appendChild(input);
        containerForm.appendChild(label);
        break;

      case SALARY:
        label.textContent = `${header.textContent}:`;
        input.setAttribute('name', 'salary');
        input.setAttribute('type', 'number');
        input.setAttribute('data-qa', 'salary');
        input.setAttribute('min', '1000');

        label.appendChild(input);
        containerForm.appendChild(label);
        break;
    }
  });

  containerForm.appendChild(submitButton);

  body.appendChild(containerForm);
};

const addNotification = (status) => {
  const mainBox = document.createElement('div');

  mainBox.setAttribute('data-qa', 'notification');
  mainBox.style.display = 'flex';
  mainBox.style.justifyContent = 'center';
  mainBox.style.alignItems = 'center';
  mainBox.style.position = 'absolute';
  mainBox.style.right = '45px';
  mainBox.style.top = '10px';
  mainBox.style.width = '500px';
  mainBox.style.height = '50px';

  switch (status) {
    case DONE:
      mainBox.style.backgroundColor = 'green';
      mainBox.textContent = 'new member staff added';
      mainBox.classList.add('success');

      break;

    case NOT_DONE:
      mainBox.style.backgroundColor = 'red';
      mainBox.classList.add('error');

      mainBox.textContent =
        'Age biggest 18 and lower 90, Name length must have 4';
      break;
  }

  body.appendChild(mainBox);

  setTimeout(() => {
    return body.removeChild(mainBox);
  }, 2000);
};

addForm();

const addedButton = document.getElementsByTagName('button')[0];

function formatToEU(number) {
  const formatter = new Intl.NumberFormat('en-GB'); // 'en-GB' represents English (United Kingdom), which uses comma as thousand separator and dot as decimal separator

  return formatter.format(number);
}

addedButton.addEventListener('click', (event) => {
  event.preventDefault();

  const form = document.getElementsByTagName('form')[0];
  const inputs = Array.from(form.elements).slice(0, -1);

  if (!form.checkValidity()) {
    return addNotification(NOT_DONE);
  }

  const newMember = {};

  for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];

    newMember[element.getAttribute('name')] = element.value;
  }

  const newRow = document.createElement('tr');

  for (const key of Object.keys(newMember)) {
    const newCell = document.createElement('td');

    if (key === 'salary') {
      newCell.textContent = `$${formatToEU(newMember[key])}`;
      newRow.appendChild(newCell);
      continue;
    }

    newCell.textContent = newMember[key];
    newRow.appendChild(newCell);
  }

  staff.push(newMember);
  tbody.appendChild(newRow);

  table = tbody.querySelectorAll('tr');

  console.log(table, staff);
  setActiveClick(table);
  form.reset();

  addNotification(DONE);
});
