'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const messageError = document.createElement('div');
let salaryCount = 0;
let countNAme = '';
let count = 0;

messageError.setAttribute('data-qa', 'notification');

const form = document.createElement('form');

form.innerHTML = `<label>Name: <input name="name" data-qa="name" type="text" required></label>
<label>Position: <input name="position" data-qa="position"  type="text" required></label>
<label>Office: <select name="office" data-qa="office" required></select></label>
<label>Age: <input name="age" data-qa="age"  type="number" required></label>
<label>Salary: <input name="salary" data-qa="salary"  type="number" required></label>
<button type="submit">Save to table</button>`;
form.className = 'new-employee-form';
body.appendChild(form);

form.office.innerHTML += `
<option>Tokyo</option>
<option>Singapore</option>
<option>London</option>
<option>New York</option>
<option>Edinburgh</option>
<option>San Francisco</option>
`;

const addTD = form.querySelectorAll('label');
const inputList = form.querySelectorAll('input');

table.addEventListener('click', sorted);

function counter(ev) {
  if (countNAme === ev) {
    count++;
  } else {
    count = 1;
    countNAme = ev;
  }
}

function sorted(e) {
  const rows = Array.from(tbody.querySelectorAll('tr'));
  let index;
  let result;

  if (e.target.localName === 'th') {
    counter(e.target.textContent);

    switch (e.target.textContent) {
      case 'Name':
        index = 0;
        break;
      case 'Position':
        index = 1;
        break;
      case 'Office':
        index = 2;
        break;
      case 'Age':
        index = 3;
        break;
      case 'Salary':
        index = 4;
        break;
    }

    rows.sort((srtA, srtB) => {
      let cA = srtA.cells[index].textContent.trim();
      let cB = srtB.cells[index].textContent.trim();

      if (index === 4) {
        cA = +srtA.cells[index].textContent.trim().split(',').join('').slice(1);
        cB = +srtB.cells[index].textContent.trim().split(',').join('').slice(1);
      }

      if (count % 2 !== 0) {
        result = isNaN(cA - cB) ? cA.localeCompare(cB) : cA - cB;
      } else {
        result = isNaN(cB - cA) ? cB.localeCompare(cA) : cB - cA;
      }

      return result;
    });
    rows.forEach((row) => tbody.appendChild(row));
  }

  if (e.target.localName === 'td') {
    const active = tbody.querySelectorAll('tr');

    if (e.target.parentElement.classList.contains('active')) {
      e.target.parentElement.classList.remove('active');

      return;
    }

    for (const t of active) {
      if (t.classList.contains('active')) {
        t.classList.remove('active');
      }
    }
    e.target.parentElement.classList.toggle('active');
  }
}

form.addEventListener('submit', addTAble);

function addTAble(e) {
  e.preventDefault();

  const addTr = document.createElement('tr');

  if (e.target.name.value.length < 4) {
    messageError.className = 'error';
    messageError.textContent = 'The name must be at least 4 characters long';
    form.append(messageError);

    return;
  }

  if (+e.target.age.value < 18 || +e.target.age.value > 90) {
    messageError.className = 'error';
    messageError.textContent = ' Age must be between 18 and 90';
    form.append(messageError);

    return;
  }

  function salaryWithDollar(summ) {
    const salArr = summ.split('');
    const res = summ.length % 3;
    let resSal = '$';

    if (res === 1) {
      for (let i = 0; i < salArr.length; i++) {
        if (i > 0) {
          if (i % 3 === 0) {
            resSal += `${salArr[i]},`;
          } else {
            resSal += `${salArr[i]}`;
          }
        } else {
          resSal += `${salArr[i]},`;
        }
      }
    }

    if (res === 2) {
      for (let i = 0; i < salArr.length; i++) {
        if (i > 1) {
          if (i % 3 === 1) {
            resSal += `${salArr[i]},`;
          } else {
            resSal += `${salArr[i]}`;
          }
        } else {
          resSal += `${salArr[i]},`;
        }
      }
    }

    if (res === 3) {
      for (let i = 0; i < salArr.length; i++) {
        if (i > 2) {
          if (i % 3 === 2) {
            resSal += `${salArr[i]},`;
          } else {
            resSal += `${salArr[i]}`;
          }
        } else {
          resSal += `${salArr[i]},`;
        }
      }
    }

    return resSal.slice(0, -1);
  }

  for (const add of addTD) {
    if (salaryCount === 4) {
      const td = document.createElement('td');
      const sal = add.childNodes[1].value.toString();

      td.textContent = salaryWithDollar(sal);
      addTr.append(td);
      salaryCount = 0;
    } else {
      const td = document.createElement('td');

      td.textContent = add.childNodes[1].value;
      addTr.append(td);
      salaryCount++;
    }
  }

  tbody.append(addTr);
  form.reset();

  messageError.className = 'success';
  messageError.textContent = 'Yes, success';
  form.append(messageError);
}

for (const input of inputList) {
  input.addEventListener('focus', (e) => {
    if (messageError) {
      messageError.textContent = '';
    }
  });
}
