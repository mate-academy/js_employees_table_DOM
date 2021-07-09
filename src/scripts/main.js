'use strict';

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
let click;
let direction = true;
let selected;

tableHead.addEventListener('click', e => {
  const tableCeil = e.target;
  const columnforSort = tableCeil.cellIndex;
  let sorted;

  if (click === tableCeil) {
    direction = !direction;
  } else {
    direction = true;
    click = tableCeil;
  }

  function getString(value) {
    return value.children[columnforSort].innerText;
  }

  function getSalary(value) {
    return getString(value).slice(1).split(',').join('');
  }

  function callbackForString(a, b) {
    return direction
      ? a.localeCompare(b)
      : b.localeCompare(a);
  }

  function callbackForNumbers(a, b) {
    return direction
      ? +a - +b
      : +b - +a;
  }

  switch (tableCeil.innerText) {
    case 'Name':
    case 'Position':
    case 'Office':
      sorted = [...tableBody.rows].sort(
        (a, b) => callbackForString(getString(a), getString(b))
      );
      break;

    case 'Age':
      sorted = [...tableBody.rows].sort(
        (a, b) => callbackForNumbers(getString(a), getString(b))
      );
      break;

    case 'Salary':
      sorted = [...tableBody.rows].sort(
        (a, b) => callbackForNumbers(getSalary(a), getSalary(b))
      );
      break;
  }

  sorted.forEach(item => tableBody.append(item));
});

tableBody.addEventListener('click', e => {
  const item = e.target.closest('tr');

  if (!selected) {
    selected = item;
    selected.classList.add('active');
  } else if (selected !== item) {
    selected.classList.remove('active');
    selected = item;
    selected.classList.add('active');
  } else {
    selected.classList.remove('active');
  }
});
