'use strict';

const head = document.querySelector('thead');
const holeList = document.querySelector('tbody');
const rows = Array.from(holeList.rows);
const tr = holeList.children[0];
let countClick = 0;

// sort table
head.addEventListener('click', (e) => {
  countClick++;

  const index = e.target.cellIndex;

  if (countClick % 2 === 0) {
    rows.sort((a, b) => {
      const aText = a.cells[index].textContent;
      const bText = b.cells[index].textContent;

      if (index === 0 || index === 1 || index === 2) {
        return bText.localeCompare(aText);
      } else if (index === 3 || index === 4) {
        return convertToNumber(bText) - convertToNumber(aText);
      }
    });
  } else {
    rows.sort((a, b) => {
      const aText = a.cells[index].textContent;
      const bText = b.cells[index].textContent;

      if (index === 0 || index === 1 || index === 2) {
        return aText.localeCompare(bText);
      } else if (index === 3 || index === 4) {
        return convertToNumber(aText) - convertToNumber(bText);
      }
    });
  }
  holeList.append(...rows);
});

function convertToNumber(salaryString) {
  if (salaryString.startsWith('$')) {
    return parseInt(salaryString.replace(/[$,]/g, ''));
  } else {
    return +salaryString;
  }
}

// Selected row
function selectRow() {
  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => {
        r.classList.remove('active');
      });
      row.classList.add('active');
    });

    row.addEventListener('dblclick', (e) => {
      e.target.classList.add('cell-input');
      e.target.setAttribute('contenteditable', true);
    });
  });
}

selectRow();

// add form
const body = document.querySelector('body');
const form = document.createElement('form');
const nameInput = document.createElement('input');
const positionInput = document.createElement('input');
const officeInput = document.createElement('select');
const ageInput = document.createElement('input');
const salaryInput = document.createElement('input');
const button = document.createElement('button');

const allInputs = [
  nameInput,
  positionInput,
  officeInput,
  ageInput,
  salaryInput,
];

allInputs[0].name = 'name';
allInputs[1].name = 'position';
allInputs[2].name = 'office';
allInputs[3].name = 'age';
allInputs[4].name = 'salary';

// add type and attributes
allInputs.forEach((input) => {
  if (input.name === 'name' || input.name === 'position') {
    input.type = 'text';
  } else if (input.name === 'age' || input.name === 'salary') {
    input.type = 'number';
  } else {
    for (let i = 0; i < 6; i++) {
      const option = document.createElement('option');

      if (i === 0) {
        option.textContent = 'Tokyo';
        option.selected = true;
      } else if (i === 1) {
        option.textContent = 'Singapore';
      } else if (i === 2) {
        option.textContent = 'London';
      } else if (i === 3) {
        option.textContent = 'New York';
      } else if (i === 4) {
        option.textContent = 'Edinburgh';
      } else if (i === 5) {
        option.textContent = 'San Francisco';
      }

      officeInput.append(option);
    }
  }
  input.setAttribute('data-qa', `${input.name}`);
  input.required = true;
});

// append elements
form.classList.add('new-employee-form');
button.textContent = 'Save to table';
body.append(form);
form.prepend(nameInput);
form.append(positionInput);
form.append(officeInput);
form.append(ageInput);
form.append(salaryInput);
form.append(button);

// add label

function addLabel() {
  allInputs.forEach((input) => {
    const label = document.createElement('label');

    label.textContent = `${input.name[0].toUpperCase()}${input.name.slice(1, input.name.length)}:`;
    input.before(label);
    label.append(input);
  });
}

addLabel();

// create notification

const pushNotification = (title, type) => {
  const box = document.createElement('div');
  const h2 = document.createElement('h2');

  box.classList.add('notification');
  box.setAttribute('data-qa', 'notification');
  h2.classList.add('title');

  h2.textContent = title;

  if (type === 'warning') {
    box.classList.add('warning');
  } else if (type === 'success') {
    box.classList.add('success');
  } else if (type === 'error') {
    box.classList.add('error');
  }

  body.append(box);
  box.append(h2);

  window.setTimeout(() => {
    box.style.visibility = 'hidden';
  }, 2000);
};
// show notification

button.addEventListener('click', (e) => {
  e.preventDefault();

  if (nameInput.value.length < 4) {
    nameInput.value = '';
    pushNotification('Please, enter 4 or more letters', 'error');
  } else if (positionInput.value.length < 4) {
    positionInput.value = '';
    pushNotification('Please, enter 4 or more letters', 'error');
  } else if (ageInput.value < 18 || ageInput.value > 90) {
    ageInput.value = '';
    pushNotification('Age have to from 18 to 90', 'error');
  }

  if (
    nameInput.value !== '' &&
    positionInput.value !== '' &&
    ageInput.value !== '' &&
    salaryInput.value !== 0
  ) {
    const newTr = tr.cloneNode(true);

    newTr.children[0].innerHTML = nameInput.value;
    newTr.children[1].innerHTML = positionInput.value;
    newTr.children[2].innerHTML = officeInput.value;
    newTr.children[3].innerHTML = ageInput.value;

    if (salaryInput.value === '') {
      newTr.children[4].innerHTML = '$0';
    } else {
      const salaryInputNumber = +salaryInput.value;

      newTr.children[4].innerHTML =
        `$${salaryInputNumber.toLocaleString('de-DE')}`.replaceAll('.', ',');
    }

    holeList.append(newTr);
    rows.push(newTr);
    selectRow();

    allInputs.forEach((input) => {
      input.value = '';
    });

    pushNotification('Thank you for adding the new employees!!!', 'success');
  }
});
