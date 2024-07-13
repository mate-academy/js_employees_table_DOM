'use strict';

const table = document.querySelector('table');
const tHead = table.querySelector('thead tr');
const tBody = table.querySelector('tbody');

const markUpHeaders = [...tHead.children].map((th) => {
  return th.textContent;
});

function spreadSettingsEmployees(arrayTr) {
  const peopleObj = arrayTr.map((tr) => {
    const obj = {};

    for (let i = 0; i < tr.children.length; i++) {
      obj[markUpHeaders[i]] = tr.children[i].textContent;
    }

    return obj;
  });

  return peopleObj;
}

function sortEmployees(sortName, arrayEmployyes) {
  switch (sortName) {
    case 'Name':
    case 'Position':
    case 'Office':
      return arrayEmployyes.sort((a, b) => {
        return a[sortName].localeCompare(b[sortName]);
      });

    case 'Age':
      return arrayEmployyes.sort((a, b) => {
        return +a[sortName] - +b[sortName];
      });

    case 'Salary':
      return arrayEmployyes.sort((a, b) => {
        const aSal = +a[sortName].slice(1).replace(',', '');
        const bSal = +b[sortName].slice(1).replace(',', '');

        return aSal - bSal;
      });

    default:
      break;
  }
}

function reRenderTableBody(employees, sortName, reverse = false) {
  const tbody = document.querySelector('tbody');

  if (reverse) {
    employees.reverse();
  } else {
    sortEmployees(sortName, employees);
  }

  [...tbody.children].forEach((tr) => {
    tr.remove();
  });

  employees
    .map((item) => {
      return `
    <tr>
    <td>${item.Name} </td>
    <td>${item.Position} </td>
    <td>${item.Office} </td>
    <td>${item.Age} </td>
    <td>${item.Salary} </td>
    </tr>
    `;
    })
    .forEach((tr) => {
      tbody.insertAdjacentHTML('beforeend', tr);
    });
}

function counterClick() {
  const downList = [];

  return (nameSort) => {
    downList.push(nameSort);

    return downList;
  };
}

const counterClicks = counterClick();

tHead.addEventListener('click', (e) => {
  const sortName = e.target.textContent;

  const employees = spreadSettingsEmployees([...tBody.children]);

  const counter = [...counterClicks(sortName)];

  if (counter[counter.length - 2] === sortName) {
    reRenderTableBody(employees, sortName, true);
  } else {
    reRenderTableBody(employees, sortName);
  }
});
