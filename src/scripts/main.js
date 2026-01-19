const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
const heads = tHead.querySelectorAll('th');
const rows = Array.from(tBody.querySelectorAll('tr'));
let forward = true;
let head = null;
const form = document.createElement('form');

const sortRowsForward = (column) =>
  rows.sort((a, b) => {
    const trimVal = (val) => {
      let value = val
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim();

      if (value[0] === '$') {
        value = Number(value.replace(/[^0-9.-]+/g, ''));
      }

      return value;
    };
    const aTrimmed = trimVal(a);
    const bTrimmed = trimVal(b);

    if (typeof aTrimmed === 'string') {
      return aTrimmed.localeCompare(bTrimmed);
    }

    return aTrimmed - bTrimmed;
  });

const sortRowsBackward = (column) =>
  rows.sort((a, b) => {
    const trimVal = (val) => {
      let value = val
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim();

      if (value[0] === '$') {
        value = Number(value.replace(/[^0-9.-]+/g, ''));
      }

      return value;
    };
    const aTrimmed = trimVal(a);
    const bTrimmed = trimVal(b);

    if (typeof aTrimmed === 'string') {
      return bTrimmed.localeCompare(aTrimmed);
    }

    return bTrimmed - aTrimmed;
  });

const rebuildTable = (column) => {
  let sortedRows = '';

  if (column !== head) {
    head = column;
    forward = true;
  } else {
    forward = false;
  }

  if (forward === true) {
    sortedRows = sortRowsForward(column);
  }

  if (forward === false) {
    sortedRows = sortRowsBackward(column);
  }

  // forward = !forward;

  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }
  tBody.append(...sortedRows);
};

const pushNotification = (titleText, description, typeText) => {
  const popup = document.createElement('div');
  const h2 = document.createElement('h2');
  const text = document.createElement('p');

  popup.classList.add('notification', typeText);
  popup.setAttribute('data-qa', 'notification');
  h2.classList.add('title');
  h2.textContent = titleText;
  text.textContent = description;
  popup.append(h2, text);

  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
};

const formDataValidator = (data) => {
  if (data.name.length < 4 || data.age < 18 || data.age > 90) {
    pushNotification('Error', 'Check Input Data', 'error');

    return false;
  }
  pushNotification('Success', 'Data Added', 'Success');

  return true;
};
const whoIsNotValid = (data) => {
  if (data.name.length < 4) {
    return 'name';
  } else {
    return 'age';
  }
};

const addToTable = (employee) => {
  const tableRow = document.createElement('tr');

  tableRow.innerHTML = `
    <td>${employee.name}</td>
    <td>${employee.position}</td>
    <td>${employee.office}</td>
    <td>${employee.age}</td>
    <td>${employee.salary}</td>
  `;
  tBody.appendChild(tableRow);
};

for (const cell of heads) {
  cell.addEventListener('click', (e) => {
    rebuildTable(e.target.cellIndex);
  });
}

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office: <select name="office" type="select" data-qa="office" required>
  <option value="tokyo">Tokyo</option>
  <option value="singapore">Singapore</option>
  <option value="london">London</option>
  <option value="new-york">New York</option>
  <option value="edinburgh">Edinburgh</option>
  <option value="san-francisco">San Francisco</option>
  </select></label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <button type="submit">Save to table</button>
  `;

for (const row of rows) {
  row.addEventListener('click', (e) => {
    for (const el of rows) {
      el.classList.remove('active');
    }
    row.classList.add('active');
  });

  row.addEventListener('dblclick', (e) => {
    row.remove();
  });
}

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employee = {
    name: formData.get('name').trim(),
    position: formData.get('position').trim(),
    office: formData.get('office'),
    age: Number(formData.get('age')),
    salary: Number(formData.get('salary')),
  };

  if (!formDataValidator(employee)) {
    if (whoIsNotValid(employee) === 'name') {
      form.name.style.borderColor = 'red';
      form.name.style.borderWidth = '2px';
    }

    if (whoIsNotValid(employee) === 'age') {
      form.age.style.borderColor = 'red';
      form.name.style.borderWidth = '2px';
    }
  }

  if (formDataValidator(employee)) {
    addToTable(employee);
  }
});
