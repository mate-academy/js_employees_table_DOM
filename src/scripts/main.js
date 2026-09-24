'use strict';

let lastColumn = -1;
let active = true;

function sortListener() {
  theadTr.addEventListener('click', (e) => {
    switch (e.target.textContent) {
      case 'Name':
        sortText(0);
        break;
      case 'Position':
        sortText(1);
        break;
      case 'Office':
        sortText(2);
        break;
      case 'Age':
        sortNum(3);
        break;
      case 'Salary':
        sortNum(4);
        break;
    }
  });
}

function sortText(index) {
  if (lastColumn === index) {
    active = !active;
  } else {
    lastColumn = index;
    active = true;
  }

  if (active) {
    tbodyTrs.sort((a, b) => {
      const aChildrenText = a.children[index].textContent;
      const bChildrenText = b.children[index].textContent;

      return aChildrenText.localeCompare(bChildrenText);
    });
  } else {
    tbodyTrs.sort((a, b) => {
      const aChildrenText = a.children[index].textContent;
      const bChildrenText = b.children[index].textContent;

      return bChildrenText.localeCompare(aChildrenText);
    });
  }

  tbodyTrs.forEach((tr) => {
    tbody.append(tr);
  });
}

function toNumber(line) {
  return parseInt(line.split('$').join('').split(',').join(''));
}

function sortNum(index) {
  if (lastColumn === index) {
    active = !active;
  } else {
    lastColumn = index;
    active = true;
  }

  if (active) {
    tbodyTrs.sort((a, b) => {
      const aChildrenText = a.children[index].textContent;
      const bChildrenText = b.children[index].textContent;

      return toNumber(aChildrenText) - toNumber(bChildrenText);
    });
  } else {
    tbodyTrs.sort((a, b) => {
      const aChildrenText = a.children[index].textContent;
      const bChildrenText = b.children[index].textContent;

      return toNumber(bChildrenText) - toNumber(aChildrenText);
    });
  }

  tbodyTrs.forEach((tr) => {
    tbody.append(tr);
  });
}

function selectListener() {
  let anotherActiveRow = false;

  tbody.addEventListener('click', (e) => {
    const currRow = e.target.closest('tr');

    if (anotherActiveRow) {
      const activeRow = tbody.querySelector('.active');

      activeRow.classList.remove('active');

      anotherActiveRow = false;
    }

    currRow.classList.add('active');
    anotherActiveRow = true;
  });
}

function addForm() {
  const formBlock = document.createElement('form');

  formBlock.classList.add('new-employee-form');

  const inputName = document.createElement('input');
  const labelName = document.createElement('label');

  labelName.textContent = 'Name: ';
  inputName.setAttribute('name', 'name');
  inputName.setAttribute('type', 'text');
  inputName.setAttribute('data-qa', 'name');
  labelName.append(inputName);

  const inputPosition = document.createElement('input');
  const labelPosition = document.createElement('label');

  labelPosition.textContent = 'Position: ';
  inputPosition.setAttribute('name', 'position');
  inputPosition.setAttribute('type', 'text');
  inputPosition.setAttribute('data-qa', 'position');
  labelPosition.append(inputPosition);

  const selectOffice = document.createElement('select');
  const labelOffice = document.createElement('label');

  const optionTokyo = document.createElement('option');
  const optionSingapore = document.createElement('option');
  const optionLondon = document.createElement('option');
  const optionNewYork = document.createElement('option');
  const optionEdinburgh = document.createElement('option');
  const optionSanFrancisco = document.createElement('option');

  labelOffice.textContent = 'Office: ';
  selectOffice.setAttribute('name', 'office');
  selectOffice.setAttribute('data-qa', 'office');

  optionTokyo.textContent = 'Tokyo';
  optionSingapore.textContent = 'Singapore';
  optionLondon.textContent = 'London';
  optionNewYork.textContent = 'New York';
  optionEdinburgh.textContent = 'Edinburgh';
  optionSanFrancisco.textContent = 'San Francisco';

  selectOffice.append(optionTokyo);
  selectOffice.append(optionSingapore);
  selectOffice.append(optionLondon);
  selectOffice.append(optionNewYork);
  selectOffice.append(optionEdinburgh);
  selectOffice.append(optionSanFrancisco);

  labelOffice.append(selectOffice);

  const inputAge = document.createElement('input');
  const labelAge = document.createElement('label');

  labelAge.textContent = 'Age: ';
  inputAge.setAttribute('name', 'age');
  inputAge.setAttribute('type', 'number');
  inputAge.setAttribute('data-qa', 'age');
  labelAge.append(inputAge);

  const inputSalary = document.createElement('input');
  const labelSalary = document.createElement('label');

  labelSalary.textContent = 'Salary: ';
  inputSalary.setAttribute('name', 'salary');
  inputSalary.setAttribute('type', 'number');
  inputSalary.setAttribute('data-qa', 'salary');
  labelSalary.append(inputSalary);

  const buttonSubmit = document.createElement('button');

  buttonSubmit.setAttribute('type', 'submit');
  buttonSubmit.textContent = 'Save to table';

  formBlock.append(labelName);
  formBlock.append(labelPosition);
  formBlock.append(labelOffice);
  formBlock.append(labelAge);
  formBlock.append(labelSalary);
  formBlock.append(buttonSubmit);

  document.body.append(formBlock);
}

function checkNameForNewEmployee(line, inputString) {
  if (inputString.length < 4) {
    return 'Error';
  } else {
    const tdName = document.createElement('td');

    tdName.textContent = inputString;

    line.append(tdName);

    return '';
  }
}

function checkAgeForNewEmployee(line, inputString) {
  if (Number(inputString) < 18 || Number(inputString) > 90) {
    return 'Error';
  } else {
    const tdAge = document.createElement('td');

    tdAge.textContent = Number(inputString);

    line.append(tdAge);

    return '';
  }
}

function toSalaryFormat(line) {
  const salaryFormatNumber = [];

  for (let i = 0; i < line.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      salaryFormatNumber.push(',');
      salaryFormatNumber.push(line[line.length - 1 - i]);
    } else {
      salaryFormatNumber.push(line[line.length - 1 - i]);
    }
  }
  salaryFormatNumber.push('$');

  return salaryFormatNumber.reverse().join('');
}

function showNotification(result) {
  const notification = document.createElement('div');
  const title = document.createElement('h3');
  const description = document.createElement('p');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');

  if (result === 'success') {
    notification.classList.add('success');

    title.textContent = 'Success!';
    description.textContent = 'Employee was added to the table.';
  } else if (result === 'error') {
    notification.classList.add('error');

    title.textContent = 'Something went wrong';
    description.textContent = 'Please check the entered data.';
  }

  notification.append(title);
  notification.append(description);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function formListener() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = e.target.querySelectorAll('input, select');

    const masValues = [...formData].map((data) => data.value);

    if (masValues.every((line) => line.length > 0)) {
      addNewEmployeeToTable(formData);
    } else {
      showNotification('error');
    }
  });
}

function addNewEmployeeToTable(listOfLabels) {
  const tr = document.createElement('tr');
  let success = '';

  listOfLabels.forEach((label) => {
    if (success !== 'Error') {
      switch (label.name) {
        case 'name':
          success = checkNameForNewEmployee(tr, label.value);
          break;
        case 'position':
          const tdPosition = document.createElement('td');

          tdPosition.textContent = label.value;

          tr.append(tdPosition);
          break;
        case 'office':
          const tdOffice = document.createElement('td');

          tdOffice.textContent = label.value;

          tr.append(tdOffice);
          break;
        case 'age':
          success = checkAgeForNewEmployee(tr, label.value);
          break;
        case 'salary':
          const tdSalary = document.createElement('td');

          tdSalary.textContent = toSalaryFormat(label.value);

          tr.append(tdSalary);
          break;
      }
    }
  });

  if (success !== 'Error') {
    table.append(tr);
    tbodyTrs.push(tr);

    showNotification('success');
  } else {
    showNotification('error');
  }
}

const table = document.querySelector('table');

const theadTr = table.querySelector('thead').querySelector('tr');

const tbody = table.querySelector('tbody');
const tbodyTrs = [...table.querySelector('tbody').querySelectorAll('tr')];

sortListener();

selectListener();

addForm();

const form = document.querySelector('form');

formListener();
