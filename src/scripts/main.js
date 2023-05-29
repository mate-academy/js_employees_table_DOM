'use strict';

// FORM html code
document.body.insertAdjacentHTML('beforeend', `
  <form method="/" action="GET" class="new-employee-form">
  <label>Name:
    <input name="name" type="text" data-qa="name">
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      <option hidden></option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input name="age" type="number" data-qa="age">
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>
  <button type="submit">Save to table</button>
  </form>
`);

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const form = document.querySelector('form');
const rows = tbody.rows;

// Push notification FUNCTION;
function pushNotification(message, type) {
  const errorTitle = `Form was't added !!!`;
  const successTitle = `Form was added`;
  const notifyErrors = {
    name: 'Name field should have not less then 4 character',
    position: 'Position field should have not less then 4 character',
    office: 'Office field should be selected',
    age: 'Age field should be from 18 to 90',
    salary: 'Salary field should be from 90$',
  };
  const successDescription = `Employee was added in the end of the table!\n `
    + `To edit the data double click on a cell!`;

  const title = type === 'success' ? successTitle : errorTitle;
  const body = document.querySelector('body');

  body.insertAdjacentHTML('beforeend', `
    <div class="notification" class=${type} data-qa="notification">
      <h2 class="title">${title}</h2>
    </div>
  `);

  const div = document.querySelector('.notification');

  if (message.length > 0) {
    let numberOfParagraph = 1;

    for (const error of message) {
      const p = document.createElement('p');

      p.innerText = `${numberOfParagraph}. ${notifyErrors[error]}`;
      div.append(p);
      numberOfParagraph++;
    }
  } else {
    const p = document.createElement('p');

    p.innerText = successDescription;
    div.append(p);
  }

  div.classList.add(type);
  div.style.top = '450px';

  setTimeout(() => {
    document.querySelectorAll('.notification').forEach(x => x.remove());
  }, 6000);
};

// Sorting tables FUCTION
function sortElemInTwoWays(element, start, end) {
  if (element === 'Salary') {
    const parceSalary = (salary) => {
      return parseFloat(salary.slice(1).replace(',', '.'));
    };

    return parceSalary(start) - parceSalary(end);
  } else {
    return start.localeCompare(end);
  }
};

// Submit form EVENT
form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const formData = Object.fromEntries(data.entries());
  const salary = +formData.salary;
  const message = [];
  let type = 'success';

  const formBoolean = {
    name: formData.name.length >= 4,
    position: formData.position.length >= 4,
    office: formData.office !== '',
    age: +formData.age >= 18 && +formData.age <= 90,
    salary: +formData.salary > 90,
  };

  for (const check in formBoolean) {
    if (!formBoolean[check]) {
      type = 'error';
      message.push(check);
    }
  }

  pushNotification(message, type);

  if (type === 'success') {
    form.reset();

    tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${formData.name}</td>
      <td>${formData.position}</td>
      <td>${formData.office}</td>
      <td>${formData.age}</td>
      <td>$${salary.toLocaleString('en-US')}</td>
    </tr>
  `);
  }
});

// Sorting table EVENT
thead.addEventListener('click', e => {
  const addClass = e.target.toggleAttribute('sorted');
  const headerRow = thead.firstElementChild.children;
  const index = [...headerRow].findIndex(elem => elem === e.target);

  const sortedList = [...rows].sort((a, b) => {
    const start = a.children[index].innerText;
    const end = b.children[index].innerText;

    if (addClass) {
      return sortElemInTwoWays(e.target.innerText, start, end);
    } else {
      return sortElemInTwoWays(e.target.innerText, end, start);
    }
  });

  sortedList.forEach(elem => tbody.append(elem));
});

// Selecting row EVENT
tbody.addEventListener('click', e => {
  for (const x of rows) {
    if (x.classList.contains('active') && x !== e.target.parentElement) {
      x.classList.remove('active');
    }
  }

  e.target.parentElement.classList.toggle('active');
});

// Eit cell EVENT
tbody.addEventListener('dblclick', e => {
  const initialText = e.target.innerText;
  const target = e.target.parentElement;
  const input = document.createElement('input');
  const select = document.createElement('select');
  const theadTitle = thead.firstElementChild.children;
  const index = [...target.children].findIndex(x => x === e.target);
  const styleTD = getComputedStyle(e.target);
  let inputOrSelect = true;

  target.children[index].innerText = '';
  input.classList.add('cell-input');
  select.classList.add('cell-input');
  input.style.width = styleTD.width;
  select.style.width = styleTD.width;

  if (index < 2) {
    input.type = 'text';
  }

  if (index > 2) {
    input.type = 'number';
  }

  if (index === 2) {
    select.innerHTML = `
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>`;

    inputOrSelect = false;
  }

  inputOrSelect
    ? target.children[index].append(input)
    : target.children[index].append(select);

  input.focus();

  input.addEventListener('blur', () => {
    let text = input.value.trim();

    if (!text) {
      text = initialText;
    }

    if (index === 4 && input.value) {
      if (input.value < 1) {
        text = initialText;
      } else {
        text = '$' + Number(text).toLocaleString('en-US');
      }
    }

    const inputBoolean = {
      0: input.value.length >= 4, // column's title Name;
      1: input.value.length >= 4, // column's title Position;
      3: +input.value >= 18 && +text <= 90, // column's title Age;
      4: +input.value >= 90, // column's title Salary;
    };

    if (!inputBoolean[index]) {
      text = initialText;

      const errorName = theadTitle[index].innerText.toLowerCase();

      pushNotification([errorName], 'error');
    }

    input.parentElement.textContent = text;
  });

  input.addEventListener('keydown', evnt => {
    if (evnt.code === 'Enter') {
      input.blur();
    }
  });
});
