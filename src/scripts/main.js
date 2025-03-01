'use strict';

const thead = document.querySelector('thead');
const headlinesBox = thead.firstElementChild;
const tbody = document.querySelector('tbody');
let previouslySelectedTitle;
let previouslySelectedRow;
let previouslySelectedCell;
const cities = ['Tokyo', 'Singapore', 'New York', 'Edinburgh', 'San Francisco'];
const body = document.body;
const form = document.createElement('form');

form.className = 'new-employee-form';

[...headlinesBox.children].forEach((headline) => {
  const data = headline.innerText.toLowerCase();

  const label = document.createElement('label');

  label.innerText = `${headline.innerText}:`;

  if (data === 'office') {
    const select = document.createElement('select');

    select.name = `${data}`;
    select.dataQa = `${data}`;

    cities.forEach((el) => {
      const option = document.createElement('option');

      option.value = `${el}`;
      option.innerText = `${el}`;
      select.append(option);
    });

    label.append(select);
    form.append(label);

    return;
  }

  const input = document.createElement('input');

  input.name = `${data}`;
  input.type = data === 'age' || data === 'salary' ? 'number' : 'text';
  input.setAttribute('data-qa', data);
  input.required = true;

  label.append(input);
  form.append(label);
});

const button = document.createElement('button');

button.type = 'button';
button.innerText = 'Save to table';
form.append(button);

body.append(form);

button.addEventListener('click', (e) => {
  const allFilled = [...form.elements].slice(0, -1).every((input) => {
    return input.value.trim() !== '';
  });

  if (!allFilled) {
    pushNotification(
      10,
      10,
      'ERROR!',
      'Сheck your input \n' + 'Not all fields are filled',
      'error',
    );

    return;
  }

  if (form.elements.name.value.length < 4) {
    pushNotification(
      10,
      10,
      'ERROR!',
      'Сheck your input \n' + 'The name value contains less than 4 letters',
      'error',
    );

    return;
  }

  if (form.elements.age.value < 18 || form.elements.age.value > 90) {
    pushNotification(
      10,
      10,
      'ERROR!',
      'Сheck your input \n' + 'Age value is less than 18 or more than 90',
      'error',
    );

    return;
  }

  const tr = document.createElement('tr');

  [...form.elements].slice(0, -1).forEach((data) => {
    const td = document.createElement('td');

    td.innerText =
      data.name === 'salary'
        ? `$${format(data.value, 3)}`
        : `${data.value.trim()}`;

    tr.append(td);
  });

  tbody.append(tr);

  if (tbody.contains(tr)) {
    pushNotification(
      10,
      10,
      'SUCCESS!',
      'The new employee has been successfully added to the table',
      'success',
    );
  }
});

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const index = [...headlinesBox.children].indexOf(th);

  let sorted = [...tbody.children].sort((a, b) => {
    const elementA = a.children[index].textContent;
    const elementB = b.children[index].textContent;
    const type = detectType(elementB);

    if (type === 'String') {
      return elementA.localeCompare(elementB);
    }

    if (type === 'Currency') {
      return +elementA.replace(/[$,]/g, '') - +elementB.replace(/[$,]/g, '');
    }

    if (type === 'Number') {
      return Number(elementA) - Number(elementB);
    }
  });

  if (th === previouslySelectedTitle) {
    sorted = sorted.reverse();
    previouslySelectedTitle = '';
  } else {
    previouslySelectedTitle = th;
  }

  tbody.innerHTML = '';
  sorted.forEach((el) => tbody.append(el));
});

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  if (previouslySelectedRow) {
    previouslySelectedRow.classList.remove('active');
  }

  tr.classList.add('active');

  tr.addEventListener('click', (doubleClick) => {
    const td = doubleClick.target.closest('td');

    if (!td) {
      return;
    }

    let input = document.createElement('input');

    input.type =
      tr.children[3] === td || tr.children[4] === td ? 'number' : 'text';

    input.value = `${td.innerText}`;

    if (tr.children[2] === td) {
      input = document.createElement('select');

      cities.forEach((el) => {
        const option = document.createElement('option');

        option.value = `${el}`;
        option.innerText = `${el}`;
        input.append(option);
      });
    }

    input.className = 'cell-input';
    td.replaceWith(input);
    input.focus();

    window.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        const newText =
          input.value.trim() === ''
            ? previouslySelectedCell.innerText
            : input.value.trim();

        td.innerText = newText;
        input.replaceWith(td);
      }
    });

    input.addEventListener('blur', () => {
      const newText =
        input.value.trim() === ''
          ? previouslySelectedCell.innerText
          : input.value.trim();

      td.innerText = newText;
      input.replaceWith(td);
    });

    previouslySelectedCell = td;
  });

  previouslySelectedRow = tr;
});

function detectType(value) {
  if (/^\d+(\.\d+)?$/.test(value.trim())) {
    return 'Number';
  }

  if (
    value.startsWith('$') &&
    !isNaN(Number(value.slice(1).replace(/,/g, '')))
  ) {
    return 'Currency';
  }

  return 'String';
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.innerText = `${title}`;

  const p = document.createElement('p');

  p.innerText = `${description}`;

  message.append(h2, p);

  const existingNotification = document.querySelector(`.notification.${type}`);

  if (existingNotification) {
    return;
  }

  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 5000);
};

function format(number, countOfDigits) {
  const numString = number.toString();
  const parts = [];

  for (let i = numString.length; i > 0; i -= countOfDigits) {
    const start = Math.max(0, i - countOfDigits);

    parts.unshift(numString.slice(start, i));
  }

  return parts.join(',');
}
