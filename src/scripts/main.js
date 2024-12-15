'use strict';

function rowToObj(row) {
  const cells = row.querySelectorAll('td');

  return {
    name: cells[0]?.textContent.trim() || null,
    position: cells[1]?.textContent.trim() || null,
    office: cells[2]?.textContent.trim() || null,
    age: Number(cells[3]?.textContent.trim()) || null,
    salary: parseFloat(cells[4]?.textContent.replace(/[$,]/g, '')) || null,
  };
}

function sortTableArr(a, b, col, direction) {
  if (a[col] < b[col]) {
    return direction === 'asc' ? -1 : 1;
  }

  if (a[col] > b[col]) {
    return direction === 'asc' ? 1 : -1;
  }

  return 0;
}

function sortTable(element) {
  if (element.tagName === 'TH') {
    const col = element.textContent.toLowerCase();
    const tbody = document.querySelector('tbody');
    const arr = [...tbody.querySelectorAll('tr')].map((row) => rowToObj(row));

    const currentDirection =
      element.getAttribute('data-sort-direction') || 'desc';

    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    const lastSortedColumn = document.querySelector('[data-sort-direction]');

    if (lastSortedColumn && lastSortedColumn !== element) {
      lastSortedColumn.removeAttribute('data-sort-direction');
    }

    element.setAttribute('data-sort-direction', newDirection);

    arr.sort((a, b) => sortTableArr(a, b, col, newDirection));

    tbody.innerHTML = '';

    arr.forEach((obj) => {
      const newRow = document.createElement('tr');

      Object.values(obj).forEach((data, index) => {
        const cell = document.createElement('td');

        cell.textContent =
          index === 4 && typeof data === 'number'
            ? `$${data.toLocaleString('en-US')}`
            : data;
        newRow.appendChild(cell);
      });

      tbody.appendChild(newRow);
    });
  }
}

function setActiveRow(cell) {
  const oldTarget = document.querySelector('.active');

  if (oldTarget) {
    oldTarget.classList.remove('active');
  }

  cell.parentElement.classList.add('active');
}

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  function createLabeledInput(inputName, inputType) {
    const label = document.createElement('label');
    const input = document.createElement('input');

    input.name = inputName;
    input.type = inputType;
    input.setAttribute('data-qa', inputName);
    label.textContent = inputName[0].toUpperCase() + inputName.slice(1) + ':';
    label.appendChild(input);

    return label;
  }

  const labelName = createLabeledInput('name', 'text');

  form.appendChild(labelName);

  const labelPosition = createLabeledInput('position', 'text');

  form.appendChild(labelPosition);

  const labelOffice = document.createElement('label');

  labelOffice.textContent = 'Office:';

  const selectOffice = document.createElement('select');

  selectOffice.name = 'office';
  selectOffice.setAttribute('data-qa', 'office');

  const options = [
    { value: 'Tokyo', text: 'Tokyo' },
    { value: 'Singapore', text: 'Singapore' },
    { value: 'London', text: 'London' },
    { value: 'New York', text: 'New York' },
    { value: 'Edinburgh', text: 'Edinburgh' },
    { value: 'San Francisco', text: 'San Francisco' },
  ];

  options.forEach((option) => {
    const optionElement = document.createElement('option');

    optionElement.value = option.value;
    optionElement.textContent = option.text;
    selectOffice.appendChild(optionElement);
  });

  labelOffice.appendChild(selectOffice);
  form.appendChild(labelOffice);

  const labelAge = createLabeledInput('age', 'number');

  form.appendChild(labelAge);

  const labelSalary = createLabeledInput('salary', 'number');

  form.appendChild(labelSalary);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  document.body.appendChild(form);

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const userName = form.elements['name'].value.trim();
    const position = form.elements['position'].value.trim();
    const office = form.elements['office'].value.trim();
    const age = parseInt(form.elements['age'].value, 10);
    const salary = parseFloat(form.elements['salary'].value);

    function pushNotify(text, type = 'success') {
      const notify = document.createElement('div');
      const notifyTitle = document.createElement('h2');
      const notifyText = document.createElement('p');

      notify.appendChild(notifyTitle);
      notify.appendChild(notifyText);
      notify.classList = `notification ${type}`;
      notifyTitle.classList.add('title');
      notify.setAttribute('data-qa', 'notification');

      notifyTitle.textContent = type[0].toUpperCase() + type.slice(1) + '!';
      notifyText.textContent = text;

      document.body.appendChild(notify);

      window.setTimeout(() => notify.remove(), 2000);
    }

    if (!userName || !position || !office || isNaN(age) || isNaN(salary)) {
      pushNotify('All fields are required and must be valid.', 'error');

      return;
    }

    if (userName.length < 4) {
      pushNotify('Name is too short. Min length is 4.', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      pushNotify('Age can`t be < 18 or > 90', 'error');

      return;
    }

    const tbody = document.querySelector('tbody');
    const newRow = document.createElement('tr');

    [
      userName,
      position,
      office,
      age,
      `$${salary.toLocaleString('en-US')}`,
    ].forEach((text) => {
      const cell = document.createElement('td');

      cell.textContent = text;
      newRow.appendChild(cell);
    });

    tbody.appendChild(newRow);

    form.reset();

    pushNotify('Success');
  });
}

document.addEventListener('click', (ev) => {
  if (ev.target.tagName === 'TH') {
    sortTable(ev.target);
  } else if (ev.target.tagName === 'TD') {
    setActiveRow(ev.target);
  }
});

createForm();
