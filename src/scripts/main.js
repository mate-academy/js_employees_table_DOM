'use strict';

let rows = [...document.querySelectorAll('tr')];
const headings = rows.splice(0, 1);
const tbody = document.querySelector('table tbody');

// clearing the array from unnecessary rows
rows.splice(-1, 1);

function sortTable(chosenNode, indexOfChosenNode) {
  let callback;
  const dataType = chosenNode.textContent.trim();

  if (dataType === 'Name' || dataType === 'Position' || dataType === 'Office') {
    callback = (currentRow, nextRow) => {
      const textA = currentRow.children[indexOfChosenNode].textContent;
      const textB = nextRow.children[indexOfChosenNode].textContent;

      return textA.localeCompare(textB);
    };
  } else if (dataType === 'Age') {
    callback = (currentRow, nextRow) => {
      const textA = +currentRow.children[indexOfChosenNode].textContent;
      const textB = +nextRow.children[indexOfChosenNode].textContent;

      return textA - textB;
    };
  } else {
    callback = (currentRow, nextRow) => {
      const textA = currentRow.children[indexOfChosenNode].textContent.replace(
        /[$,]/g,
        '',
      );

      const textB = nextRow.children[indexOfChosenNode].textContent.replace(
        /[$,]/g,
        '',
      );

      return textA - textB;
    };
  }

  rows.sort(callback);

  tbody.append(...rows);
}

// Sorting in 2 directions according to chosen heading
headings[0].addEventListener('click', (e) => {
  const heading = e.target;

  const isCurrentlyAsc = heading.classList.contains('sorted');

  [...heading.parentNode.children].forEach((cell) => {
    cell.classList.remove('sorted', 'sortedReversite');
  });

  if (isCurrentlyAsc) {
    heading.classList.add('sortedReversite');
  } else {
    heading.classList.add('sorted');
  }

  if (heading.classList.contains('sorted')) {
    sortTable(heading, heading.cellIndex);
  } else {
    sortTable(heading, heading.cellIndex);
    tbody.append(...rows.reverse());
  }
});

// Selection of an row
tbody.addEventListener('click', (e) => {
  if (rows.some((row) => row.classList.contains('active'))) {
    const activeRow = rows.find((row) => row.classList.contains('active'));

    if (activeRow.classList.length > 1) {
      activeRow.classList.remove('active');
    } else {
      activeRow.removeAttribute('class');
    }

    e.target.parentNode.classList.add('active');
  } else {
    e.target.parentNode.classList.add('active');
  }
});

// Form Section

const body = document.querySelector('body');
const form = document.createElement('form');
const submitBtn = document.createElement('button');

submitBtn.textContent = 'Save to table';

// #region labels

const amountOfLabels = 4;
const labelNames = ['name', 'position', 'age', 'salary'];

// Creates and appends labels with inputs inside into <form> node
for (let i = 0; i < amountOfLabels; i++) {
  const label = document.createElement('label');

  label.textContent =
    labelNames[i].charAt(0).toUpperCase() + labelNames[i].slice(1) + ': ';

  const input = document.createElement('input');

  if (labelNames[i] === 'age' || labelNames[i] === 'salary') {
    input.setAttribute('type', 'number');
  } else {
    input.setAttribute('type', 'text');
  }

  input.setAttribute('name', labelNames[i]);
  input.setAttribute('data-qa', labelNames[i]);
  input.required = true;

  label.append(input);
  form.append(label);
}

// #endregion

// #region select
const select = document.createElement('select');

select.setAttribute('name', 'office');
select.setAttribute('data-qa', 'office');
select.required = true;

const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

options.forEach((option) => {
  const optionElement = document.createElement('option');

  optionElement.setAttribute('value', option);
  optionElement.textContent = option;

  select.append(optionElement);
});

const labelForSelect = document.createElement('label');
const selectLabelText = 'Office';

labelForSelect.textContent = selectLabelText + ': ';

labelForSelect.append(select);

const positionLabel = form.querySelector(
  'label input[name="position"]',
).parentNode;

positionLabel.after(labelForSelect);

// #endregion
form.append(submitBtn);
form.setAttribute('class', 'new-employee-form');
form.setAttribute('novalidate', '');

body.querySelector('script').before(form);

// Editing table feature
// #region editing

function appendNotification(notification) {
  body.querySelector('script').before(notification);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 4000);
}

function isFormDataValid(memberData) {
  const oldMessage = document.querySelector('.notification');

  if (oldMessage) {
    oldMessage.remove();
  }

  const notificationBlock = document.createElement('div');
  const notificationHeading = document.createElement('h2');

  notificationBlock.classList.add('notification');
  notificationHeading.classList.add('title');

  const notificationParagraph = document.createElement('p');

  notificationBlock.append(notificationHeading, notificationParagraph);

  notificationBlock.setAttribute('data-qa', 'notification');

  const validation = {
    ofName: (userName) => userName.length >= 4,
    ofAge: (age) => age >= 18 && age <= 90,
    hasEmptyFields: (member) =>
      Object.values(member).some((value) => value.trim() === ''),
  };

  if (validation.hasEmptyFields(memberData)) {
    notificationBlock.classList.add('error');

    notificationHeading.textContent =
      'Warning, validation found an empty field';
    notificationParagraph.textContent = 'Please, complete all required fields';

    appendNotification(notificationBlock);

    return false;
  }

  if (validation.ofName(memberData.name) && validation.ofAge(memberData.age)) {
    notificationBlock.classList.add('success');
    notificationHeading.textContent = 'Success, validation completed correctly';

    notificationParagraph.textContent =
      'The user has been added to members table';

    appendNotification(notificationBlock);

    return true;
  } else {
    notificationBlock.classList.add('error');
    notificationHeading.textContent = 'Error, validation find incorrect data';

    notificationParagraph.textContent =
      'Please, check the provided information';

    appendNotification(notificationBlock);

    return false;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const newMember = Object.fromEntries(formData);

  if (isFormDataValid(newMember)) {
    const row = document.createElement('tr');

    for (const informationType of Object.keys(newMember)) {
      const cell = document.createElement('td');

      cell.textContent = newMember[informationType];

      if (informationType === 'salary') {
        const salaryNumber = Number(newMember.salary);
        const formatedSalary = '$' + salaryNumber.toLocaleString('en-US');

        cell.textContent = formatedSalary;
      }

      row.append(cell);
    }

    tbody.append(row);
  }

  // Updating rows data for sorting
  rows = [...document.querySelector('tbody').querySelectorAll('tr')];
});

// #endregion
