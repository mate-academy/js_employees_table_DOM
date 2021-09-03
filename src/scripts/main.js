'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
let count = 0;

// Converted string to correct format of Salary
const correctFormatSalary = (string) => {
  const number = +string.replace(/\D/g, '');

  return `$${number.toLocaleString('en')}`;
};

// Converted string to number
const toNum = (string) => {
  return +string.replace('$', '').replace(/,/g, '');
};

function sortList(index, sortableList) {
  count++;

  const children = [...sortableList.children];
  const sorted = children.sort((a, b) => {
    let prev;
    let next;

    if (count % 2 !== 0) {
      prev = a.children[index].textContent;
      next = b.children[index].textContent;
    } else {
      prev = b.children[index].textContent;
      next = a.children[index].textContent;
    };

    if (isNaN(toNum(prev))) {
      return prev.localeCompare(next);
    }

    return toNum(prev) - toNum(next);
  });

  for (const person of sorted) {
    tbody.append(person);
  };
};

// Sort by click
thead.addEventListener('click', (e) => {
  const item = e.target;
  const contents = [...thead.children[0].children];
  const indexContents = contents.findIndex(elem => elem === item);

  sortList(indexContents, tbody);
});

// Adding to the selected item class="active"
tbody.addEventListener('click', (e) => {
  const item = e.target.closest('tr');

  [...tbody.children].map(elem => elem.removeAttribute('class'));

  item.classList.add('active');
});

// Edit list by double click
tbody.addEventListener('dblclick', (e) => {
  const item = e.target;
  const input = document.createElement('input');
  const text = item.textContent;

  item.textContent = '';
  item.append(input);
  input.classList.add('cell-input');
  input.value = `${text}`;
  input.focus();

  if (item === item.parentNode.children[3]) {
    input.oninput = () => {
      input.value = input.value.substr(0, 2);
    };
  };

  tbody.addEventListener('click', (ev) => {
    if (ev.target.classList.value !== 'cell-input') {
      if (input.value.trim() === '') {
        item.textContent = text;
      } else if (item === item.parentNode.children[4]) {
        item.textContent = correctFormatSalary(input.value);
      } else if (item === item.parentNode.children[3]) {
        if (input.value >= 90 || input.value <= 18) {
          item.textContent = text;
        } else {
          item.textContent = input.value.replace(/\D/g, '');
        }
      } else {
        item.textContent = input.value.trim();
      }

      input.remove();
    }
  });
});

// Adding form to a page
const form = document.createElement('tform');

form.classList.add('new-employee-form');
document.body.append(form);

form.innerHTML = `
<label>
  Name:
  <input class="form__item" name="name" type="text" data-qa="name" required>
</label>
<label>
  Position:
  <input class="form__item" name="position" type="text" data-qa="position">
</label>
<label>
  Office:
  <select class="form__item" name="office" data-qa="office">
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
  </select>
</label>
<label>
  Age:
  <input class="form__item" name="age" type="number" data-qa="age">
</label>
<label>
  Salary:
  <input class="form__item" name="salary" type="number" data-qa="salary">
</label>
<button class="form__item" type="submit">Save to table</button>
<div data-qa="notification" class="notification"></div>
`;

const inputs = document.querySelectorAll('.form__item');
const notification = document.querySelector('.notification');

const getNotificationText = (stat) => {
  if (!stat) {
    const text = [
      'Name must contain more than 4 letters',
      'Age cannot be less than 18 or more than 90',
      'All fields must be filled',
    ];

    notification.innerHTML = `
    <h2>Please enter correct data</h2>
    <ul style="padding: 16px;">
    ${text.map(item => `
    <li style = "
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 10px"
    >${item}</li>
    `).join(' ')}
    </ul>
    `;
  } else if (stat) {
    notification.innerHTML = `
    <h2>New employee added successfully</h2>
    `;
  }
};

// Adding data to a list
inputs[5].addEventListener('click', () => {
  if (
    (inputs[0].value).length <= 4
    || (inputs[1].value).length <= 0
    || inputs[3].value < 18
    || inputs[3].value > 90
    || inputs[4].value === ''
  ) {
    notification.classList.add('error');
    getNotificationText(false);

    setTimeout(() => {
      notification.classList.remove('error');
    }, 3000);

    return;
  };

  const element = [...tbody.children][0].cloneNode(true);

  for (let i = 0; i < [...inputs].length - 1; i++) {
    if (i !== 4) {
      element.children[i].textContent = inputs[i].value;
    } else {
      element.children[i].textContent = correctFormatSalary(inputs[i].value);
    }
  }

  tbody.append(element);

  for (let y = 0; y < [...inputs].length; y++) {
    if (y !== 2) {
      inputs[y].value = '';
    };
  };

  notification.classList.add('success');
  getNotificationText(true);

  setTimeout(() => {
    notification.classList.remove('success');
  }, 3000);
});
