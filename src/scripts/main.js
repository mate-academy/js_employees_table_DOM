'use strict';

const NAME = 'Name';
const POSITION = 'Position';
const OFFICE = 'Office';
const AGE = 'Age';
const SALARY = 'Salary';
const messageName = 'Поле "Name:" повинно мати не менше 4 символів';
const messagePosition = 'Необхідно вказати посаду';
const messageFullData = 'Недостатньо даних';
const messageAge = 'Вік від 18 до 90';
const messageSuccess = 'Співробітника успішно додано';

const thead = document.querySelector('thead');
let currentCol = null;

document.querySelector('table').addEventListener('click', e => {
  const tbody = document.querySelector('tbody');

  if (thead.contains(e.target)) {
    const thElements = [...thead.firstElementChild.children];
    const tbElements = [...tbody.children];
    const value = e.target.textContent;

    let tbElemSort = sortBy(tbElements, thElements, value);
    const tbSort = document.createElement('tbody');

    if (currentCol === value) {
      tbElemSort = tbElemSort.reverse();
      currentCol = null;
    } else {
      currentCol = value;
    }

    for (const el of tbElemSort) {
      tbSort.append(el);
    }

    tbody.replaceWith(tbSort);
  };

  if (tbody.contains(e.target)) {
    [...tbody.children].map(el => {
      el.className = '';
    });

    if (e.target.tagName !== 'INPUT') {
      e.target.parentElement.className = 'active';
    }
  }
});

const formCreate = document.createElement('form');
const offices = listOfOffices(document.body.firstElementChild);

formCreate.className = 'new-employee-form';

for (const item of [...thead.firstElementChild.children]) {
  const label = document.createElement('label');

  label.textContent = `${item.textContent}:`;

  if (item.textContent !== OFFICE) {
    const input = document.createElement('input');

    input.name = item.textContent.toLowerCase();
    input.dataset.qa = item.textContent.toLowerCase();
    label.append(input);
  } else {
    const select = document.createElement('select');

    for (const office of offices) {
      const option = document.createElement('option');

      option.textContent = office;
      option.value = office;
      select.append(option);
    }

    select.name = item.textContent.toLowerCase();
    select.dataset.qa = item.textContent.toLowerCase();
    select.required = true;
    label.append(select);
  }
  formCreate.append(label);
}

const button = document.createElement('button');

button.textContent = 'Save to table';
formCreate.append(button);
document.body.firstElementChild.after(formCreate);

const labels = document.querySelectorAll('label');

for (const label of labels) {
  const field = label.firstElementChild;

  switch (field.dataset.qa) {
    case NAME.toLowerCase():
      field.type = 'text';
      break;

    case POSITION.toLowerCase():
      field.type = 'text';
      break;

    case OFFICE.toLowerCase():
      const options = field.children;

      options[0].value = '';
      options[0].textContent = 'Office';
      options[0].disabled = true;
      options[0].setAttribute('selected', true);
      break;

    case AGE.toLowerCase():
      field.type = 'number';
      break;

    case SALARY.toLowerCase():
      field.type = 'number';
      break;
  }
}

const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const newRow = document.createElement('tr');

  for (const label of labels) {
    const field = label.firstElementChild;
    const td = document.createElement('td');

    switch (field.dataset.qa) {
      case NAME.toLowerCase():
        if (data.get(NAME.toLowerCase()).length < 4) {
          informMessage('error', messageName);

          return;
        } else {
          td.innerText = data.get(NAME.toLowerCase());
        }
        break;

      case POSITION.toLowerCase():
        if (!data.get(POSITION.toLowerCase())) {
          informMessage('error', messagePosition);

          return;
        } else {
          td.innerText = data.get(POSITION.toLowerCase());
        }
        break;

      case OFFICE.toLowerCase():
        td.innerText = data.get(OFFICE.toLowerCase());
        break;

      case AGE.toLowerCase():
        if (+data.get(AGE.toLowerCase()) < 18
          || +data.get(AGE.toLowerCase()) >= 90) {
          informMessage('error', messageAge);

          return;
        } else {
          td.innerText = data.get(AGE.toLowerCase());
        }
        break;

      case SALARY.toLowerCase():
        td.innerText = salaryToString(data.get(SALARY.toLowerCase()));
        break;
    }
    newRow.append(td);
  }

  let counterFree = 0;

  for (const free of newRow.children) {
    if (free.innerText) {
      counterFree++;
    }
  }

  if (counterFree !== newRow.children.length) {
    informMessage('warning', messageFullData);
  } else {
    document.querySelector('tbody').append(newRow);
    form.reset();
    informMessage('success', messageSuccess);
  }
});

document.querySelector('tbody').addEventListener('dblclick', e => {
  const cell = e.target;

  cell.parentElement.className = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = cell.innerText;
  cell.replaceWith(input);
  input.focus();

  input.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });

  input.addEventListener('blur', ev => {
    if (!input.value) {
      input.replaceWith(cell);
    } else {
      cell.innerText = input.value;
      input.replaceWith(cell);
    }
  });
});

function listOfOffices(table) {
  const listOffices = {};
  const header = [...table.firstElementChild.firstElementChild.children];

  const rows = [...table.rows].slice(0, -1);

  for (let i = 0; i < header.length; i++) {
    if (header[i].textContent !== OFFICE) {
      continue;
    }

    for (const row of rows) {
      if (listOffices[row.children[i].textContent]) {
        continue;
      } else {
        listOffices[row.children[i].textContent] = true;
      }
    }
  }

  return Object.keys(listOffices);
}

function sortBy(tbEl, thEl, value) {
  for (let i = 0; i < thEl.length; i++) {
    if (thEl[i].textContent !== value) {
      continue;
    }

    tbEl.sort((a, b) => {
      switch (value) {
        case NAME:
        case POSITION:
        case OFFICE:
          return a.children[i].textContent
            .localeCompare(b.children[i].textContent);

        case AGE:
          return +a.children[i].textContent - +b.children[i].textContent;

        case SALARY:
          return salaryToNumber(a.children[i].textContent)
            - salaryToNumber(b.children[i].textContent);
      }
    });
  }

  return tbEl;
}

function salaryToNumber(salary) {
  return +salary.slice(1).split(',').join('');
}

function salaryToString(str) {
  let result = '';
  let counter = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    result = str[i] + result;
    counter++;

    if (counter % 3 === 0 && counter !== str.length) {
      result = ',' + result;
    }
  }

  return `$${result}`;
}

function informMessage(type, text) {
  const div = document.createElement('div');

  div.className = 'notification';
  div.classList.add(type);
  div.dataset.qa = 'notification';
  div.innerText = text;
  div.style.color = 'black';
  form.prepend(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
}
