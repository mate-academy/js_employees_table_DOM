'use strict';

// write code here
const table = document.querySelector('table');
const tBody = document.querySelector('tbody');
const form = document.createElement('form');
const nameInput = document.createElement('input');
const positionInput = document.createElement('input');
const officeISelect = document.createElement('select');
const ageInput = document.createElement('input');
const salaryInput = document.createElement('input');
const button = document.createElement('button');

const labelN = document.createElement('label');
const labelP = document.createElement('label');
const labelO = document.createElement('label');
const labelA = document.createElement('label');
const labelS = document.createElement('label');

form.className = 'new-employee-form';
nameInput.dataset.qa = 'name';
positionInput.dataset.qa = 'position';
officeISelect.dataset.qa = 'office';
ageInput.dataset.qa = 'age';
salaryInput.dataset.qa = 'salary';
button.innerHTML = 'Save to table';

labelN.innerHTML = nameInput.dataset.qa.toUpperCase()[0]
+ nameInput.dataset.qa.slice(1) + ':';

labelP.innerHTML = positionInput.dataset.qa.toUpperCase()[0]
+ positionInput.dataset.qa.slice(1) + ':';

labelO.innerHTML = officeISelect.dataset.qa.toUpperCase()[0]
+ officeISelect.dataset.qa.slice(1) + ':';

labelA.innerHTML = ageInput.dataset.qa.toUpperCase()[0]
+ ageInput.dataset.qa.slice(1) + ':';

labelS.innerHTML = salaryInput.dataset.qa.toUpperCase()[0]
+ salaryInput.dataset.qa.slice(1) + ':';

labelN.append(nameInput);
labelP.append(positionInput);
labelO.append(officeISelect);
labelA.append(ageInput);
labelS.append(salaryInput);
form.append(labelN, labelP, labelO, labelA, labelS, button);
document.body.append(form);

const contry = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];

contry.forEach((nameContry) => {
  const option = document.createElement('option');

  officeISelect.append(option);
  officeISelect.value = ' ';

  option.textContent = nameContry;
});

const label = document.querySelectorAll('label');

for (const item of label) {
  for (const addAtt of item.childNodes) {
    if (addAtt.tagName !== undefined && addAtt.dataset.qa === 'age') {
      addAtt.type = 'number';
    }

    if (addAtt.tagName !== undefined && addAtt.dataset.qa === 'salary') {
      addAtt.type = 'number';
    }
  }
};

form.addEventListener('click', (e) => {
  e.preventDefault();

  const target = e.target;
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  const str = `${salaryInput.value}`;
  const dig = str.split('');
  let newValue = '';

  if (dig.length > 3) {
    for (let i = dig.length - 3; i > 0; i = i - 3) {
      dig.splice(i, 0, ',');
    }
    newValue = dig.join('');
  }

  if (nameInput.value.length >= 4
    && (ageInput.value >= 18 && ageInput.value <= 90)
    && positionInput.value.length > 0 && salaryInput.value > 0
    && officeISelect.value !== '' && target.tagName === 'BUTTON') {
    const colsLength = table.rows[0].cells.length;
    const newRow = table.insertRow(-1);
    const tr = document.createElement('tr');

    div.dataset.qa = 'notification';
    div.classList = 'notification success';
    h2.classList = 'title';
    h2.textContent = 'Success!';
    p.textContent = 'Added to the table successfully!';
    document.body.append(div);
    div.append(h2, p);

    setTimeout(() => {
      div.remove();
    }, 2000);

    for (let i = 0; i < colsLength; i++) {
      tr.appendChild(newRow.insertCell(-1));
      tBody.appendChild(tr);
    }
    tr.children[0].innerText = nameInput.value;
    tr.children[1].textContent = positionInput.value;
    tr.children[2].textContent = officeISelect.value;
    tr.children[3].textContent = `${ageInput.value}`;

    if (salaryInput.value.length > 3) {
      tr.children[4].textContent = `$${newValue}`;
    } else {
      tr.children[4].textContent = `$${salaryInput.value}`;
    }
  }

  if (((nameInput.value.length > 0 && nameInput.value.length < 4)
    || (ageInput.value < 18 && ageInput.value > 90))
    && target.tagName === 'BUTTON') {
    div.dataset.qa = 'notification';
    div.classList = 'notification error';
    h2.classList = 'title';
    h2.textContent = 'Error!';

    p.textContent = 'The name must be at least 4 characters long.\n '
    + 'Age must be between 18 and 90 years old.';
    document.body.append(div);
    div.append(h2, p);

    setTimeout(() => {
      div.remove();
    }, 2000);
  }

  if ((!nameInput.value
    || !ageInput.value.length
    || !positionInput.value
    || !salaryInput.value
    || officeISelect.value === '')
    && target.tagName === 'BUTTON') {
    div.dataset.qa = 'notification';
    div.classList = 'notification warning';
    h2.classList = 'title';
    h2.textContent = 'Warning!!!';
    p.textContent = 'All fields must be filled';
    document.body.append(div);
    div.append(h2, p);

    setTimeout(() => {
      div.remove();
    }, 2000);
  }
});

const sortTable = (index, order) => {
  const collator = new Intl.Collator([], { numeric: true });
  const compare = (rowA, rowB) => {
    const rowDataA = rowA.cells[index].innerHTML;
    const rowDataB = rowB.cells[index].innerHTML;

    if (order === 1) {
      return collator.compare(rowDataA, rowDataB);
    }

    return -(collator.compare(rowDataA, rowDataB));
  };

  const column = [].slice.call(tBody.rows);

  column.sort(compare);
  table.removeChild(tBody);

  for (let i = 0; i < column.length; i++) {
    tBody.appendChild(column[i]);
  }

  table.appendChild(tBody);
};

table.addEventListener('click', (e) => {
  const el = e.target;

  if (el.nodeName !== 'TH') {
    for (const trBody of tBody.children) {
      if (trBody.classList.contains('active')) {
        trBody.classList.remove('active');
      }
    }

    const rowClass = el.parentNode;

    return rowClass.classList.toggle('active');
  }

  const order = (el.dataset.type = -(el.dataset.type || -1));
  const index = el.cellIndex;

  sortTable(index, order);
});
