'use strict';

// write code here

const table = document.querySelector('table');
const tableHead = [...table.rows][0];
const tableBody = table.querySelector('tbody');

// SORT LIST
for (const item of [...tableHead.childNodes]) {
  if (item.tagName === 'TH') {
    item.addEventListener('click', sort);
    item.setAttribute('data-asc', 'asc');
  }
}

function sort(e) {
  const data = getData(table);
  const index = e.currentTarget.cellIndex;
  const nextDirection = e.currentTarget.getAttribute('data-asc');

  data.sort((value1, value2) => {
    let val1 = value1[Object.keys(value1)[index]];
    let val2 = value2[Object.keys(value2)[index]];

    // code worck correct and need less code with reassigning
    if (nextDirection !== 'asc') {
      val2 = value1[Object.keys(value1)[index]];
      val1 = value2[Object.keys(value2)[index]];
    }

    if (index === 0 || index === 1 || index === 2) {
      return val1.localeCompare(val2);
    }

    if (index === 3 || index === 4) {
      let number1 = +val1;
      let number2 = +val2;

      if (index === 4) {
        number1 = +val1.split('$')[1].split(',').join('');
        number2 = +val2.split('$')[1].split(',').join('');
      }

      return number1 - number2;
    }
  });

  if (nextDirection === 'asc') {
    e.currentTarget.setAttribute('data-asc', 'desc');
  } else {
    e.currentTarget.setAttribute('data-asc', 'asc');
  }

  for (let i = 0; i < data.length; i++) {
    const row = [...tableBody.rows][i];
    const cels = [...row.cells];

    cels[0].textContent = data[i].name;
    cels[1].textContent = data[i].position;
    cels[2].textContent = data[i].office;
    cels[3].textContent = data[i].age;
    cels[4].textContent = data[i].salary;
  }
}

function getData(t) {
  const result = [];
  const end = [...t.rows].length - 1;

  for (let i = 1; i < end; i++) {
    const row = [...t.rows][i];
    const cells = [...row.cells];

    const rowData = {
      name: cells[0].textContent,
      position: cells[1].textContent,
      office: cells[2].textContent,
      age: cells[3].textContent,
      salary: cells[4].textContent,
    };

    result.push(rowData);
  }

  return result;
}

// SELECT ROW
for (const row of [...tableBody.children]) {
  row.addEventListener('click', () => {
    for (const item of [...tableBody.children]) {
      item.classList.remove('active');
    }

    row.classList.add('active');
  });
}

// ADD FORM
const form = document.createElement('form');
const input = document.createElement('input');
const label = document.createElement('label');
const select = document.createElement('select');
const option = document.createElement('option');
const formDataQa = ['name', 'position', 'office', 'age', 'salary'];
const optionValues = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const button = document.createElement('button');

table.after(form);
form.classList.add('new-employee-form');

for (let i = 0; i < formDataQa.length; i++) {
  const cloneLabel = label.cloneNode();
  const labelText =
    formDataQa[i].charAt(0).toUpperCase() + formDataQa[i].slice(1);
  const cloneInput = input.cloneNode();

  cloneLabel.textContent = labelText;
  cloneInput.setAttribute('data-qa', formDataQa[i]);
  cloneInput.setAttribute('name', formDataQa[i]);
  cloneInput.setAttribute('required', '');

  if (i < 2) {
    cloneInput.setAttribute('type', 'text');
  }

  if (i > 2) {
    cloneInput.setAttribute('type', 'number');
  }

  if (i === 2) {
    for (let n = 0; n < optionValues.length; n++) {
      const cloneOption = option.cloneNode();

      cloneOption.textContent = optionValues[n];
      select.setAttribute('required', '');
      select.append(cloneOption);
    }

    cloneLabel.append(select);
  } else {
    cloneLabel.append(cloneInput);
  }

  form.append(cloneLabel);
}

button.textContent = 'Save to table';
form.append(button);
button.addEventListener('click', saveToTable);
button.setAttribute('type', 'submit');

function saveToTable(e) {
  e.preventDefault();

  const inputs = [...form.querySelectorAll('input')];
  const inputName = inputs[0].value;
  const inputAge = inputs[2].value;

  if (inputName.length < 4 || inputAge <= 18 || inputAge >= 91) {
    const error = {
      type: 'error',
      title: 'ERROR',
      description: '`Name` >= 4 letters.  18 > `Age` > 90',
    };

    pushNotification(error);

    return;
  } else {
    const success = {
      type: 'success',
      title: 'SUCCESS',
      description: 'New element added',
    };

    pushNotification(success);
  }

  const newPerson = {
    name: inputName,
    position: inputs[1].value,
    office: select.value,
    age: inputAge,
    salary: formatSalary(inputs[3].value),
  };

  const tr = document.createElement('tr');
  const td = document.createElement('td');
  const cloneTr = tr.cloneNode();

  for (const key of Object.keys(newPerson)) {
    const cloneTd = td.cloneNode();

    cloneTd.textContent = newPerson[key];
    cloneTr.append(cloneTd);
  }

  tableBody.append(cloneTr);
}

function formatSalary(x) {
  let n = x.toString();
  const pattern = /(-?\d+)(\d{3})/;

  while (pattern.test(n)) {
    n = n.replace(pattern, '$1,$2');
  }

  return '$' + n;
}

const pushNotification = (type) => {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.className = `notification ` + type.type;
  message.setAttribute('style', `top: 10px; right: 10px; z-index: 1`);
  messageTitle.className = `title`;
  messageTitle.textContent = type.title;
  messageDescription.textContent = type.description;

  document.body.append(message);
  message.append(messageTitle);
  message.append(messageDescription);

  setTimeout(() => {
    message.remove();
  }, 2000);
};
