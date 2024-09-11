'use strict';

// write code here

// #region direct variables
const el = {
  body: document.body,
  table: document.querySelector('table'),
  tableBody: document.querySelector('tbody'),
};
let DefaultSortDirection = 'up';

function capitalizer(string) {
  return `${string[0].toUpperCase()}${string.split('').slice(1).join('')}`;
}
// #endregion

// #region row selecting and sorting implementation

function selectRow(rowElement) {
  for (const row of el.tableBody.children) {
    row.classList.remove('active');
  }

  if (rowElement) {
    rowElement.className = 'active';
  }
}

function sortTable(tableElement, index, direction = 'up') {
  function convertToNumber(string) {
    return Number(string.replace(/[$,]/g, ''));
  }

  function sorter(arr) {
    return arr.sort((a, b) => {
      const colunmOne = [...a.children][index].innerText;
      const colunmTwo = [...b.children][index].innerText;

      if (!isNaN(convertToNumber(colunmOne))) {
        return direction === 'up'
          ? convertToNumber(colunmTwo) - convertToNumber(colunmOne)
          : convertToNumber(colunmOne) - convertToNumber(colunmTwo);
      } else {
        return direction === 'up'
          ? colunmTwo.localeCompare(colunmOne)
          : colunmOne.localeCompare(colunmTwo);
      }
    });
  }

  const newRows = [...tableElement.children];

  tableElement.innerHTML = '';
  sorter(newRows).forEach((row) => tableElement.appendChild(row));
}
// #endregion

// #region handling row sorting and selecting

function handleSelect(eventTarget) {
  return eventTarget.tagName === 'TD' &&
    eventTarget.closest('TR').parentNode.tagName === 'TBODY'
    ? selectRow(eventTarget.closest('tr'))
    : selectRow();
}

function handleSort(eventTarget) {
  if (eventTarget.tagName === 'TH') {
    const cloneCollection = [...eventTarget.parentNode.children];
    const index = cloneCollection.indexOf(eventTarget, 0);

    DefaultSortDirection = DefaultSortDirection === 'up' ? 'down' : 'up';
    sortTable(el.tableBody, index, DefaultSortDirection);
  }
}

el.body.addEventListener('click', (ev) => {
  handleSelect(ev.target);
  handleSort(ev.target);
});
// #endregion

// #region build notification message

function pushNotification(type = 'success') {
  const title = type === 'error' ? 'Error!' : 'Success!';
  const description =
    type === 'error'
      ? 'Please fill correct data in fields with mistakes'
      : 'Great job! New employee was added to the table';

  // write code here
  const elements = {
    container: document.createElement('div'),
    title: document.createElement('h2'),
    description: document.createElement('p'),
  };

  // build DOM
  document.body.appendChild(elements.container);
  elements.container.appendChild(elements.title);
  elements.container.appendChild(elements.description);

  // apply styles
  elements.container.className = 'notification';
  elements.container.classList.add(type);
  elements.container.setAttribute('data-qa', 'notification');
  elements.title.className = 'title';

  // fill content
  elements.title.textContent = title;
  elements.description.textContent = description;

  // apply coordinates
  elements.container.style.top = `10px`;
  elements.container.style.right = `10px`;

  // desappire after delay 2sec
  setTimeout(() => {
    elements.container.style.display = 'none';
  }, 2000);
}
// #endregion

// #region form building and handling submit

function buildForm() {
  const form = {
    form: document.createElement('form'),
    label: document.createElement('label'),
    input: document.createElement('input'),
    select: document.createElement('select'),
    option: document.createElement('option'),
    button: document.createElement('button'),
  };

  function buildFormElement(parentElement, childElement, type, InputName) {
    const parentClone = parentElement.cloneNode(true);
    const childClone = childElement.cloneNode(true);

    childClone.setAttribute('type', type);
    childClone.setAttribute('name', InputName);
    childClone.setAttribute('data-qa', InputName);

    const capitalizedName = capitalizer(InputName) + ':';

    parentClone.textContent = capitalizedName;
    parentClone.appendChild(childClone);

    if (childClone.name === 'office') {
      const offices = [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ];

      // create options in select
      offices.forEach((item) => {
        const newOption = form.option.cloneNode(true);

        childClone.appendChild(newOption);
        newOption.textContent = item;
        newOption.setAttribute('value', item);
      });
    }

    return parentClone;
  }

  el.body.appendChild(form.form);
  form.form.className = 'new-employee-form';

  form.form.appendChild(
    buildFormElement(form.label, form.input, 'text', 'name'),
  );

  form.form.appendChild(
    buildFormElement(form.label, form.input, 'text', 'position'),
  );

  form.form.appendChild(
    buildFormElement(form.label, form.select, '', 'office'),
  );

  form.form.appendChild(
    buildFormElement(form.label, form.input, 'number', 'age'),
  );

  form.form.appendChild(
    buildFormElement(form.label, form.input, 'number', 'salary'),
  );

  form.form.appendChild(form.button);
  form.button.setAttribute('type', 'submit');
  form.button.textContent = 'Save to table';
}

function addToTable(nameInput, position, office, age, salary) {
  const row = {
    row: document.createElement('tr'),
    column: document.createElement('td'),
  };

  function salaryConverter(string) {
    return Number(string).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  function capitalizeCellData(string) {
    return string
      .split(' ')
      .map((word) => capitalizer(word))
      .join(' ');
  }

  const nameCol = row.column.cloneNode();
  const positionCol = row.column.cloneNode();
  const officeCol = row.column.cloneNode();
  const ageCol = row.column.cloneNode();
  const salaryCol = row.column.cloneNode();

  nameCol.textContent = capitalizeCellData(nameInput);
  positionCol.textContent = capitalizeCellData(position);
  officeCol.textContent = office;
  ageCol.textContent = age;
  salaryCol.textContent = salaryConverter(salary);

  row.row.appendChild(nameCol);
  row.row.appendChild(positionCol);
  row.row.appendChild(officeCol);
  row.row.appendChild(ageCol);
  row.row.appendChild(salaryCol);

  el.tableBody.appendChild(row.row);
}

function handleFormSubmit(formData) {
  const dataObject = {};
  const isStringCorrect = (string) => /[a-zA-Z ]/g.test(string);
  let errors = 0;

  function drawInputError(inputName) {
    const inputs = currentForm.querySelectorAll('input');

    if (inputName) {
      const errorInput = [...inputs].filter(
        (item) => item.name === inputName,
      )[0];

      errorInput.style.outline = '2px solid red';
    } else {
      [...inputs].forEach((item) => {
        item.style.outline = '';
      });
    }
  }

  drawInputError();

  for (const [key, value] of formData.entries()) {
    dataObject[key] = value;

    switch (key) {
      case 'name':
        if (!isStringCorrect(value) || value.length < 4) {
          drawInputError(key);
          errors++;
        }
        break;
      case 'position':
        if (!isStringCorrect(value)) {
          drawInputError(key);
          errors++;
        }
        break;
      case 'age':
        if (Number(value) > 90 || Number(value) < 18) {
          drawInputError(key);
          errors++;
        }
        break;
    }
  }

  if (errors === 0) {
    pushNotification();
    drawInputError();
    currentForm.reset();

    addToTable(
      dataObject.name,
      dataObject.position,
      dataObject.office,
      dataObject.age,
      dataObject.salary,
    );
  } else {
    pushNotification('error');
  }
}

buildForm();

const currentForm = document.querySelector('.new-employee-form');

currentForm.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const formValues = new FormData(currentForm);

  handleFormSubmit(formValues);
});
// #endregion
