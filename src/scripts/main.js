'use strict';

// write code here
let isReversed = false;
let tableCurrentTH = '';

const makeSalary = (value) => {
  return value.slice(1).split(',').join('');
};

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');

  div.classList.add(type, 'notification');
  div.setAttribute('data-qa', 'notification');
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.classList.add('title');
  h2.innerText = title;
  p.innerText = description;
  div.append(h2);
  div.append(p);

  document.body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

const createForm = () => {
  const form = document.createElement('form');
  const inputs = ['name', 'position', 'office', 'age', 'salary'];
  const offices = [
    'Tokyo',
    'Syngapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.classList.add('new-employee-form');
  document.body.firstElementChild.after(form);

  inputs.forEach((inp) => {
    const input = document.createElement('input');
    const select = document.createElement('select');
    const label = document.createElement('label');

    label.innerText = `${inp.charAt(0).toUpperCase() + inp.slice(1)}:`;
    label.setAttribute('htmlFor', inp);
    form.append(label);

    if (inp === 'office') {
      select.setAttribute('name', inp);
      select.setAttribute('data-qa', inp);
      select.setAttribute('value', offices[0]);
      select.classList.add(inp);
      label.append(select);

      offices.forEach((office) => {
        const option = document.createElement('option');

        option.innerText = office;
        select.append(option);
      });
    } else {
      input.classList.add(inp);
      input.setAttribute('name', inp);
      input.setAttribute('type', 'text');
      input.setAttribute('data-qa', inp);
      input.setAttribute('required', '');
      label.append(input);
    }
  });

  const button = document.createElement('button');

  button.innerText = 'Save to table';
  button.setAttribute('type', 'submit');
  form.append(button);
};

document.addEventListener('keydown', (ev) => {
  const input = ev.target.closest('input');

  if (ev.target !== input) {
    return;
  }

  input.value = ev.target.value;
});

document.addEventListener('click', (ev) => {
  ev.preventDefault();

  const tableBody = document.querySelector('tbody');
  const button = document.querySelector('button');

  const n = document.querySelector('.name');
  const p = document.querySelector('.position');
  const o = document.querySelector('.office');
  const a = document.querySelector('.age');
  const s = document.querySelector('.salary');

  if (ev.target !== button) {
    return;
  }

  const newEmployee = [n, p, o, a, s];

  const rightName = n.value.length > 3;
  const rightPosition = p.value.length > 1;
  const ageIsNan = +a.value / +a.value !== 1;
  const salaryIsNan = +s.value / +s.value !== 1;

  if (!rightName) {
    pushNotification(
      10,
      590,
      'Error',
      'Employee`s name is not correct\n' + 'too short',
      'error',
    );
  }

  if (+a.value < 18 || +a.value > 90 || ageIsNan) {
    pushNotification(
      10,
      300,
      'Error',
      'Employee`s age is not correct\n' + 'must be from 18 to 90 and number',
      'error',
    );
  }

  if (salaryIsNan) {
    pushNotification(
      10,
      880,
      'Error',
      'Employee`s salary is not correct\n' + 'must be number',
      'error',
    );
  }

  if (!rightPosition) {
    pushNotification(
      10,
      1170,
      'Error',
      'Employee`s position is not correct\n' + 'too short',
      'error',
    );
  }

  if (
    rightName &&
    +a.value >= 18 &&
    +a.value <= 90 &&
    !ageIsNan &&
    !salaryIsNan &&
    rightPosition
  ) {
    const newTr = document.createElement('tr');

    tableBody.append(newTr);

    newEmployee.forEach((char) => {
      const td = document.createElement('td');

      if (char.name === 'salary') {
        td.innerText = `$${Number(char.value).toLocaleString('en-US')}`;
      } else {
        td.innerText = char.value;
      }

      newTr.append(td);

      if (char.name === 'office') {
        char.value = char.firstElementChild.value;
      } else {
        char.value = '';
      }
    });

    pushNotification(
      10,
      10,
      'Message',
      'New employee was added\n' + 'Successfully',
      'success',
    );
  }
});

document.addEventListener('click', (ev) => {
  if (ev.target.parentElement.parentElement.tagName !== 'THEAD') {
    return 0;
  }

  const elementIndex = ev.target.cellIndex;

  const tableNewTH = ev.target.innerText;

  const tbody = document.querySelector('tbody');

  const newList = [...tbody.children].sort((a, b) => {
    const aValue = a.children[elementIndex].textContent;
    const bValue = b.children[elementIndex].textContent;

    const isNumber = !isNaN(parseFloat(aValue)) && isFinite(aValue);
    const isSalary = aValue[0] === '$';

    if (isNumber) {
      return bValue - aValue;
    } else if (isSalary) {
      return makeSalary(bValue) - makeSalary(aValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  if (isReversed && tableCurrentTH === tableNewTH) {
    newList.reverse();
    isReversed = false;
  } else {
    isReversed = true;
  }

  tableCurrentTH = tableNewTH;

  newList.forEach((el) => tbody.prepend(el));
});

document.addEventListener('click', (ev) => {
  const tr = ev.target.parentElement;
  const trs = [...document.querySelector('tbody').children];

  if (ev.target.parentElement.parentElement.tagName !== 'TBODY') {
    return;
  }

  trs.forEach((elem) => {
    elem.classList.remove('active');
  });

  tr.classList.add('active');
});

document.addEventListener('dblclick', (ev) => {
  const td = ev.target;
  const input = document.createElement('input');
  const tdVal = td.innerText;

  if (ev.target.tagName !== 'TD') {
    return;
  }

  input.classList.add('cell-input');
  input.value = tdVal;

  td.innerText = '';

  td.append(input);

  input.focus();

  input.onblur = () => {
    if (input.value.trim() === '') {
      td.innerText = tdVal;
    } else {
      td.innerText = input.value;
    }

    input.innerHTML = null;
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    }
  });
});

createForm();
