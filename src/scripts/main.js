'use strict';

const headerList = [...document.querySelectorAll('th')];
let listBody = document.querySelector('tbody');
let list = [...document.querySelectorAll('tr')].slice(1, -1);
let headerIndex;
const form = document.querySelector('.new-employee-form');
const formButton = document.querySelector('.form-button');

document.addEventListener('click', sort);
document.addEventListener('click', doHighlight);
document.addEventListener('dblclick', cellRevision);
form.addEventListener('submit', addNewPerson);
formButton.addEventListener('click', addErrorNotification);

function cellRevision(e) {
  if (e.target.tagName === 'TD') {
    const cell = e.target;
    const input = document.createElement('input');
    const startValue = cell.innerHTML;

    input.classList.add('cell-input');
    input.value = startValue;
    cell.innerHTML = '';
    cell.appendChild(input);
    cell.lastChild.focus();

    input.addEventListener('blur', () =>
      (cell.innerHTML = input.value));

    cell.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.code === 'Enter') {
        if (!input.value.length) {
          cell.innerHTML = startValue;

          return;
        }
        cell.lastElementChild.remove();
        cell.innerHTML = input.value;
      }
    }
    );
  }
}

function addErrorNotification(e) {
  if (document.querySelector('.notification')) {
    document.querySelector('.notification').remove();
  }

  listBody = document.querySelector('tbody');

  const errorNotification
    = `<div class="notification error" data-qa="notification">
    <h2 class="title">Please enter correct data</h2>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', errorNotification);
}

function addNewPerson(e) {
  e.preventDefault();

  const formData = new FormData(form);
  const personName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = formData.get('age');
  const salary = formData.get('salary');
  const newPerson = `
    <tr>
    <td>${personName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${'$' + addCorrectSalary(salary)}</td>
    </tr>
    `;

  listBody.insertAdjacentHTML('beforeend', newPerson);

  const inputs = document.querySelectorAll('.input');

  inputs.forEach(a => (a.value = ''));

  inputs[2].value = 'Tokyo';

  document.querySelector('.notification').remove();

  const successNotification
    = `<div class="notification success" data-qa="notification">
    <h2 class="title">A new employee has been added</h2>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', successNotification);

  function addCorrectSalary(string) {
    let formatSalary = '';

    for (let i = 0; i < string.length; i++) {
      if (i === string.length - 4) {
        formatSalary += (string[i] + ',');
      } else {
        formatSalary += string[i];
      }
    }

    return formatSalary;
  }
}

function doHighlight(e) {
  if (e.target.tagName === 'TD') {
    const item = e.target.closest('TR');

    list.forEach(a => a.classList.remove('active'));

    item.classList.add('active');
  }
}

function sort(e) {
  list = [...document.querySelectorAll('tr')].slice(1, -1);

  if (e.target.tagName === 'TH') {
    const item = e.target;
    const indexForSort = headerList.indexOf(item);
    const sortElements = getSortList(indexForSort);

    listBody.innerHTML = '';

    if (indexForSort === headerIndex) {
      for (let i = list.length - 1; i >= 0; i--) {
        listBody.appendChild(sortElements[i]);
        headerIndex = null;
      }
    } else {
      headerIndex = indexForSort;

      for (let i = 0; i < list.length; i++) {
        listBody.appendChild(sortElements[i]);
      }
    }
  }
}

function getSortList(i) {
  list = [...document.querySelectorAll('tr')].slice(1, -1);

  let sortElements;

  if (i !== 4) {
    sortElements = list.sort((a, b) =>
      a.cells[i].innerHTML
        .localeCompare(b.cells[i].innerHTML));
  } else {
    sortElements = list.sort((a, b) =>
      getCorrectSalary(a.cells[i].innerHTML) - getCorrectSalary(
        b.cells[i].innerHTML));
  }

  return sortElements;
}

function getCorrectSalary(string) {
  let salary = '';

  for (let i = 0; i < string.length; i++) {
    if (string[i] !== '$' && string[i] !== ',') {
      salary += string[i];
    }
  }

  return +salary;
}
