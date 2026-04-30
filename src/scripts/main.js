'use strict';
// console.log(document.forms);

const table = document.querySelector('table'); // шукаю елемет
const body = document.querySelector('body');

let ASC = true;
let indColumns = 0;
let prevColumn = -1;

// #region newEmployeForm

const newEmployeForm = document.createElement('form');

newEmployeForm.classList.add('new-employee-form');
newEmployeForm.id = 'new-employe';

body.append(newEmployeForm);

// #endregion

// #region inputName

const labelName = document.createElement('label');
const inputName = document.createElement('input');

labelName.textContent = 'Name:';

inputName.id = 'name';
inputName.name = 'name';
inputName.type = 'text';
inputName.dataset.qa = 'name';
inputName.classList.add('input');
inputName.required = true;

labelName.append(inputName);
newEmployeForm.append(labelName);

// #endregion

// #region position
const labelPosition = document.createElement('label');
const inputPos = document.createElement('input');

// labelPosition.name = 'position';
labelPosition.textContent = 'Position:';
// labelPosition.type = 'text';

labelPosition.classList.add('label');

inputPos.dataset.qa = 'position';
inputPos.name = 'position';
inputPos.id = 'position';
inputPos.type = 'text';
inputPos.classList.add('input');
// inputPos.required = true;

labelPosition.append(inputPos);
newEmployeForm.append(labelPosition);

// #endregion

// #region Office

const labelSelectOffice = document.createElement('label');
const selectOfice = document.createElement('select');
const selectPlaceholder = document.createElement('option');

// selectPlaceholder.type = 'text';

selectPlaceholder.required = true;
selectPlaceholder.value = '';
selectPlaceholder.textContent = 'Please select office';
selectPlaceholder.disabled = true;
selectPlaceholder.hidden = true;
selectPlaceholder.selected = true;
// selectPlaceholder.classList.add('select');

labelSelectOffice.textContent = 'Office: ';
// labelSelectOffice.type = 'text';

selectOfice.classList.add('select');
selectOfice.name = 'office';
selectOfice.id = 'select';
selectOfice.required = true;
selectOfice.dataset.qa = 'office';

selectOfice.prepend(selectPlaceholder);
labelSelectOffice.append(selectOfice);
newEmployeForm.append(labelSelectOffice);

// #endregion

// #region options // Select should have 6 options: Tokyo, Singapore,

const optionTokyo = document.createElement('option');

optionTokyo.value = 'Tokyo';
optionTokyo.textContent = 'Tokyo';
optionTokyo.classList.add('select');
selectOfice.append(optionTokyo);

const optionSingapore = document.createElement('option');

optionSingapore.value = 'Singapore';
optionSingapore.textContent = 'Singapore';
optionSingapore.classList.add('select');
selectOfice.append(optionSingapore);

const optionLondon = document.createElement('option');

optionLondon.value = 'London';
optionLondon.textContent = 'London';
optionLondon.classList.add('select');
selectOfice.append(optionLondon);

const optionNewYork = document.createElement('option');

optionNewYork.value = 'New York';
optionNewYork.textContent = 'New York';
optionNewYork.classList.add('select');
selectOfice.append(optionNewYork);

const optionEdinburgh = document.createElement('option');

optionEdinburgh.value = 'Edinburgh';
optionEdinburgh.textContent = 'Edinburgh';
optionEdinburgh.classList.add('select');
selectOfice.append(optionEdinburgh);

const optionSanFrancisco = document.createElement('option');

optionSanFrancisco.value = 'San Francisco';
optionSanFrancisco.textContent = 'San Francisco';
optionSanFrancisco.classList.add('select');
selectOfice.append(optionSanFrancisco);

// #endregion

// #region Age

const labelAge = document.createElement('label');
const inputAge = document.createElement('input');

labelAge.textContent = 'Age:';
labelAge.classList.add('label');
inputAge.dataset.qa = 'age';
inputAge.type = 'number';
inputAge.id = 'age';
inputAge.name = 'age';
inputAge.required = true;
inputAge.classList.add('label');

labelAge.append(inputAge);
newEmployeForm.append(labelAge);

// #endregion

// #region salary
const labelSalary = document.createElement('label');
const inputSalary = document.createElement('input');

labelSalary.textContent = 'Salary:';
labelSalary.classList.add('lable');

inputSalary.dataset.qa = 'salary';
inputSalary.type = 'number';
inputSalary.id = 'salary';
inputSalary.name = 'salary';
inputSalary.required = true;
inputSalary.classList.add('label');

labelSalary.append(inputSalary);
newEmployeForm.append(labelSalary);

// #endregion

// #region submit button

const button = document.createElement('button');

button.textContent = 'Save to table';
button.classList.add('button');
button.type = 'submit';

newEmployeForm.append(button);

// #endregion

newEmployeForm.setAttribute('method', 'get');
newEmployeForm.setAttribute('action', '');

// #region salary to notm

const salaryToNorm = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  maximumFractionDigits: 0,
});

// #endregion
// #region compare
function compareFn(a, b) {
  const valA = a.cells[indColumns].textContent;
  const valB = b.cells[indColumns].textContent;

  const newA = Number(valA.replace(/[$,]/g, ''));
  const newB = Number(valB.replace(/[$,]/g, ''));

  if (
    valA.trim() !== '' &&
    valB.trim() !== '' &&
    !isNaN(newA) &&
    !isNaN(newB)
  ) {
    if (ASC) {
      return newA - newB;
    }

    return (newA - newB) * -1;
  }

  if (ASC) {
    return valA.trim().toLowerCase().localeCompare(valB.trim().toLowerCase());
  }

  return valB.trim().toLowerCase().localeCompare(valA.trim().toLowerCase());
}
// #endregion

// #region sort

table.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const aim = Array.from(table.tBodies[0].rows);

    if (e.target.cellIndex === prevColumn) {
      ASC = !ASC;
    } else {
      ASC = true;
    }
    prevColumn = e.target.cellIndex;
    indColumns = e.target.cellIndex;
    aim.sort(compareFn);
    // console.log('First after sort:', aim[0].cells[0].textContent);
    table.tBodies[0].append(...aim);
  }
});

// #endregion

// #region select
table.addEventListener('click', (e) => {
  const row = e.target.closest('tbody tr');

  if (row) {
    document
      .querySelectorAll('tbody tr.active')
      .forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  }
});
// #endregion

// #region

const normalizer = function (w) {
  let rowString = w;

  rowString = rowString.trim().split(/\s+/).filter(Boolean);
  rowString = rowString.map((word) => word[0].toUpperCase() + word.slice(1));

  return rowString.join(' ');
};

// #endregion

// #region error notification

const notification = document.createElement('div');

notification.name = 'notification';
notification.dataset.qa = 'notification';
notification.classList.add('notification');
notification.classList.add('title');

const spanTitle = document.createElement('span');

notification.append(spanTitle);

// +style

notification.style.display = 'flex';
notification.style.justifyContent = 'center';
notification.style.alignItems = 'center';
notification.style.position = 'relative';
notification.style.width = '270px';

// notification.classList.add('warning');

spanTitle.classList.add('success');
spanTitle.classList.add('warning');

spanTitle.style.color = 'red';
spanTitle.style.fontSize = 'larger';

const createMessage = function (massag) {
  notification.classList.remove('error', 'success', 'warning');
  notification.classList.add(massag);
};

const redy = function () {
  newEmployeForm.append(notification);
};

//

// #endregion

// #region submit

newEmployeForm.addEventListener('submit', (e) => {
  const massages = [];
  let error = '';

  massages.length = 0;

  e.preventDefault();

  if (inputPos.value.length < 4) {
    massages.push('Position is required');
    error = 'error';
    spanTitle.textContent = 'Position must be less than 4 characters!';
    createMessage(error);
    redy();
  }

  if (inputName.value.length < 4) {
    massages.push('Name must be less than 4 characters');
    error = 'error';
    spanTitle.textContent = 'Name must be less than 4 characters!';
    createMessage(error);
    redy();
  }

  if (Number(inputAge.value) < 18 || Number(inputAge.value) > 90) {
    massages.push('Incorrect age');
    error = 'error';
    spanTitle.textContent = 'Incorrect age';
    createMessage(error);
    redy();
  }

  if (massages.length !== 0) {
    createMessage('error');
    redy();

    return;
  }

  const newChu = new FormData(e.currentTarget);
  const formData = Object.fromEntries(newChu);
  const listOfCharacters = ['name', 'position', 'office', 'age', 'salary'];

  formData.name = normalizer(formData.name);
  formData.position = normalizer(formData.position);

  if (massages.length === 0) {
    const newRow = table.tBodies[0].insertRow();

    spanTitle.textContent = 'SUCCESS';
    createMessage('success');
    redy();
    delNotification();

    listOfCharacters.forEach((el) => {
      const newCell = newRow.insertCell();

      if (el !== 'salary') {
        newCell.textContent = formData[el];
      } else {
        newCell.textContent = salaryToNorm.format(Number(formData[el]));
      }
    });
    newEmployeForm.reset();
  }
});

// #endregion

const delNotification = () => {
  setTimeout(() => {
    notification.remove();
  }, 3000);
};
