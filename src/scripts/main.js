'use strict';

let bySort = null;
const officeArr = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'];
const head = document.querySelector('thead').querySelector('tr');
const list = document.querySelector('tbody');
const table = document.querySelector('table');

const mySort = (arr, index, order) => {
  if (order.textContent === 'Salary') {
    if (bySort !== order.textContent) {
      arr.sort((a, b) => {
        const first = Number(a.children[index].textContent
          .slice(1).split(',').join(''));
        const second = Number(b.children[index].textContent
          .slice(1).split(',').join(''));

        return first - second;
      });
      bySort = order.textContent;
    } else {
      arr.reverse();
    }
  } else if (order.textContent === 'Age') {
    if (bySort !== order.textContent) {
      arr.sort((a, b) => {
        return a.children[index].textContent - b.children[index].textContent;
      });
      bySort = order.textContent;
    } else {
      arr.reverse();
    }
  } else {
    if (bySort !== order.textContent) {
      arr.sort((a, b) => {
        return a.children[index].textContent
          .localeCompare(b.children[index].textContent);
      });
      bySort = order.textContent;
    } else {
      arr.reverse();
    }
  }
};

const createInputArr = (...args) => {
  const funcInputArr = [];

  for (let i = 0; i < args.length; i++) {
    const labelName = document.createElement('label');

    labelName.textContent = `${args[i][0].toUpperCase() + args[i].slice(1)}: `;

    if (args[i] !== 'office') {
      const inputName = document.createElement('input');

      inputName.setAttribute('name', args[i]);
      inputName.setAttribute('type', 'text');
      inputName.setAttribute('required', true);
      inputName.setAttribute('data-qa', args[i]);
      labelName.append(inputName);
    } else {
      const inputName = document.createElement('select');

      officeArr.forEach(item => {
        const selOff = document.createElement('option');

        selOff.textContent = item;
        inputName.append(selOff);
      });
      inputName.setAttribute('name', args[i]);
      inputName.setAttribute('data-qa', args[i]);
      labelName.append(inputName);
    }
    funcInputArr.push(labelName);
  }

  return funcInputArr;
};

const createForm = (inputs) => {
  const newForm = document.createElement('form');

  newForm.className = 'new-employee-form';

  for (const input of inputs) {
    newForm.append(input);
  }

  const myButton = document.createElement('button');

  myButton.setAttribute('type', 'submit');
  myButton.textContent = 'Save to table';

  newForm.append(myButton);

  return newForm;
};

const notification = (type, descriptions, notClass) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.className = notClass;
  p.textContent = descriptions;
  h2.textContent = type;
  h2.className = 'title';
  div.append(h2, p);

  return div;
};

const addRow = (data) => {
  const tr = document.createElement('tr');
  let count = 0;

  for (const value of data.values()) {
    const td = document.createElement('td');

    if (count === 4) {
      td.textContent = `$${value.match(/.{1,3}/g).join(',')}`;
      tr.append(td);
    } else {
      td.textContent = value;
      tr.append(td);
    }
    count++;
  }

  return tr;
};

const inputArr = createInputArr('name', 'position', 'office', 'age', 'salary');

document.querySelector('thead').addEventListener('click', (e) => {
  const item = e.target;
  const sortedBody = [...list.querySelectorAll('tr')];
  const index = [...head.querySelectorAll('th')].findIndex(td => {
    return item.textContent === td.textContent;
  });

  mySort(sortedBody, index, [...head.querySelectorAll('th')][index]);

  list.prepend(...sortedBody);
});

const form = createForm(inputArr);

table.parentNode.append(form);

const bodyNode = document.querySelector('body');

form.addEventListener('submit', (e) => {
  const data = new FormData(form);

  e.preventDefault();

  if (data.get('name').length < 4 || data.get('age') < 18
  || data.get('age') > 90 || isNaN(data.get('age'))
  || isNaN(data.get('salary'))) {
    bodyNode.prepend(notification('Error!', 'Enter valid data, please',
      'notification error'));
  } else {
    bodyNode.prepend(notification('Success!',
      'Congratulations, new employer has been added!', 'notification success'));
    list.append(addRow(data));
    form.reset();
  }

  setTimeout(() => {
    bodyNode.children[0].remove();
  }, 2000);
});

list.addEventListener('click', (e) => {
  if (document.querySelector('.active') !== null) {
    document.querySelector('.active').classList.remove('active');
  }

  e.target.closest('tr').classList.add('active');
});

list.addEventListener('dblclick', (e) => {
  const td = e.target;
  const text = td.textContent;

  td.textContent = null;

  td.insertAdjacentHTML('afterbegin', `
  <input name="name" type="text" class="cell-input">
  `);

  td.querySelector('input').addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      td.textContent = (td.querySelector('input').value === '')
        ? text
        : td.querySelector('input').value;
    }
  });

  td.querySelector('input').addEventListener('blur', (ev) => {
    td.textContent = td.querySelector('input').value;
  });
});
