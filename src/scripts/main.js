'use strict';
// creative Form

const body = document.querySelector('body');
const form = document.createElement('form');

form.className = 'new-employee-form';

const thead = document.querySelector('thead');

const theadContent = [...thead.firstElementChild.children];

theadContent.forEach((th) => {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const select = document.createElement('select');

  label.textContent = th.textContent;

  if (th.textContent !== 'Office') {
    input.setAttribute('name', th.textContent.toLowerCase());

    if (th.textContent === 'Age' || th.textContent === 'Salary') {
      input.setAttribute('type', 'number');
    } else {
      input.setAttribute('type', 'text');
    }

    // input.setAttribute('required', 'true');
    input.dataset.qa = th.textContent.toLowerCase();

    label.append(input);

    form.append(label);
  } else {
    const cities = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    select.setAttribute('name', th.textContent.toLowerCase());
    select.dataset.qa = th.textContent.toLowerCase();

    for (const city of cities) {
      const option = document.createElement('option');

      option.textContent = city;

      select.append(option);
    }
    label.append(select);
    form.append(label);
  }
});

const button = document.createElement('button');

button.setAttribute('type', 'submit');

button.textContent = 'Save to table';
form.append(button);

body.append(form);

// creative message
const message = document.createElement('message');
const titleElement = document.createElement('h2');
const p = document.createElement('p');

message.append(titleElement);
message.append(p);
titleElement.setAttribute('class', 'title');
message.classList.add('notification');
message.dataset.qa = 'notification';
document.querySelector('body').append(message);

message.style.display = 'none';

// check validation

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = [...document.querySelectorAll('input')];
  const nameInput = inputs[0];
  const positionInput = inputs[1];
  const ageInput = inputs[2];

  const conditionOne = nameInput.value.length < 4;
  const conditionTwo = ageInput.value < 18 || ageInput.value > 90;
  const conditionThree = positionInput.value.length === 0;

  if (conditionOne || conditionTwo || conditionThree) {
    message.style.display = 'block';

    message.classList.toggle('success', false);

    if (!message.classList.contains('error')) {
      message.classList.add('error');
    }

    titleElement.textContent = 'YOU SHALL NOT PASS';

    p.textContent = `1.Name has less than 4 letters
    2.Position must not be empty
    3.Age(18 - 90)`;

    button.setAttribute('disabled', '');

    setTimeout(() => {
      message.style.display = 'none';
      button.removeAttribute('disabled', '');
    }, 2000);

    return false;
  }

  const select = document.querySelector('select');
  const salary = +inputs[3].value;

  message.style.display = 'block';

  message.classList.toggle('success', !message.classList.contains('success'));
  message.classList.toggle('error', false);

  titleElement.textContent = 'WELL YOU  PASS';

  p.textContent = `The hardest part is over`;

  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);

  const newRow = tbody.insertRow();

  const nameCell = newRow.insertCell();
  const positionCell = newRow.insertCell();
  const officeCell = newRow.insertCell();
  const ageCell = newRow.insertCell();
  const salCell = newRow.insertCell();

  nameCell.textContent = inputs[0].value;
  positionCell.textContent = inputs[1].value;
  officeCell.textContent = select.value;
  ageCell.textContent = inputs[2].value;
  salCell.textContent = '$' + salary.toLocaleString('en-US');

  form.reset();
});
// select

const tbody = document.querySelector('tbody');

tbody.onclick = (e) => {
  const tr = e.target.closest('tr');
  const search = tbody.querySelector('.active');

  search?.classList.remove('active');

  if (!tr) {
    return false;
  }

  tr.classList.add('active');
};

// newSort

const table = document.querySelector('table');

table.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return false;
  }

  const th = e.target;
  const index = th.cellIndex;
  const tbodyContent = [...tbody.rows];

  function sortedByAbc(a, b) {
    if (index === 4) {
      const one = +a.cells[index].innerHTML.replaceAll(/[$,]/g, '');
      const two = +b.cells[index].innerHTML.replaceAll(/[$,]/g, '');

      return one > two ? 1 : -1;
    }

    return a.cells[index].innerHTML > b.cells[index].innerHTML ? 1 : -1;
  }

  function sortedByCba(a, b) {
    if (index === 4) {
      const one = +a.cells[index].innerHTML.replaceAll(/[$,]/g, '');
      const two = +b.cells[index].innerHTML.replaceAll(/[$,]/g, '');

      return one > two ? -1 : 1;
    }

    return a.cells[index].innerHTML > b.cells[index].innerHTML ? -1 : 1;
  }

  if (!th.hasAttribute('data-order')) {
    tbodyContent.sort(sortedByAbc);
    th.dataset.order = 'ABC';
  } else {
    tbodyContent.sort(sortedByCba);
    th.removeAttribute('data-order');
  }

  tbody.append(...tbodyContent);

  return false;
});

// creative dblclick
const newInput = document.createElement('input');

tbody.ondblclick = (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return false;
  }

  if (td.cellIndex >= 3) {
    newInput.setAttribute('type', 'number');
  }

  newInput.classList.add('cell-input');

  let oldInfo;

  if (td.textContent.length > 0) {
    oldInfo = td.textContent;
  }

  newInput.value = '';
  td.textContent = '';
  td.append(newInput);

  newInput.onblur = () => {
    if (newInput.value.length < 2 && td.cellIndex < 3) {
      td.textContent = oldInfo;
      alert('no, please, nooooo!!!! (name.length >= 2)');

      return false;
    }

    if (td.cellIndex === 4) {
      newInput.setAttribute('type', 'text');

      const money = +newInput.value;

      newInput.value = '$' + money.toLocaleString('en-US');
    }
    td.textContent = newInput.value;
    newInput.remove();
  };

  newInput.addEventListener('keypress', (ev) => {
    if (ev.code === 'Enter') {
      if (newInput.value.length < 2 && td.cellIndex < 3) {
        td.textContent = oldInfo;
        alert('no, please, nooooo!!!! (name.length >= 2)');

        return false;
      }

      if (td.cellIndex === 4) {
        newInput.setAttribute('type', 'text');

        const money = +newInput.value;

        newInput.value = '$' + money.toLocaleString('en-US');
      }
      td.textContent = newInput.value;
      newInput.remove();
    }
  });
};
