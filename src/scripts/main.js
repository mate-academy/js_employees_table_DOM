'use strict';

// write code here
const headElement = document.querySelector('thead');
const tableElement = document.querySelector('tbody');

const clickOnHeaderName = () => {
  let isAscending = true;

  // eslint-disable-next-line no-shadow
  headElement.addEventListener('click', (event) => {
    const clickName = event.target;

    if (clickName.textContent.trim().toLowerCase() === 'name') {
      const rows = Array.from(tableElement.querySelectorAll('tr'));

      const nameRowPairs = rows.map((row) => {
        const nameElements = row.firstElementChild;

        const nameOfElement = nameElements.textContent.trim();

        return { nameOfElement, row };
      });

      nameRowPairs.sort((a, b) =>
        isAscending
          ? a.nameOfElement.localeCompare(b.nameOfElement)
          : b.nameOfElement.localeCompare(a.nameOfElement),
      );

      isAscending = !isAscending;

      tableElement.innerHTML = '';
      nameRowPairs.forEach((pair) => tableElement.appendChild(pair.row));
    }
  });
};

const clickOnHeaderAge = () => {
  let isAscending = true;

  // eslint-disable-next-line no-shadow
  headElement.addEventListener('click', (event) => {
    const clickAge = event.target;

    if (clickAge.textContent.trim().toLowerCase() === 'age') {
      const rows = Array.from(tableElement.querySelectorAll('tr'));

      const ageRowPairs = rows.map((row) => {
        const cells = row.children;
        const ageElements = cells[cells.length - 2];

        const ageOfElement = ageElements.textContent;

        return { ageOfElement, row };
      });

      ageRowPairs.sort((a, b) =>
        isAscending
          ? a.ageOfElement - b.ageOfElement
          : b.ageOfElement - a.ageOfElement);

      isAscending = !isAscending;

      tableElement.innerHTML = '';
      ageRowPairs.forEach((pair) => tableElement.appendChild(pair.row));
    }
  });
};

const clickOnHeaderSalary = () => {
  let isAscending = true;

  // eslint-disable-next-line no-shadow
  headElement.addEventListener('click', (event) => {
    const clickSalary = event.target;

    if (clickSalary.textContent.trim().toLowerCase() === 'salary') {
      const rows = Array.from(tableElement.querySelectorAll('tr'));

      const salaryRowPairs = rows.map((row) => {
        const salaryElement = row.lastElementChild;
        const salary = parseFloat(
          salaryElement.textContent.trim().replace('$', '').replace(',', ''),
        );

        return { salary, row };
      });

      salaryRowPairs.sort((a, b) =>
        isAscending ? a.salary - b.salary : b.salary - a.salary);

      isAscending = !isAscending;

      tableElement.innerHTML = '';
      salaryRowPairs.forEach((pair) => tableElement.appendChild(pair.row));
    }
  });
};

const selectRow = () => {
  // eslint-disable-next-line no-shadow
  tableElement.addEventListener('click', (event) => {
    const clickRow = event.target.closest('tr');

    if (clickRow) {
      Array.from(tableElement.getElementsByTagName('tr')).forEach((row) => {
        if (clickRow === row) {
          row.classList.add('active');
        } else {
          row.classList.remove('active');
        }
      });
    }
  });
};

const pushNotification = (posTop, posRight, title, description, type) => {
  // write code here
  const body = document.querySelector('body');

  const message = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  message.setAttribute('data-qa', 'notification');

  titleElement.textContent = title;
  descriptionElement.textContent = description;

  message.classList.add('notification');
  message.classList.add(`${type}`);
  titleElement.classList.add('title');

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  setTimeout(() => {
    if (body.contains(message)) {
      body.removeChild(message);
    }
  }, 2000);

  body.insertBefore(message, body.lastElementChild);
  message.appendChild(titleElement);
  message.appendChild(descriptionElement);
};

const form = () => {
  const table = document.querySelector('table');
  const formElement = document.createElement('form');
  const rows = Array.from(headElement.querySelectorAll('th'));
  const cities = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  formElement.classList.add('new-employee-form');

  table.after(formElement);

  rows.forEach((row) => {
    const labelElement = document.createElement('label');

    formElement.appendChild(labelElement);
    labelElement.textContent = `${row.textContent}:`;

    if (labelElement.textContent.toLowerCase() === 'office:') {
      const selectElement = document.createElement('select');

      labelElement.appendChild(selectElement);
      selectElement.setAttribute('data-qa', `${row.textContent.toLowerCase()}`);
      selectElement.setAttribute('name', `${row.textContent.toLowerCase()}`);

      cities.forEach((city) => {
        const optionElement = document.createElement('option');

        selectElement.appendChild(optionElement);
        optionElement.textContent = city;
      });
    } else {
      const inputElement = document.createElement('input');

      labelElement.appendChild(inputElement);
      inputElement.setAttribute('data-qa', `${row.textContent.toLowerCase()}`);
      inputElement.setAttribute('name', `${row.textContent.toLowerCase()}`);
      inputElement.setAttribute('type', 'text');
      inputElement.setAttribute('required', '');

      if (
        inputElement.getAttribute('data-qa') === 'age' ||
        inputElement.getAttribute('data-qa') === 'salary'
      ) {
        inputElement.setAttribute('type', 'number');
      }
    }
  });

  const buttonElement = document.createElement('button');
  const formElements = document.querySelectorAll('label');

  formElement.appendChild(buttonElement);
  buttonElement.setAttribute('type', 'submit');
  buttonElement.textContent = 'Save to table';

  buttonElement.addEventListener('click', (e) => {
    e.preventDefault();

    if (formElement.checkValidity()) {
      pushNotification(
        10,
        10,
        'Success',
        'New row has been successfully added.',
        'success',
      );

      const newRow = document.createElement('tr');

      tableElement.appendChild(newRow);

      formElements.forEach((element) => {
        const newCell = document.createElement('td');
        const selectOrInput = element.querySelector('input, select');

        newRow.appendChild(newCell);

        if (selectOrInput.getAttribute('data-qa') === 'salary') {
          const newSalaryValue = parseFloat(selectOrInput.value).toLocaleString(
            'en-US',
          );

          newCell.textContent = `$${newSalaryValue}`;
        } else {
          newCell.textContent = selectOrInput.value;
        }
      });
      formElement.reset();
    } else {
      let isValid = true;

      formElements.forEach((element) => {
        const selectOrInput = element.querySelector('input, select');
        const dataQa = selectOrInput.getAttribute('data-qa');

        if (dataQa === 'name' && selectOrInput.value.length < 4) {
          pushNotification(
            10,
            10,
            'Validation Error',
            'Name must be at least 4 characters.',
            'error',
          );
          isValid = false;
        }

        if (
          dataQa === 'age' &&
          (selectOrInput.value < 18 || selectOrInput.value > 90)
        ) {
          pushNotification(
            150,
            10,
            'Validation Error',
            'Age must be between 18 and 90',
            'error',
          );
          isValid = false;
        }
      });
    }
  });
};

clickOnHeaderName();
clickOnHeaderAge();
clickOnHeaderSalary();
selectRow();
form();
