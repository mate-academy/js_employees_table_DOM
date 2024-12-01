'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tHeadCols = Array.from(table.tHead.rows[0].cells);
const tRows = Array.from(table.rows);
const tFootCols = Array.from(table.tFoot.rows[0].cells);
const tBodyRows = table.tBodies[0].rows;

function salaryToNum(str) {
  const arr = str.split(',');
  const value = arr[0].slice(1) + arr[1];

  return +value;
}

function salaryToDollars(value) {
  let str = '';
  let count = 1;
  let res = '';

  for (let i = value.length - 1; i >= 0; i--) {
    if (count === 3 && i !== 0) {
      str += value[i] + ',';
      count = 1;
    } else {
      str += value[i];
      count++;
    }
  }

  for (let i = str.length - 1; i >= 0; i--) {
    res += str[i];
  }

  return '$' + res;
}

function sortTable(e) {
  const th = e.target.closest('th');
  const indexThHead = Array.prototype.indexOf.call(tHeadCols, e.target);
  const indexThFoot = Array.prototype.indexOf.call(tFootCols, e.target);
  const people = [];

  for (const row of tBodyRows) {
    const person = {};

    person.name = row.cells[0].textContent;
    person.position = row.cells[1].textContent;
    person.office = row.cells[2].textContent;
    person.age = row.cells[3].textContent;
    person.salary = row.cells[4].textContent;
    people.push(person);
  }

  tHeadCols.forEach((el, i) => {
    if (i !== indexThHead) {
      el.className = '';
    }
  });

  tFootCols.forEach((el, i) => {
    if (i !== indexThFoot) {
      el.className = '';
    }
  });

  if (th.className === '') {
    th.className = 'ASC';

    const sortBy = th.textContent.toLowerCase();

    if (sortBy === 'salary') {
      people.sort((a, b) => salaryToNum(a[sortBy]) - salaryToNum(b[sortBy]));
    } else {
      people.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }

    for (let i = 0; i < tBodyRows.length; i++) {
      tBodyRows[i].cells[0].textContent = people[i].name;
      tBodyRows[i].cells[1].textContent = people[i].position;
      tBodyRows[i].cells[2].textContent = people[i].office;
      tBodyRows[i].cells[3].textContent = people[i].age;
      tBodyRows[i].cells[4].textContent = people[i].salary;
    }
  } else if (th.className === 'ASC') {
    th.className = '';

    const sortBy = th.textContent.toLowerCase();

    if (sortBy === 'salary') {
      people.sort((a, b) => salaryToNum(b[sortBy]) - salaryToNum(a[sortBy]));
    } else {
      people.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
    }

    for (let i = 0; i < tBodyRows.length; i++) {
      tBodyRows[i].cells[0].textContent = people[i].name;
      tBodyRows[i].cells[1].textContent = people[i].position;
      tBodyRows[i].cells[2].textContent = people[i].office;
      tBodyRows[i].cells[3].textContent = people[i].age;
      tBodyRows[i].cells[4].textContent = people[i].salary;
    }
  }
}

function toActive(e) {
  const tr = e.target.closest('tr');
  const indexTr = Array.prototype.indexOf.call(tRows, tr);

  if (tr.className === '') {
    tr.className = 'active';

    tRows.forEach((el, i) => {
      if (i !== indexTr) {
        el.className = '';
      }
    });
  }
}

table.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');
  const indexTr = Array.prototype.indexOf.call(tRows, tr);

  if (indexTr === 0 || indexTr === tRows.length - 1) {
    sortTable(e);
  } else {
    toActive(e);
  }
});

// ------------form-----------
const form = document.createElement('form');
const labelName = document.createElement('label');
const inputName = document.createElement('input');

labelName.textContent = 'Name:';
inputName.setAttribute('name', 'name');
inputName.setAttribute('type', 'text');
inputName.setAttribute('data-qa', 'name');
inputName.required = true;
labelName.append(inputName);

const labelPosition = document.createElement('label');
const inputPosition = document.createElement('input');

labelPosition.textContent = 'Position:';
inputPosition.setAttribute('name', 'position');
inputPosition.setAttribute('type', 'text');
inputPosition.setAttribute('data-qa', 'position');
labelPosition.append(inputPosition);

const labelOffice = document.createElement('label');
const select = document.createElement('select');
const optTokyo = document.createElement('option');
const optSingapore = document.createElement('option');
const optLondon = document.createElement('option');
const optNY = document.createElement('option');
const optEdinburgh = document.createElement('option');
const optSF = document.createElement('option');

labelOffice.textContent = 'Office:';
select.setAttribute('name', 'office');
select.setAttribute('data-qa', 'office');
select.required = true;
optTokyo.textContent = 'Tokyo';
optTokyo.setAttribute('value', 'Tokyo');
optSingapore.textContent = 'Singapore';
optSingapore.setAttribute('value', 'Singapore');
optLondon.textContent = 'London';
optLondon.setAttribute('value', 'London');
optNY.textContent = 'New York';
optNY.setAttribute('value', 'New York');
optEdinburgh.textContent = 'Edinburgh';
optEdinburgh.setAttribute('value', 'Edinburgh');
optSF.textContent = 'San Francisco';
optSF.setAttribute('value', 'San Francisco');
select.append(optTokyo, optSingapore, optLondon, optNY, optEdinburgh, optSF);
labelOffice.append(select);

const labelAge = document.createElement('label');
const inputAge = document.createElement('input');

labelAge.textContent = 'Age:';
inputAge.setAttribute('name', 'age');
inputAge.setAttribute('type', 'number');
inputAge.setAttribute('data-qa', 'age');
inputAge.required = true;
labelAge.append(inputAge);

const labelSalary = document.createElement('label');
const inputSalary = document.createElement('input');

labelSalary.textContent = 'Salary:';
inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'number');
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.required = true;
labelSalary.append(inputSalary);

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';

form.className = 'new-employee-form';
body.append(form);

form.append(
  labelName,
  labelPosition,
  labelOffice,
  labelAge,
  labelSalary,
  button,
);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const person = {};
  const inputs = form.querySelectorAll('input, select');

  inputs.forEach((input) => {
    person[input.name] = input.value;
  });

  const value = salaryToDollars(person.salary);

  person['salary'] = value;

  const pushNotification = (type) => {
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');

    div.className = 'notification';
    div.classList.add(type);
    div.setAttribute('data-qa', 'notification');
    div.style.visibility = 'visible';

    if (type === 'error') {
      h2.textContent = 'Error!!!';
      h2.className = 'title';

      p.textContent = `Your Name value has less than 4 letters or
        your Age value is less than 18 or more than 90 or
        some fild is missed`;
    } else {
      h2.textContent = 'Success!';
      h2.className = 'title';

      p.textContent = `Your data has been added to the table`;
    }
    div.append(h2, p);
    body.append(div);

    function hide(someDiv) {
      someDiv.style.visibility = 'hidden';
    }

    setTimeout(() => hide(div), 5000);
  };

  if (
    person.name.length < 4 ||
    +person.age < 18 ||
    +person.age > 90 ||
    person.position === ''
  ) {
    pushNotification('error');
  } else {
    const newRow = document.createElement('tr');
    const cellName = document.createElement('td');
    const cellPosition = document.createElement('td');
    const cellOffice = document.createElement('td');
    const cellAge = document.createElement('td');
    const cellSalary = document.createElement('td');

    cellName.textContent = person.name;
    cellPosition.textContent = person.position;
    cellOffice.textContent = person.office;
    cellAge.textContent = person.age;
    cellSalary.textContent = person.salary;

    newRow.append(cellName, cellPosition, cellOffice, cellAge, cellSalary);
    table.tBodies[0].append(newRow);
    pushNotification('success');
  }
  // console.log(value);

  form.reset();
});
