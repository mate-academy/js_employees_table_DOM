'use strict';

const table = document.querySelector('table');
const thead = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');

thead.forEach((header, index) => {
  header.addEventListener('click', () => {
    let order = header.dataset.order;

    if (!order || order === 'DESC') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }

    header.dataset.order = order;

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].textContent.trim();
      const cellB = rowB.cells[index].textContent.trim();

      if (index === 3) {
        switch (order) {
          case 'ASC':
            return Number(cellA) - Number(cellB);
          case 'DESC':
            return Number(cellB) - Number(cellA);
        }
      } else if (index === 4) {
        switch (order) {
          case 'ASC':
            return (
              Number(cellA.replace(/[$,]/g, '')) -
              Number(cellB.replace(/[$,]/g, ''))
            );
          case 'DESC':
            return (
              Number(cellB.replace(/[$,]/g, '')) -
              Number(cellA.replace(/[$,]/g, ''))
            );
        }
      } else {
        switch (order) {
          case 'ASC':
            return cellA.localeCompare(cellB);
          case 'DESC':
            return cellB.localeCompare(cellA);
        }
      }
    });

    tbody.append(...rows);
  });
});

tbody.addEventListener('click', (e) => {
  tbody.querySelectorAll('tr').forEach((tr) => {
    tr.classList.remove('active');
  });

  const row = e.target.closest('tr');

  row.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

function generateElement(position, object) {
  const { title, field, type } = object;
  const label = document.createElement('label');

  label.textContent = title.charAt(0).toUpperCase() + title.slice(1) + ':';

  let fieldPlace = '';

  if (typeof field === 'string') {
    fieldPlace = document.createElement(field);
  } else {
    fieldPlace = document.createElement('select');

    field.forEach((el) => {
      const option = document.createElement('option');

      option.textContent = el;
      fieldPlace.append(option);
    });
  }

  fieldPlace.setAttribute('name', title);
  fieldPlace.dataset.qa = title;
  fieldPlace.setAttribute('type', type);
  fieldPlace.setAttribute('required', '');

  label.append(fieldPlace);

  position.append(label);
}

const objectName = {
  title: 'name',
  field: 'input',
  type: 'text',
};

const objectPosition = {
  title: 'position',
  field: 'input',
  type: 'text',
};

const objectOffice = {
  title: 'office',
  field: [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ],
  type: 'select',
};

const objectAge = {
  title: 'age',
  field: 'input',
  type: 'number',
};

const objectSalary = {
  title: 'salary',
  field: 'input',
  type: 'number',
};

generateElement(form, objectName);
generateElement(form, objectPosition);
generateElement(form, objectOffice);
generateElement(form, objectAge);
generateElement(form, objectSalary);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');

form.append(button);
table.after(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();
});

button.addEventListener('click', () => {
  const formData = new FormData(form);
  const formObject = {};

  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  let bull = true;

  if (formObject.name.length < 4) {
    notification('Name must be longer than 4 letters', false);
    bull = false;
  }

  if (+formObject.age <= 18 || +formObject.age >= 90) {
    notification('Age must be between 18 and 90', false);
    bull = false;
  }

  const row = document.createElement('tr');

  formObject.salary = '$' + formObject.salary;

  for (const key in formObject) {
    const call = document.createElement('td');

    call.textContent = formObject[key];
    row.append(call);
  }

  if (bull) {
    notification('Employee successfully added', true);
    tbody.append(row);
  }
});

const body = document.querySelector('body');

function notification(massage, bull) {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.dataset.qa = 'notification';
  div.classList.add('notification');

  p.textContent = massage;

  if (bull) {
    div.classList.add('success');
    h2.textContent = 'Success';
  } else {
    div.classList.add('error');
    h2.textContent = 'Error';
  }

  div.append(h2);
  div.append(p);
  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

const cells = document.querySelectorAll('td');

cells.forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const content = cell.textContent;
    const input = document.createElement('input');

    input.setAttribute('value', content);
    input.classList.add('cell-input');

    cell.textContent = '';
    cell.append(input);

    input.addEventListener('blur', () => {
      cell.textContent = input.value || content;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        cell.textContent = input.value || content;
      }
    });
  });
});
