'use strict';

const table = document.querySelector('table');
const body = document.querySelector('body');
const listThead = [...table.children[0].children[0].children];

table.addEventListener('click', (e) => {
  const listElements = [...table.children[1].children];

  if (!e.target.parentElement.classList.contains('active')) {
    listElements.forEach(tr => tr.classList.remove('active'));
  }

  if (e.target.tagName === 'TD') {
    e.target.parentElement.classList.add('active');
  }

  if (e.target.tagName === 'TH') {
    let sortElements = '';
    const index = e.target.cellIndex;
    const tableCell = e.target.textContent;

    if (!e.target.classList.contains(tableCell)) {
      listThead.forEach(th => {
        return th.classList
          .remove('asc', 'Name', 'Position', 'Office', 'Age', 'Salary');
      });
    }

    switch (tableCell) {
      case 'Name':
      case 'Position':
      case 'Office':
        e.target.classList.toggle('asc');

        sortElements = listElements.sort((a, b) => {
          return a.children[index].textContent
            .localeCompare(b.children[index].textContent);
        });

        if (!e.target.classList.contains('asc')) {
          sortElements.reverse();
        };

        e.target.classList.add(tableCell);
        break;
      case 'Age':
        e.target.classList.toggle('asc');

        sortElements = listElements.sort((a, b) => {
          return (+a.children[index].textContent) - (+b
            .children[index].textContent);
        });

        if (!e.target.classList.contains('asc')) {
          sortElements.reverse();
        };

        e.target.classList.add(tableCell);
        break;
      case 'Salary':
        e.target.classList.toggle('asc');

        const convertToNumber = (value) => {
          return +(value.children[index]
            .textContent.split(',').join('').slice(1));
        };

        sortElements = listElements.sort((a, b) => {
          return (convertToNumber(a)) - (convertToNumber(b));
        });

        if (!e.target.classList.contains('asc')) {
          sortElements.reverse();
        };

        e.target.classList.add(tableCell);
        break;
    }
    sortElements.forEach(el => table.children[1].appendChild(el));
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name:
    <input name="name" type="text" data-qa="name">
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input name="age" type="text" data-qa="age">
  </label>
  <label>Salary:
    <input name="salary" type="text" data-qa="salary">
  </label>
  <button>Save to table</button>
`;

body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const items = Object.fromEntries(data.entries());
  const { name: nameEmployee, position, office, age, salary } = items;

  for (const item in items) {
    if (items[item] === '') {
      pushNotification(450, 30, `Error ${item}`,
        `Enter ${item}`, 'error');

      return;
    }
  };

  if (isNaN(+age)) {
    pushNotification(450, 30, 'Error age',
      'Age must be number', 'error');

    return;
  } else if (isNaN(+salary)) {
    pushNotification(450, 30, 'Error age',
      'Salary must be number', 'error');

    return;
  } else if (nameEmployee.length < 4) {
    pushNotification(450, 30, 'Error name',
      'Name has 4 letters or more.', 'error');

    return;
  } else if (age < 18) {
    pushNotification(450, 30, 'Age field',
      'The employee must be 18 years old', 'error');

    return;
  } else if (age > 90) {
    pushNotification(450, 30, 'Age field',
      'The employee must be under 90 years old', 'error');

    return;
  }

  const sal = `$${salary.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')}`;

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${nameEmployee}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${sal}</td>
  `;
  table.children[1].append(tr);

  pushNotification(450, 30, 'Add to table',
    'Employee add to table', 'success');

  document.querySelectorAll('input').forEach(input => {
    input.value = '';
  });
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');

  div.className = `notification ${type}`;
  div.setAttribute('data-qa', 'notification');
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  div.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  body.insertBefore(div, body.lastChild);

  setTimeout(() => div.remove(), 3000);
};

let cellInput = null;

table.ondblclick = function(e) {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const target = e.target;
  const text = e.target.textContent;

  editStart(target, text);
};

function editStart(target, text) {
  target.innerHTML = `<input type="text" class="cell-input">`;
  cellInput = document.querySelector('.cell-input');

  cellInput.onkeyup = function(evt) {
    if (evt.key === 'Enter') {
      this.blur();
    }
  };

  cellInput.onblur = function() {
    editEnd(target, text);
  };

  target.replaceWith(cellInput);
  cellInput.focus();
}

function editEnd(target, text) {
  if (cellInput.value === '') {
    target.innerHTML = text;
  } else {
    target.innerHTML = cellInput.value;
  }
  cellInput.replaceWith(target);
}
