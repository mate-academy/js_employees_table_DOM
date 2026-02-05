'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const thead = table.querySelector('thead');
const formContainer = document.createElement('div');
const currentSort = { index: -1, asc: true };

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');
  const index = th.cellIndex;
  const type = th.textContent.trim();
  const rows = [...tbody.rows];
  const clean = (val) => val.replace(/[$,]/g, '');

  if (!th) {
    return;
  }

  if (currentSort.index === index) {
    currentSort.asc = !currentSort.asc;
  } else {
    currentSort.index = index;
    currentSort.asc = true;
  }

  rows.sort((a, b) => {
    let valA = a.cells[index].textContent.trim();
    let valB = b.cells[index].textContent.trim();

    if (['Age', 'Salary'].includes(type)) {
      valA = Number(clean(valA));
      valB = Number(clean(valB));

      return currentSort.asc ? valA - valB : valB - valA;
    }

    return currentSort.asc
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  tbody.append(...rows);
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  const activeRow = tbody.querySelector('.active');

  if (!row) {
    return;
  }

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

formContainer.innerHTML = `
  <form class="new-employee-form">
    <label>Name: <input name="name" data-qa="name" type="text" required></label>
    <label>Position: <input name="position" data-qa="position" type="text" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" data-qa="age" type="number" required></label>
    <label>Salary: <input name="salary" data-qa="salary" type="number" required></label>
    <button type="submit">Save to table</button>
  </form>
`;

document.body.append(formContainer);

const form = formContainer.querySelector('form');

const pushNotification = (posTop, posRight, title, description, type) => {
  const messageBlock = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageInfo = document.createElement('p');

  messageBlock.dataset.qa = 'notification';

  messageBlock.classList.add('notification', type);
  messageTitle.classList.add('title');

  messageTitle.innerText = title;
  messageInfo.innerText = description;

  messageBlock.style.position = 'absolute';
  messageBlock.style.top = `${posTop}px`;
  messageBlock.style.right = `${posRight}px`;

  messageBlock.append(messageTitle, messageInfo);
  document.body.append(messageBlock);

  setTimeout(() => {
    messageBlock.style.display = 'none';
  }, 2000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const { name: employeeName, position, office, age, salary } = form.elements;
  const ageVal = Number(age.value);
  const nameVal = employeeName.value.trim();
  const newRow = tbody.insertRow();

  if (nameVal.length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Name must be at least 4 letters',
      'error',
    );

    return;
  }

  if (ageVal < 18 || ageVal > 90) {
    pushNotification(10, 10, 'Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  newRow.innerHTML = `
    <td>${nameVal}</td>
    <td>${position.value}</td>
    <td>${office.value}</td>
    <td>${age.value}</td>
    <td>$${Number(salary.value).toLocaleString()}</td>
  `;

  pushNotification(
    10,
    10,
    'Success',
    'Employee added successfully!',
    'success',
  );

  form.reset();
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  const activeInput = tbody.querySelector('.cell-input');

  if (activeInput) {
    activeInput.blur();
  }

  if (td.querySelector('.cell-input')) {
    return;
  }

  const originalValue = td.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = originalValue;

  td.textContent = '';
  td.append(input);
  input.focus();

  const save = () => {
    const newValue = input.value.trim();

    td.textContent = newValue || originalValue;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});
