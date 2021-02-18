'use strict';

// write code here

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

  const labels = ['Name', 'Position', 'Office', 'Age', 'Salary'];

  for (const text of labels) {
    const label = document.createElement('label');

    label.textContent = text + ':';
    form.append(label);
  };

  const inputName = document.createElement('input');

  inputName.setAttribute('name', 'name');
  inputName.setAttribute('type', 'text');
  inputName.setAttribute('data-qa', 'name');
  form.children[0].append(inputName);

  const inputPosition = document.createElement('input');

  inputPosition.setAttribute('name', 'position');
  inputPosition.setAttribute('type', 'text');
  inputPosition.setAttribute('data-qa', 'position');
  form.children[1].append(inputPosition);

  const selectLocation = document.createElement('select');

  selectLocation.setAttribute('name', 'office');
  selectLocation.setAttribute('data-qa', 'office');
  form.children[2].append(selectLocation);

  const offices = [`Tokyo`, `Singapore`, `London`,
    `New York`, `Edinburgh`, `San Francisco`];

  offices.forEach(office => {
    const option = document.createElement('option');

    option.textContent = office;
    form.children[2].firstElementChild.append(option);
  });

  const inputAge = document.createElement('input');

  inputAge.setAttribute('name', 'age');
  inputAge.setAttribute('type', 'number');
  inputAge.setAttribute('data-qa', 'age');
  form.children[3].append(inputAge);

  const inputSalary = document.createElement('input');

  inputSalary.setAttribute('name', 'salary');
  inputSalary.setAttribute('type', 'number');
  inputSalary.setAttribute('data-qa', 'salary');
  form.children[4].append(inputSalary);

  const submitButton = document.createElement('button');

  submitButton.setAttribute('type', 'submit');
  submitButton.textContent = 'Save to table';
  form.append(submitButton);
};

const ariseMsg = (type, title, description, posTop = 10, posRight = 10) => {
  const msg = document.createElement('msg');
  const div = document.createElement('div');

  div.className = `notification ${type}`;
  div.setAttribute('data-qa', 'notification');
  div.setAttribute('style', `top: ${posTop}px; right: ${posRight}px;`);
  msg.append(div);
  body.append(msg);

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;
  div.append(h2);

  const p = document.createElement('p');

  p.textContent = description;
  div.append(p);

  setTimeout(function rem() {
    msg.remove();
  }, 5000);
};

const submitForm = function() {
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const newEmpEntries = Object.fromEntries(formData.entries());
    const values = Object.values(newEmpEntries);

    // Вова, привет! name подчеркивает и показывает что объявлено выше
    // хотя я ее там не объявлял. Не понимаю почему влетает эта ошибка???
    // eslint-disable-next-line no-shadow
    const { name, position, age, salary } = newEmpEntries;

    function convertSalary() {
      const nfObject = new Intl.NumberFormat(('en-US'));
      const convdSalary = '$' + nfObject.format(salary);

      return convdSalary;
    };

    values[4] = convertSalary();

    if (name.length < 4 && (position)) {
      ariseMsg('error', 'ERROR!',
        'The name should contain at least 4 letters.\n ', 150, 10);

      return;
    }

    if (age < 18 || age > 90) {
      ariseMsg('error', 'ERROR!',
        'The age should be more than 18 or less then 90 year old!\n ', 290, 10);

      return;
    }

    if (position.length < 4) {
      ariseMsg('error', 'WARNING!',
        'The position should contain at least 4 letters.\n ', 430, 10);
    } else {
      const tr = document.createElement('tr');

      for (const value of values) {
        const td = document.createElement('td');

        td.textContent = value;
        tr.append(td);
      }
      tBody.append(tr);

      ariseMsg('success', 'SUCCESS!',
        'The employee added succesfully.\n ', 10, 10);

      document.querySelector('[name="name"]').value = '';
      document.querySelector('[name="position"]').value = '';
      document.querySelector('[name="age"]').value = '';
      document.querySelector('[name="salary"]').value = '';
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
