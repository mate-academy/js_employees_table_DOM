'use strict';

const th = document.querySelector('thead');
const tbody = document.querySelector('tbody');

th.addEventListener('click', (e) => {
  sortTBody(e.target.cellIndex);
});

function sortTBody(indexCell) {
  tbody.classList.toggle('ASC');

  const sortType = tbody.classList.contains('ASC');
  const tbodyCopyContent = [...tbody.rows];

  tbodyCopyContent.sort((rowA, rowB) => {
    if (indexCell === 4) {
      const cellA = rowA.cells[indexCell].textContent.replace(/[$,]/g, '');
      const cellB = rowB.cells[indexCell].textContent.replace(/[$,]/g, '');

      return sortType ? cellA - cellB : cellB - cellA;
    } else {
      const cellA = rowA.cells[indexCell].textContent.trim();
      const cellB = rowB.cells[indexCell].textContent.trim();

      return sortType ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    }
  });

  tbody.innerHTML = '';
  tbodyCopyContent.forEach((x) => tbody.appendChild(x));
}

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('TR');

  [...tbody.children].forEach((x) => {
    if (tr !== x) {
      x.classList.remove('active');
    }
  });
  tr.classList.toggle('active');
});

function addForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  ['name', 'position', 'office', 'age', 'salary'].forEach((x) => {
    const label = document.createElement('label');

    label.textContent = x.slice(0, 1).toUpperCase() + x.slice(1) + ':';

    if (x === 'office') {
      const select = document.createElement('select');

      select.name = x;
      select.dataset.qa = x;

      const cities = [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ];

      cities.forEach((city) => {
        const option = document.createElement('option');

        option.textContent = city;
        option.value = city;
        select.appendChild(option);
      });

      label.append(select);
    } else {
      const input = document.createElement('input');

      input.name = x;
      input.type = x === 'age' || x === 'salary' ? 'number' : 'text';
      input.dataset.qa = x;
      label.append(input);
    }

    form.append(label);
  });

  const btn = document.createElement('button');

  btn.type = 'submit';
  btn.textContent = 'Save to table';
  form.append(btn);

  const body = document.querySelector('body');

  body.append(form);

  return form;
}

const formEl = addForm();

formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  let error = false;

  error = isValidValue(formEl.elements);

  if (!error) {
    addEmployee(formEl.elements);
    formEl.reset();
  }
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const body = document.querySelector('body');
  const div = document.createElement('div');

  div.dataset.qa = 'notification';

  const titleNotification = document.createElement('h2');
  const descriptionNotification = document.createElement('p');

  div.className = 'notification';
  div.classList.add(type);
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  titleNotification.classList.add('title');
  titleNotification.textContent = title;

  descriptionNotification.textContent = description;

  div.append(titleNotification, descriptionNotification);
  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 4000);

  return true;
};

const isValidValue = ({ name: nameForm, position, age, salary }) => {
  const validations = [
    {
      name: 'Name',
      rule: nameForm.value.length < 4,
      msg: 'Must be at least 4 letters',
    },
    { name: 'Position', rule: !position.value, msg: 'Position is required' },
    {
      name: 'Age',
      rule: age.value < 18 || age.value > 90,
      msg: 'Must be 18–90',
    },
    { name: 'Salary', rule: salary.value < 1, msg: 'Must be greater than 0' },
  ];

  for (const v of validations) {
    if (v.rule) {
      return pushNotification(150, 10, `Invalid ${v.name}`, v.msg, 'error');
    }
  }

  pushNotification(
    10,
    10,
    'New employee',
    'Employee added to the table',
    'success',
  );
};

const addEmployee = (dataForm) => {
  const tr = document.createElement('tr');

  [...dataForm].forEach((x) => {
    if (x.nodeName !== 'BUTTON') {
      const td = document.createElement('td');

      td.textContent =
        x.name === 'salary'
          ? `$${Number(x.value).toLocaleString('en-US')}`
          : x.value;
      tr.append(td);
    }
  });
  tbody.append(tr);
};

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('TD');

  if (!td || td.querySelector('.cell-input')) {
    return;
  }

  const tdTextContent = td.textContent;
  const inputEl = document.createElement('input');

  inputEl.classList.add('cell-input');
  inputEl.type = 'text';
  inputEl.value = tdTextContent;
  td.textContent = '';
  td.appendChild(inputEl);

  const changeText = () => {
    const newValue = inputEl.value.trim() || tdTextContent;

    td.textContent = newValue;
  };

  inputEl.addEventListener('keypress', (ev) => {
    if (ev.code === 'Enter') {
      changeText();
    }
  });

  inputEl.addEventListener('blur', changeText);
});
