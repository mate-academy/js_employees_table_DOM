'use strict';

const table = document.querySelector('tbody');
const persons = [...table.rows];
const options = `
<option value="Tokyo">Tokyo</option>
<option value="Singapore">Singapore</option>
<option value="London">London</option>
<option value="New York">New York</option>
<option value="Edinburgh">Edinburgh</option>
<option value="San Francisco">San Francisco</option>`;

// sorting

function trimmer(sal) {
  return sal.replace(/\D/g, '');
};

function cleaner(coll, attr) {
  for (const th of coll) {
    th.removeAttribute(attr);
  };
}

document.addEventListener('click', e => {
  const target = e.target;

  if (target.tagName !== 'TH') {
    return;
  }

  if (!target.dataset.sorted || target.dataset.sorted === 'DESC') {
    persons.sort((a, b) => {
      switch (target.innerText) {
        case 'Age':
          return +a.children[target.cellIndex].innerText
            - +b.children[target.cellIndex].innerText;

        case 'Salary':
          return trimmer(a.children[target.cellIndex].innerText)
            - trimmer(b.children[target.cellIndex].innerText);

        default:
          return a.children[target.cellIndex].innerText
            .localeCompare(b.children[target.cellIndex].innerText);
      };
    });

    cleaner(document.querySelectorAll('th'), 'data-sorted');

    target.dataset.sorted = 'ASC';
  } else {
    persons.sort((a, b) => {
      switch (target.innerText) {
        case 'Age':
          return +b.children[target.cellIndex].innerText
            - +a.children[target.cellIndex].innerText;

        case 'Salary':
          return trimmer(b.children[target.cellIndex].innerText)
            - trimmer(a.children[target.cellIndex].innerText);

        default:
          return b.children[target.cellIndex].innerText
            .localeCompare(a.children[target.cellIndex].innerText);
      }
    });

    cleaner(document.querySelectorAll('th'), 'data-sorted');

    target.dataset.sorted = 'DESC';
  };

  table.append(...persons);
});

// selection of the row

table.addEventListener('click', e => {
  const toSelect = e.target.parentElement;

  for (const row of table.rows) {
    row.classList.remove('active');
  }

  toSelect.className = 'active';
});

// add a form

const form = document.createElement('form');

form.classList.add('new-employee-form');

document.body.append(form);

form.insertAdjacentHTML('afterbegin', `
  <label>Name:
    <input 
      name="name" 
      type="text" 
      data-qa="name" 
      required
    >
  </label>

  <label>Position:
    <input 
      name="position" 
      type="text" 
      data-qa="position" 
      required
    >
  </label>

  <label>Office:
    <select
      name="office" 
      data-qa="office" 
      required
    >
      ${options};
    </select>
  </label>

  <label>Age:
    <input 
      name="age" 
      type="number" 
      data-qa="age"
      required
    >
  </label>

  <label>Salary:
    <input 
      name="salary" 
      type="number" 
      data-qa="salary" 
      required
    >
  </label>

  <button>Save to table</button>
`);

// notification

const pushNotification = (title, description, type) => {
  const element = document.createElement('div');
  const elTitle = document.createElement('h2');
  const elPar = document.createElement('p');

  element.classList.add(type, 'notification');
  element.dataset.qa = 'notification';

  elTitle.classList.add('title');
  elTitle.innerHTML = title;

  elPar.innerHTML = description;

  element.append(elTitle, elPar);

  document.body.append(element);

  setTimeout(() => {
    element.remove();
  }, 3000);
};

const inputs = form.querySelectorAll('input');
const button = form.querySelector('button');
const nameField = form.querySelector('[name="name"]');
const position = form.querySelector('[name="position" ]');
const office = form.querySelector('[name="office"]');
const age = form.querySelector('[name="age"]');
const salary = form.querySelector('[name="salary"]');

button.addEventListener('click', e => {
  const notification = document.body.querySelector('.notification');

  e.preventDefault();

  if (document.body.contains(notification)) {
    notification.remove();
  };

  for (const input of inputs) {
    if (!input.value) {
      pushNotification('Error', 'Fill all the inputs', 'error');

      return;
    }
  }

  if (nameField.value.length < 4 || position.value.length < 4) {
    pushNotification('Error', 'Min. length is 4 letters', 'error');

    return;
  };

  if (!isNaN(nameField.value)) {
    pushNotification('Error', 'Name mustn`t be a number', 'error');

    return;
  };

  if (!isNaN(position.value)) {
    pushNotification('Error', 'Position mustn`t be a number', 'error');

    return;
  };

  if (age.value < 18 || age.value > 90) {
    pushNotification('Error', 'Age should be from 18 to 90', 'error');

    return;
  };

  // add tr

  table.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${nameField.value}</td>
    <td>${position.value}</td>
    <td>${office.value}</td>
    <td>${age.value}</td>
    <td>$${(+salary.value).toLocaleString('en-US')}</td>
  </tr>
  `);

  for (const input of inputs) {
    input.value = null;
  }

  pushNotification('Success', 'New employee was added', 'success');
});

// editing on double-click

table.addEventListener('dblclick', e => {
  if (e.target.tagName !== 'TD') {
    return;
  };

  if (table.querySelectorAll('.cell-input').length >= 1) {
    return;
  }

  const cellText = e.target.textContent;
  const newInput = e.target.cellIndex === 2
    ? document.createElement('select')
    : document.createElement('input');

  if (newInput.tagName === 'SELECT') {
    newInput.insertAdjacentHTML('afterbegin', options);
  };

  newInput.value = cellText;
  newInput.classList.add('cell-input');

  e.target.firstChild.replaceWith(newInput);

  const checker = function() {
    const notification = document.body.querySelector('.notification');

    if (document.body.contains(notification)) {
      notification.remove();
    };

    if (e.target.cellIndex === 0 || e.target.cellIndex === 1) {
      if (newInput.value.length < 4) {
        newInput.replaceWith(cellText);

        pushNotification('Error', 'Min. length is 4 letters', 'error');
      };

      if (newInput.value && !isNaN(newInput.value)) {
        newInput.replaceWith(cellText);

        pushNotification('Error', 'Mustn`t be a number', 'error');
      };
    };

    if (e.target.cellIndex === 3) {
      if (isNaN(newInput.value)) {
        newInput.replaceWith(cellText);

        pushNotification('Erorr', 'Please, enter the number', 'error');
      };

      if (newInput.value < 18 || newInput.value > 90) {
        newInput.replaceWith(cellText);

        pushNotification('Erorr', 'Age only from 18 to 90', 'error');
      }
    };

    if (e.target.cellIndex === 4) {
      if (isNaN(newInput.value)) {
        newInput.replaceWith(cellText);

        pushNotification('Erorr', 'Only numbers please', 'error');
      }

      newInput.replaceWith(`$${(+newInput.value).toLocaleString('en-US')}`);
    };

    newInput.replaceWith(newInput.value);
  };

  newInput.addEventListener('blur', () => {
    checker();
  });

  newInput.addEventListener('keydown', ev => {
    if (ev.code === 'Enter') {
      checker();
    }
  });
});
