'use strict';

// write code here

const labels = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const offices = [`Tokyo`, `Singapore`, `London`,
  `New York`, `Edinburgh`, `San Francisco`];

const body = document.body;
const tBody = document.querySelector('tbody');
const tData = [...tBody.querySelectorAll('tr')];
let colIndex = -1;

const sortTable = function(columnIdx, tHeaderName, isSorted) {
  const sortedData = tData.sort((p, n) => {
    let prev = [...p.querySelectorAll('td')][columnIdx].textContent;
    let next = [...n.querySelectorAll('td')][columnIdx].textContent;

    switch (tHeaderName) {
      case 'Name':
      case 'Position':
      case 'Office':
      case 'Age':
        return prev.localeCompare(next);
      case 'Salary':
        prev = prev.split('$').join('').split(',').join('');
        next = next.split('$').join('').split(',').join('');

        return parseFloat(prev) - parseFloat(next);
    }
  });

  if (isSorted) {
    tData.reverse();
  }

  tBody.append(...sortedData);
};

const selectedRow = function(target) {
  const currentRow = document.querySelectorAll('.active');

  if (currentRow.length > 0) {
    currentRow[0].className = currentRow[0].className.replace('active', '');
  }
  target.parentElement.className = 'active';
};

body.addEventListener('click', (e) => {
  const target = e.target;

  if (target.tagName === 'BODY') {
    return;
  }

  if (target.tagName === 'TH') {
    const columnIdx = target.cellIndex;
    const tHeaderName = target.textContent;

    sortTable(columnIdx, tHeaderName, colIndex === columnIdx);
    colIndex = (colIndex === columnIdx) ? -1 : columnIdx;
  }

  if (target.tagName === 'TD') {
    selectedRow(target);
  }
});

const createForm = function() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';
  body.append(form);

  for (let i = 0; i < labels.length; i++) {
    const label = document.createElement('label');

    label.textContent = labels[i] + ':';
    form.append(label);

    if (labels[i] === 'Office') {
      const select = document.createElement('select');

      select.setAttribute('name', labels[i].toLowerCase());
      select.setAttribute('data-qa', labels[i].toLowerCase());
      form.children[i].append(select);

      offices.forEach(office => {
        const option = document.createElement('option');

        option.textContent = office;
        form.children[i].firstElementChild.append(option);
      });

      continue;
    }

    if (labels[i] === 'Age' || labels[i] === 'Salary') {
      const input = document.createElement('input');

      input.setAttribute('name', labels[i].toLocaleLowerCase());
      input.setAttribute('type', 'number');
      input.setAttribute('data-qa', labels[i].toLocaleLowerCase());
      form.children[i].append(input);
    } else {
      const input = document.createElement('input');

      input.setAttribute('name', labels[i].toLocaleLowerCase());
      input.setAttribute('type', 'text');
      input.setAttribute('data-qa', labels[i].toLocaleLowerCase());
      form.children[i].append(input);
    }
  }

  const submitButton = document.createElement('button');

  submitButton.setAttribute('type', 'submit');
  submitButton.textContent = 'Save to table';
  form.append(submitButton);
};

const ariseMessage = (type, title, description, posTop = 10, posRight = 10) => {
  const message = document.createElement('msg');
  const messageContainer = document.createElement('div');

  messageContainer.className = `notification ${type}`;
  messageContainer.setAttribute('data-qa', 'notification');

  messageContainer.setAttribute('style', `top: ${posTop}px; 
  right: ${posRight}px;`);
  message.append(messageContainer);
  body.append(message);

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;
  messageContainer.append(h2);

  const p = document.createElement('p');

  p.textContent = description;
  messageContainer.append(p);

  setTimeout(function rem() {
    message.remove();
  }, 5000);
};

const submitForm = function() {
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const newEmpEntries = Object.fromEntries(formData.entries());
    const values = Object.values(newEmpEntries);

    // eslint-disable-next-line no-shadow
    const { name, position, age, salary } = newEmpEntries;

    function convertSalary() {
      const nfObject = new Intl.NumberFormat(('en-US'));
      const convdSalary = '$' + nfObject.format(salary);

      return convdSalary;
    };

    values[4] = convertSalary();

    if (name.length < 4 && (position)) {
      ariseMessage('error', 'ERROR!',
        'The name should contain at least 4 letters.\n ', 150, 10);

      return;
    }

    if (age < 18 || age > 90) {
      ariseMessage('error', 'ERROR!',
        'The age should be more than 18 or less then 90 year old!\n ', 290, 10);

      return;
    }

    if (position.length < 4) {
      ariseMessage('error', 'WARNING!',
        'The position should contain at least 4 letters.\n ', 430, 10);
    } else {
      const tr = document.createElement('tr');

      for (const value of values) {
        const td = document.createElement('td');

        td.textContent = value;
        tr.append(td);
      }
      tBody.append(tr);

      ariseMessage('success', 'SUCCESS!',
        'The employee added succesfully.\n ', 10, 10);

      labels.forEach(label => {
        document.querySelector(`[name="${label.toLowerCase()}"]`).value = '';
      });
    }
  });
};

const editingCellsByDoubleClick = function() {
  tBody.addEventListener('dblclick', (e) => {
    const target = e.target;

    if (target.tagName !== 'TD') {
      return;
    }

    const tdInput = document.createElement('input');

    tdInput.setAttribute('value', target.textContent);
    tdInput.setAttribute('type', 'text');
    target.textContent = '';
    target.append(tdInput);
    tdInput.focus();

    tdInput.addEventListener('blur', () => {
      target.textContent = tdInput.value;
    });

    tdInput.addEventListener('keydown', (ent) => {
      if (ent.code === 'Enter') {
        target.textContent = tdInput.value;
      }
    });
  });
};

createForm();
submitForm();
editingCellsByDoubleClick();
