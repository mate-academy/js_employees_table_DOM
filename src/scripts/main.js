/* eslint-disable function-paren-newline */
'use strict';

// write code here
let activeItem = null;

const tbody = document.getElementsByTagName('tbody')[0];
const thead = document.getElementsByTagName('thead')[0];
const form = document.getElementsByClassName('new-employee-form')[0];

let currentAlert = null;

const sortOrder = {
  title: '',
  asc: true,
};

let rows = [];

const theads = thead.querySelectorAll('th');
const tbodies = tbody.querySelectorAll('tr');

thead.addEventListener('click', (e) => {
  const head = e.target.closest('th');

  if (head) {
    const mainKey = head.innerText;

    if (sortOrder.title !== mainKey) {
      sortOrder.title = mainKey;
      sortOrder.asc = true;
    } else {
      sortOrder.asc = !sortOrder.asc;
    }

    let newRows = [...rows].sort((a, b) =>
      compareTwoStrings(a[mainKey], b[mainKey]),
    );

    if (mainKey.toLowerCase() === 'age' || mainKey.toLowerCase() === 'salary') {
      newRows = [...newRows].sort((a, b) => {
        return a[mainKey].toString().length - b[mainKey].toString().length;
      });
    }

    tbody.innerHTML = '';

    newRows = sortOrder.asc ? newRows : [...newRows.reverse()];

    newRows.forEach((el) => {
      const tr = document.createElement('tr');

      for (const key in el) {
        const td = document.createElement('td');

        td.innerText = el[key];

        tr.appendChild(td);
      }

      tbody.appendChild(tr);

      return tr;
    });
  }
});

const compareTwoStrings = (a, b) => {
  return a.toString().localeCompare(b.toString());
};

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (row) {
    row.classList.add('active');

    if (activeItem !== null) {
      activeItem.classList.remove('active');
    }

    activeItem = row;
  }
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (td) {
    const content = td.innerText;

    td.innerHTML = '';

    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.value = content;

    td.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      replaceEdited(input, td, content);
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        replaceEdited(input, td, content);
      }
    });
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const data = new FormData(form);

  const newItem = {
    Name: data.get('name'),
    Position: data.get('position'),
    Office: data.get('office'),
    Age: parseInt(data.get('age')),
    Salary: parseInt(data.get('salary')),
  };

  if (!validateFormData(newItem)) {
    return;
  }

  const tRow = document.createElement('tr');

  const tName = document.createElement('td');
  const tPosition = document.createElement('td');
  const tOffice = document.createElement('td');
  const tAge = document.createElement('td');
  const tSalary = document.createElement('td');

  tName.innerText = newItem.Name || '';
  tPosition.innerText = newItem.Position || '';
  tOffice.innerText = newItem.Office || '';
  tAge.innerText = newItem.Age || 0;
  tSalary.innerText = getFormattedSalary(newItem.Salary || 0);

  tRow.append(tName);
  tRow.append(tPosition);
  tRow.append(tOffice);
  tRow.append(tAge);
  tRow.append(tSalary);

  rows.push(newItem);

  tbody.appendChild(tRow);
});

const validateFormData = (data) => {
  if (data.Name.length < 4) {
    showNotification(
      'error',
      'Error happened with Name',
      'Your name has too low length',
    );

    return false;
  }

  if (!data.Position) {
    showNotification(
      'error',
      'Error happened with Position',
      "Position field mustn't be empty",
    );

    return false;
  }

  if (!data.Age || data.Age < 18 || data.Age > 90) {
    showNotification(
      'error',
      'Error happened with Age',
      'Your age is out of range',
    );

    return false;
  }

  showNotification('success', 'Success!', 'An item is successfuly added!');

  return true;
};

const validateEditing = (field, typeIndex) => {
  switch (typeIndex) {
    case 1: {
      return field.length > 4;
    }

    case 2: {
      return field.length;
    }

    case 3: {
      return field.length;
    }

    case 4: {
      const num = parseInt(field);

      if (!num) {
        return false;
      }

      return num >= 18 && num <= 90;
    }

    case 5: {
      return field.length;
    }

    default: {
      return false;
    }
  }
};

const showNotification = (type, titleNot, descNot) => {
  const div = document.createElement('div');

  if (currentAlert !== null) {
    currentAlert.remove();
  }

  div.classList.add('notification');
  div.classList.add(type);

  div.setAttribute('data-qa', 'notification');

  const title = document.createElement('h2');

  title.classList.add('title');
  title.innerText = titleNot;

  const desc = document.createElement('span');

  desc.innerText = descNot;

  div.appendChild(title);
  div.appendChild(desc);

  document.body.appendChild(div);
  currentAlert = div;
};

const getFormattedSalary = (salary) => {
  const salaryStr = salary.toString();

  let salaryReversed = '';
  let counter = 1;

  for (let i = salaryStr.length - 1; i >= 0; i--) {
    salaryReversed += salaryStr[i];

    if (counter % 3 === 0) {
      salaryReversed += ',';
    }

    counter++;
  }

  return '$' + [...salaryReversed].reverse().reduce((p, c) => p + c, '');
};

const replaceEdited = (input, td, content) => {
  const endValue = input.value;

  const index = Array.from(td.parentNode.children).indexOf(td) + 1;

  if (!input.value || !validateEditing(input.value, index)) {
    td.innerHTML = content;

    showNotification(
      'error',
      'Field written incorrectly!',
      'Check your answer',
    );

    return;
  }

  let endValueCopy = endValue;

  if (index === 5) {
    endValueCopy = endValueCopy.replace(',', '');
    endValueCopy = endValueCopy.replace('$', '');
  }

  td.innerHTML = getFormattedSalary(endValueCopy);

  formTable();
};

const formTable = () => {
  rows = [];

  tbodies.forEach((tb) => {
    const row = {};

    const tds = tb.querySelectorAll('td');

    for (let i = 0; i < tds.length; i++) {
      row[theads[i].innerText] = tds[i].innerText;
    }

    rows.push(row);
  });
};

formTable();
