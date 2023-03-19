'use strict';

const tbody = document.querySelector('tbody');
const headRow = document.querySelector('thead tr');
const tr = [...tbody.children];

document.querySelector('body').style.userSelect = 'none';
document.querySelector('body').style.alignItems = 'flex-start';

// #region sortedList
const normalize = (number) => {
  return +number.slice(1).split(',').join('');
};

headRow.addEventListener('click', e => {
  let sorted = [];

  if (e.target.className === '') {
    e.target.classList.add('DESC');

    sorted = tr.sort((a, b) => {
      const aValue = a.children[e.target.cellIndex].innerText;
      const bValue = b.children[e.target.cellIndex].innerText;

      switch (e.target.cellIndex) {
        case 0:
        case 1:
        case 2:
          return aValue.localeCompare(bValue);
        case 3:
          return aValue - bValue;
        case 4:
          return normalize(aValue) - normalize(bValue);
      }
    });
  } else {
    e.target.classList.remove('DESC');

    sorted = tr.reverse();
  }

  sorted.forEach(item => tbody.append(item));
});
// #endregion

// #region row
tbody.addEventListener('click', e => {
  [...tbody.children].forEach(el => el.classList.remove('active'));
  e.target.parentNode.classList.add('active');
});
// #endregion

// #region citiesChoise
const citiesChoise = function() {
  const select = document.createElement('select');
  const options = [`Tokyo`, `Singapore`, `London`,
    `New York`, `Edinburgh`, `San Francisco`];

  options.forEach(cityName => {
    const option = document.createElement('option');

    option.textContent = cityName;
    select.append(option);
  });

  return select;
};
// #endregion

// #region form
const form = document.createElement('form');

form.classList.add('new-employee-form');

[...headRow.children].forEach(el => {
  const lable = document.createElement('label');

  lable.textContent = el.textContent;

  if (lable.textContent !== 'Office') {
    const input = document.createElement('input');

    if (lable.textContent === 'Age' || lable.textContent === 'Salary') {
      input.type = 'number';
    }

    input.name = lable.textContent.toLowerCase();
    input.dataset.qa = lable.textContent.toLowerCase();

    lable.append(input);
  } else {
    const employeeOptions = citiesChoise();

    employeeOptions.name = lable.textContent.toLowerCase();
    employeeOptions.dataset.qa = lable.textContent.toLowerCase();

    lable.append(employeeOptions);
  }

  form.append(lable);
});

document.body.append(form);
// #endregion

// #region notification
const notification = (type, title, text) => {
  const message = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  message.append(h2, p);

  message.classList.add('notification', type);
  message.setAttribute('data-qa', 'notification');

  h2.classList.add('title');
  h2.innerText = title;

  p.innerText = text;

  document.querySelector('body').append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
};
// #endregion

// #region button
const button = document.createElement('button');

button.addEventListener('click', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const dataObject = Object.fromEntries(formData.entries());

  if (dataObject.name.length < 4) {
    notification('error', 'Error', 'Name should have more than 4 letters.');
  } else if (+dataObject.age < 18 || +dataObject.age > 90) {
    notification('error', 'Error',
      'Age should be more than 18 and less than 90');
  } else if (!dataObject.position || !dataObject.salary) {
    notification('error', 'Error', 'Enter all required information.');
  } else {
    notification('success', 'Succes', 'Information successfully added.');

    const newRow = document.createElement('tr');

    dataObject.salary = `$${Number(dataObject.salary).toLocaleString('en-US')}`;

    Object.values(dataObject).forEach(str => {
      const cell = document.createElement('td');

      cell.textContent = str;

      newRow.append(cell);
    });

    tbody.append(newRow);

    tr.push(newRow);

    form.querySelectorAll('input').forEach(field => {
      field.value = '';
    });
  }
});

button.textContent = 'Save to table';

form.append(button);
// #endregion

// #region editing
tbody.addEventListener('dblclick', e => {
  const index = e.target.cellIndex;
  const initialText = e.target.textContent;
  let input = document.createElement('input');

  input.style.width = '118px';

  input.classList.add('cell-input');

  e.target.textContent = '';

  switch (index) {
    case 2:
      input = citiesChoise();

      input.style.width = '100px';
      input.style.height = '18px';
      break;

    case 3:
      input.style.width = '30px';
      input.type = 'number';
      break;

    case 4:
      input.style.width = '66px';
      input.type = 'number';
      break;
  }

  e.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    switch (index) {
      case 0:
        if (input.value.length < 4) {
          notification('error', 'Error',
            'Name should have more than 4 letters.');
          e.target.textContent = initialText;
        } else {
          e.target.textContent = input.value;
        }
        break;

      case 1:
        if (input.value) {
          e.target.textContent = input.value;
        } else {
          notification('error', 'Error', 'You should enter data.');
          e.target.textContent = initialText;
        }
        break;

      case 2:
        if (input.value) {
          e.target.textContent = input.value;
        } else {
          e.target.textContent = initialText;
        }
        break;

      case 3:
        if (input.value < 18 || input.value > 90) {
          notification('error', 'Error',
            'Age should be more than 18 and less than 90');
          e.target.textContent = initialText;
        } else {
          e.target.textContent = input.value;
        }
        break;

      case 4:
        if (input.value) {
          e.target.textContent
            = `$${Number(input.value).toLocaleString('en-US')}`;
        } else {
          notification('error', 'Error', 'You should enter data.');
          e.target.textContent = initialText;
        }
        break;
    }

    input.remove();
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});
// #endregion
