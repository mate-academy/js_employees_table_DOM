'use strict';

const tbody = document.querySelector('tbody');

const thead = document.querySelector('thead');

const thCollection = document.querySelectorAll('th');

for (const currTh of thCollection) {
  currTh.setAttribute('data-state', 'unsorted');
}

function ascSortStringlocaleCompare(index) {
  const tbodyRows = document.querySelectorAll('tbody tr');
  const rowsArray = Array.from(tbodyRows);

  rowsArray.sort((a, b) => {
    const ageA = a.cells[index].innerHTML;

    const ageB = b.cells[index].innerHTML;

    return ageA.localeCompare(ageB);
  });

  rowsArray.forEach((row) => tbody.appendChild(row));
}

function descSortStringlocaleCompare(index) {
  const tbodyRows = document.querySelectorAll('tbody tr');
  const rowsArray = Array.from(tbodyRows);

  rowsArray.sort((a, b) => {
    const ageA = a.cells[index].innerHTML;

    const ageB = b.cells[index].innerHTML;

    return ageB.localeCompare(ageA);
  });

  rowsArray.forEach((row) => tbody.appendChild(row));
}

function ascSortAge(index) {
  const tbodyRows = document.querySelectorAll('tbody tr');
  const rowsArray = Array.from(tbodyRows);

  rowsArray.sort((a, b) => {
    const ageA = Number(a.cells[index].innerHTML);
    const ageB = Number(b.cells[index].innerHTML);

    return ageA - ageB;
  });

  rowsArray.forEach((row) => tbody.appendChild(row));
}

function descSortAge(index) {
  const tbodyRows = document.querySelectorAll('tbody tr');
  const rowsArray = Array.from(tbodyRows);

  rowsArray.sort((a, b) => {
    const ageA = Number(a.cells[index].innerHTML);
    const ageB = Number(b.cells[index].innerHTML);

    return ageB - ageA;
  });

  rowsArray.forEach((row) => tbody.appendChild(row));
}

function ascSortSalary(index) {
  const tbodyRows = document.querySelectorAll('tbody tr');
  const rowsArray = Array.from(tbodyRows);

  rowsArray.sort((a, b) => {
    const srA = parseInt(a.cells[index].innerHTML.replace(/[$,]/g, ''), 10);
    const srB = parseInt(b.cells[index].innerHTML.replace(/[$,]/g, ''), 10);

    return srA - srB;
  });

  rowsArray.forEach((row) => tbody.appendChild(row));
}

function descSortSalary(index) {
  const tbodyRows = document.querySelectorAll('tbody tr');
  const rowsArray = Array.from(tbodyRows);

  rowsArray.sort((a, b) => {
    const srA = parseInt(a.cells[index].innerHTML.replace(/[$,]/g, ''), 10);
    const srB = parseInt(b.cells[index].innerHTML.replace(/[$,]/g, ''), 10);

    return srB - srA;
  });

  rowsArray.forEach((row) => tbody.appendChild(row));
}

thead.addEventListener('click', function (ev) {
  let index;

  switch (ev.target.innerHTML) {
    case 'Name':
      index = 0;
      break;
    case 'Position':
      index = 1;
      break;
    case 'Office':
      index = 2;
      break;
    case 'Age':
      index = 3;
      break;
    case 'Salary':
      index = 4;
      break;
  }

  switch (index) {
    case 3:
      switch (ev.target.dataset.state) {
        case 'unsorted':
          ev.target.setAttribute('data-state', 'ascending');
          ascSortAge(index);
          break;
        case 'ascending':
          ev.target.setAttribute('data-state', 'descending');
          descSortAge(index);
          break;
        case 'descending':
          ev.target.setAttribute('data-state', 'ascending');
          ascSortAge(index);
          break;
      }
      break;

    case 4:
      switch (ev.target.dataset.state) {
        case 'unsorted':
          ev.target.setAttribute('data-state', 'ascending');
          ascSortSalary(index);
          break;
        case 'ascending':
          ev.target.setAttribute('data-state', 'descending');
          descSortSalary(index);
          break;
        case 'descending':
          ev.target.setAttribute('data-state', 'ascending');
          ascSortSalary(index);
          break;
      }
      break;

    default:
      switch (ev.target.dataset.state) {
        case 'unsorted':
          ev.target.setAttribute('data-state', 'ascending');
          ascSortStringlocaleCompare(index);
          break;
        case 'ascending':
          ev.target.setAttribute('data-state', 'descending');
          descSortStringlocaleCompare(index);
          break;
        case 'descending':
          ev.target.setAttribute('data-state', 'ascending');
          ascSortStringlocaleCompare(index);
          break;
      }
      break;
  }
});

tbody.addEventListener('click', function (ev) {
  const tr = ev.target.closest('tr');

  if (tr) {
    const tbodyRows = document.querySelectorAll('tbody tr');

    for (const row of tbodyRows) {
      if (row.classList.contains('active')) {
        row.classList.remove('active');
      }
    }

    tr.classList.add('active');
  }
});

const body = document.querySelector('body');

const form = document.createElement('form');

form.classList.add('new-employee-form');
body.append(form);

const nameLabel = document.createElement('label');

nameLabel.innerHTML = 'Name:';
nameLabel.setAttribute('for', 'name');
form.append(nameLabel);

const nameInput = document.createElement('input');

nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('id', 'name');
nameInput.setAttribute('required', '');
nameLabel.append(nameInput);

const positionLabel = document.createElement('label');

positionLabel.innerHTML = 'Position:';
positionLabel.setAttribute('for', 'position');
form.append(positionLabel);

const positionInput = document.createElement('input');

positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('id', 'position');
positionInput.setAttribute('required', '');
positionLabel.append(positionInput);

const officeLabel = document.createElement('label');

officeLabel.innerHTML = 'Office:';
officeLabel.setAttribute('for', 'office');
form.append(officeLabel);

const officeInput = document.createElement('select');

officeInput.setAttribute('data-qa', 'office');
officeInput.setAttribute('id', 'office');
officeInput.setAttribute('required', '');
officeLabel.append(officeInput);

const optionMakeChoise = document.createElement('option');

optionMakeChoise.setAttribute('value', '');
optionMakeChoise.innerHTML = '-- Choose a city --';
officeInput.append(optionMakeChoise);

const optionTokyo = document.createElement('option');

optionTokyo.setAttribute('value', 'Tokyo');
optionTokyo.innerHTML = 'Tokyo';
officeInput.append(optionTokyo);

const optionSingapore = document.createElement('option');

optionSingapore.setAttribute('value', 'Singapore');
optionSingapore.innerHTML = 'Singapore';
officeInput.append(optionSingapore);

const optionLondon = document.createElement('option');

optionLondon.setAttribute('value', 'London');
optionLondon.innerHTML = 'London';
officeInput.append(optionLondon);

const optionNewYork = document.createElement('option');

optionNewYork.setAttribute('value', 'New York');
optionNewYork.innerHTML = 'New York';
officeInput.append(optionNewYork);

const optionEdinburgh = document.createElement('option');

optionEdinburgh.setAttribute('value', 'Edinburgh');
optionEdinburgh.innerHTML = 'Edinburgh';
officeInput.append(optionEdinburgh);

const optionSanFrancisco = document.createElement('option');

optionSanFrancisco.setAttribute('value', 'San Francisco');
optionSanFrancisco.innerHTML = 'San Francisco';
officeInput.append(optionSanFrancisco);

const ageLabel = document.createElement('label');

ageLabel.innerHTML = 'Age:';
ageLabel.setAttribute('for', 'age');
form.append(ageLabel);

const ageInput = document.createElement('input');

ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageInput.setAttribute('id', 'age');
ageInput.setAttribute('required', '');
ageLabel.append(ageInput);

const salaryLabel = document.createElement('label');

salaryLabel.innerHTML = 'Salary:';
salaryLabel.setAttribute('for', 'salary');
form.append(salaryLabel);

const salaryInput = document.createElement('input');

salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.setAttribute('id', 'salary');
salaryInput.setAttribute('required', '');
salaryLabel.append(salaryInput);

const notification = document.createElement('div');

notification.classList.add('notification');
notification.setAttribute('data-qa', 'notification');
notification.setAttribute('style', 'display: none;');

const notifTitle = document.createElement('div');

notifTitle.classList.add('title');
notification.append(notifTitle);

const notifDescription = document.createElement('div');

notification.append(notifDescription);

body.append(notification);

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.innerHTML = 'Save to table';
button.classList.add('button');
form.append(button);

button.addEventListener('click', function (ev) {
  ev.preventDefault();
  notification.removeAttribute('style');

  const nameLengthError = nameInput.value.length < 4;
  const nameSpacesError = nameInput.value.trim().length === 0;

  const positionLengthError = positionInput.value.length < 1;
  const positionSpacesError = positionInput.value.trim().length === 0;

  const officeSpacesError = officeInput.value.trim().length === 0;

  const ageLimitsError = ageInput.value < 18 || ageInput.value > 90;
  const ageSpacesError = ageInput.value.trim().length === 0;

  const salarySpacesError = salaryInput.value.trim().length === 0;

  if (
    nameLengthError ||
    nameSpacesError ||
    positionLengthError ||
    positionSpacesError ||
    officeSpacesError ||
    ageLimitsError ||
    ageSpacesError ||
    salarySpacesError
  ) {
    notification.classList.remove('success');
    notification.classList.add('error');
    notifTitle.innerHTML = 'Error!';
    notifDescription.innerHTML = 'Too short value, only spaces or wrong age!';

    return;
  }

  notification.classList.remove('error');
  notification.classList.add('success');
  notifTitle.innerHTML = 'Success!';
  notifDescription.innerHTML = 'You have successfully added an employee!';

  const newEmployeeRow = document.createElement('tr');

  const nameTd = document.createElement('td');

  nameTd.innerHTML = nameInput.value;
  newEmployeeRow.append(nameTd);

  const positionTd = document.createElement('td');

  positionTd.innerHTML = positionInput.value;
  newEmployeeRow.append(positionTd);

  const officeTd = document.createElement('td');

  officeTd.innerHTML = officeInput.value;
  newEmployeeRow.append(officeTd);

  const ageTd = document.createElement('td');

  ageTd.innerHTML = ageInput.value;
  newEmployeeRow.append(ageTd);

  const salaryTd = document.createElement('td');

  const inputedValue = salaryInput.value;
  const rvr = String(inputedValue.split('').reverse().join(''));

  if (rvr.length >= 4 && rvr.length <= 6) {
    const rvrWithAdds = rvr.slice(0, 3) + ',' + rvr.slice(3) + '$';
    const rvrNormal = rvrWithAdds.split('').reverse().join('');

    salaryTd.innerHTML = rvrNormal;
    newEmployeeRow.append(salaryTd);
  } else if (rvr.length >= 7) {
    const rvrFirstPart = rvr.slice(0, 3) + ',' + rvr.slice(3, 6);
    const rvrSecondPart = ',' + rvr.slice(6) + '$';
    const rvrTogetherWithAdds = rvrFirstPart + rvrSecondPart;
    const rvrNormal = rvrTogetherWithAdds.split('').reverse().join('');

    salaryTd.innerHTML = rvrNormal;
    newEmployeeRow.append(salaryTd);
  }

  tbody.append(newEmployeeRow);
});

tbody.addEventListener('dblclick', function (ev) {
  if (ev.target.tagName === 'TD') {
    const td = ev.target;

    const previousValue = td.innerHTML;

    td.innerHTML = '';
    td.classList.add('changedTd');

    const formChanges = document.createElement('form');

    formChanges.setAttribute('style', 'position: absolute;');

    const inputForChanges = document.createElement('input');

    inputForChanges.classList.add('changesInput');
    inputForChanges.setAttribute('placeholder', 'Enter a new value');
    formChanges.append(inputForChanges);

    const buttonForChanges = document.createElement('input');

    buttonForChanges.classList.add('changesButton');
    buttonForChanges.setAttribute('type', 'button');
    buttonForChanges.setAttribute('value', 'OK');
    formChanges.append(buttonForChanges);

    const pageX = ev.pageX;
    const pageY = ev.pageY;

    formChanges.style.left = `${pageX}px`;
    formChanges.style.top = `${pageY}px`;

    document.body.append(formChanges);

    buttonForChanges.addEventListener('click', function () {
      if (inputForChanges.value.length === 0) {
        td.innerHTML = previousValue;
        document.body.removeChild(formChanges);

        return;
      }

      td.innerHTML = inputForChanges.value;
      document.body.removeChild(formChanges);
    });
  }
});
