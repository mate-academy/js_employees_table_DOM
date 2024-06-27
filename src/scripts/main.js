'use strict';

const titles = [...document.querySelectorAll('thead tr th')];
const trs = [...document.querySelectorAll('tbody tr')];
const [nameTitle, positionTitle, officeTitle, ageTitle, salaryTitle] = titles;

let clicksNameTitle = 0;
let clicksPositionTitle = 0;
let clicksOfficeTitle = 0;
let clicksAgeTitle = 0;
let clicksSalaryTitle = 0;

const [
  row1,
  row2,
  row3,
  row4,
  row5,
  row6,
  row7,
  row8,
  row9,
  row10,
  row11,
  row12,
] = trs;

// append sorted elems inside a table
const updateTable = function (rows, table) {
  table.innerHTML = '';
  rows.forEach((row) => table.append(row));
};

// sort rows by alphabet in ASC order
const sortByAlphabetASC = function (rows, cellIndex) {
  rows.sort((a, b) => {
    const wordA = a.cells[cellIndex].innerText.toLowerCase();
    const wordB = b.cells[cellIndex].innerText.toLowerCase();

    return wordA.localeCompare(wordB);
  });
};

const sortByAlphabetDESC = function (rows, cellIndex) {
  rows.sort((a, b) => {
    const wordA = a.cells[cellIndex].innerText.toLowerCase();
    const wordB = b.cells[cellIndex].innerText.toLowerCase();

    return wordB.localeCompare(wordA);
  });
};

const sortNumbersASC = function (rows, cellIndex) {
  rows.sort((a, b) => {
    const numA = parseInt(a.cells[cellIndex].innerText);
    const numB = parseInt(b.cells[cellIndex].innerText);

    return numA - numB;
  });
};

const sortNumberDESC = function (rows, cellIndex) {
  rows.sort((a, b) => {
    const numA = parseInt(a.cells[cellIndex].innerText);
    const numB = parseInt(b.cells[cellIndex].innerText);

    return numB - numA;
  });
};

const sortSalaryASC = function (rows, cellIndex) {
  rows.sort((a, b) => {
    const salaryA = parseInt(
      a.cells[cellIndex].innerText.replace('$', '').replace(',', ''),
    );
    const salaryB = parseInt(
      b.cells[cellIndex].innerText.replace('$', '').replace(',', ''),
    );

    return salaryA - salaryB;
  });
};

const sortSalaryDESC = function (rows, cellIndex) {
  rows.sort((a, b) => {
    const salaryA = parseInt(
      a.cells[cellIndex].innerText.replace('$', '').replace(',', ''),
    );
    const salaryB = parseInt(
      b.cells[cellIndex].innerText.replace('$', '').replace(',', ''),
    );

    return salaryB - salaryA;
  });
};

// name column
nameTitle.addEventListener('click', () => {
  const tbody = document.querySelector('tbody');
  const tableRows = [...document.querySelectorAll('tbody tr')];

  clicksNameTitle++;

  if (clicksNameTitle % 2 === 0) {
    sortByAlphabetDESC(tableRows, 0);
  } else {
    sortByAlphabetASC(tableRows, 0);
  }

  updateTable(tableRows, tbody);
});

// position column
positionTitle.addEventListener('click', () => {
  const tableRows = [...document.querySelectorAll('tbody tr')];
  const tbody = document.querySelector('tbody');

  clicksPositionTitle++;

  if (clicksPositionTitle % 2 === 0) {
    sortByAlphabetDESC(tableRows, 1);
  } else {
    sortByAlphabetASC(tableRows, 1);
  }

  updateTable(tableRows, tbody);
});

officeTitle.addEventListener('click', () => {
  const tableRows = [...document.querySelectorAll('tbody tr')];
  const tbody = document.querySelector('tbody');

  clicksOfficeTitle++;

  if (clicksOfficeTitle % 2 === 0) {
    sortByAlphabetDESC(tableRows, 2);
  } else {
    sortByAlphabetASC(tableRows, 2);
  }

  updateTable(tableRows, tbody);
});

// age column
ageTitle.addEventListener('click', () => {
  const tableRows = [...document.querySelectorAll('tbody tr')];
  const tbody = document.querySelector('tbody');

  clicksAgeTitle++;

  if (clicksAgeTitle % 2 === 0) {
    sortNumberDESC(tableRows, 3);
  } else {
    sortNumbersASC(tableRows, 3);
  }

  updateTable(tableRows, tbody);
});

// salary column
salaryTitle.addEventListener('click', () => {
  const tableRows = [...document.querySelectorAll('tbody tr')];
  const tbody = document.querySelector('tbody');

  clicksSalaryTitle++;

  if (clicksSalaryTitle % 2 === 0) {
    sortSalaryDESC(tableRows, 4);
  } else {
    sortSalaryASC(tableRows, 4);
  }

  updateTable(tableRows, tbody);
});

const activeClassApplier = function (rowNumber) {
  rowNumber.addEventListener('click', () => {
    const styles = [];

    trs.forEach((row) => {
      if (row.className !== '') {
        styles.push(row.className);
      }
    });

    if (!styles.length) {
      rowNumber.className = 'active';
    } else {
      rowNumber.className = '';
    }
  });
};

activeClassApplier(row1);
activeClassApplier(row2);
activeClassApplier(row3);
activeClassApplier(row4);
activeClassApplier(row5);
activeClassApplier(row6);
activeClassApplier(row7);
activeClassApplier(row8);
activeClassApplier(row9);
activeClassApplier(row10);
activeClassApplier(row11);
activeClassApplier(row12);

// create <form> and add class .new-employee-form
const form = document.createElement('form');

form.classList.add('new-employee-form');

// create <labels>
const labelForNameInput = document.createElement('label');
const labelForPositionInput = document.createElement('label');
const labelForOfficeSelection = document.createElement('label');
const labelForAgeInput = document.createElement('label');
const labelForSalaryInput = document.createElement('label');

// create <inputs>
const nameInput = document.createElement('input');
const positionInput = document.createElement('input');
const ageInput = document.createElement('input');
const salaryInput = document.createElement('input');
const saveButton = document.createElement('button');

// create <select> and <options> for it
const officeSelection = document.createElement('select');

const optionTokyo = document.createElement('option');
const optionSingapore = document.createElement('option');
const optionLondon = document.createElement('option');
const optionNewYork = document.createElement('option');
const optionEdinburgh = document.createElement('option');
const optionSanFrancisco = document.createElement('option');

optionTokyo.value = 'Tokyo';
optionTokyo.textContent = 'Tokyo';

optionSingapore.value = 'Singapore';
optionSingapore.textContent = 'Singapore';

optionLondon.value = 'London';
optionLondon.textContent = 'London';

optionNewYork.value = 'NewYork';
optionNewYork.textContent = 'New York';

optionEdinburgh.value = 'Edinburgh';
optionEdinburgh.textContent = 'Edinburgh';

optionSanFrancisco.value = 'SanFrancisco';
optionSanFrancisco.textContent = 'San Francisco';

officeSelection.append(
  optionTokyo,
  optionSingapore,
  optionLondon,
  optionNewYork,
  optionEdinburgh,
  optionSanFrancisco,
);

// add attributes for inputs and select
nameInput.name = 'name';
nameInput.type = 'text';
nameInput.dataset.qa = 'name';
nameInput.required = 'true';

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.dataset.qa = 'position';
positionInput.required = 'true';

officeSelection.name = 'office';
officeSelection.dataset.qa = 'office';
officeSelection.required = 'true';

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.dataset.qa = 'age';
ageInput.required = 'true';

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.dataset.qa = 'salary';
salaryInput.required = 'true';

saveButton.textContent = 'Save to table';

labelForNameInput.textContent = 'Name:';
labelForPositionInput.textContent = 'Position:';
labelForOfficeSelection.textContent = 'Office:';
labelForAgeInput.textContent = 'Age:';
labelForSalaryInput.textContent = 'Salary:';

// append <inputs> and <select> inside labels
labelForNameInput.append(nameInput);
labelForPositionInput.append(positionInput);
labelForOfficeSelection.append(officeSelection);
labelForAgeInput.append(ageInput);
labelForSalaryInput.append(salaryInput);

// append <label>s inside form
form.append(
  labelForNameInput,
  labelForPositionInput,
  labelForOfficeSelection,
  labelForAgeInput,
  labelForSalaryInput,
  saveButton,
);

// append form on a website
document.body.appendChild(form);

// validation for form inputs
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target); // get data

  const body = document.querySelector('tbody');
  const tr = document.createElement('tr');
  let valid = true;

  const notification = document.createElement('div');
  const title = document.createElement('h2');
  const description = document.createElement('p');
  const labels = [...document.querySelectorAll('.new-employee-form label')];

  notification.dataset.qa = 'notification';
  notification.append(title, description);

  for (const [key, value] of formData.entries()) {
    let unvalidAge = false;
    let unvalidName = false;

    if (key === 'age') {
      const age = parseInt(value);

      unvalidAge = age < 18 || age > 90;
    }

    if (key === 'name') {
      unvalidName = value.length < 4;
    }

    // name cannot be just spaces
    if (key === 'name' && !value.replaceAll(' ', '').length) {
      valid = false;
      notification.classList.add('notification', 'error');
      title.textContent = 'Error.';
      title.className = 'title';
      description.textContent = 'Please, type name value';
      document.body.append(notification);
      break;
    }

    // position cannot be just spaces
    if (key === 'position' && !value.replaceAll(' ', '').length) {
      valid = false;
      notification.classList.add('notification', 'error');
      title.textContent = 'Error.';
      title.className = 'title';
      description.textContent = 'Please, type position value';
      document.body.append(notification);
      break;
    }

    if (unvalidAge) {
      valid = false;
      labels[3].style.color = 'red';
      notification.classList.add('notification', 'error');
      title.textContent = 'Error.';
      title.className = 'title';
      description.textContent = 'Please fill in correct age (from 18 to 90)';
      document.body.append(notification);
      break;
    }

    if (unvalidName) {
      valid = false;
      labels[0].style.color = 'red';
      notification.classList.add('notification', 'error');
      title.className = 'title';
      title.textContent = 'Error.';
      description.textContent = 'Please fill in correct name (>4 characters)';
      document.body.append(notification);
      break;
    }

    const cell = document.createElement('td');

    if (key === 'salary') {
      if (value.length < 4) {
        cell.textContent = `$${value}`;
      } else {
        cell.textContent = `$${value.slice(0, -3)},${value.slice(value.length - 3)}`;
      }
    } else {
      cell.textContent = value;
    }

    tr.append(cell);
  }

  if (valid) {
    if (labels[3].style.color === 'red') {
      labels[3].style.color = '#808080';
    } else if (labels[0].style.color === 'red') {
      labels[0].style.color = '#808080';
    }

    notification.classList.add('notification', 'success');
    title.className = 'title';
    title.textContent = 'Success.';
    description.textContent = 'New employee has been added successfully.';
    document.body.append(notification);
    body.append(tr);
    e.target.reset();
  }

  // make notification invisible after 3,5sec
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3500);
});
