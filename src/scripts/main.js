'use strict';

const myTable = document.querySelector('table');

sortingTable(myTable);
selectedTable(myTable);
createForm();

function sortingTable(table) {
  const head = table.querySelector('thead');

  head.querySelectorAll('th').forEach(function(item) {
    item.append(document.createElement('span'));
  });

  const arrCompare = [1, 1, 1, 1, 1];

  head.addEventListener('click', (eventFunc) => {
    const cellNumber = eventFunc.target.cellIndex;
    const asc = ' \u25BC';
    const desc = ' \u25B2';
    const convert = (stringNumber) => {
      return Number(stringNumber.toLocaleString().replace(/\D/g, ''));
    };
    const compareVariables = (aa, bb) => {
      let a = aa.children[cellNumber].textContent;
      let b = bb.children[cellNumber].textContent;

      if (convert(a) > 0) {
        a = (convert(a));
        b = (convert(b));
      }

      return a < b ? arrCompare[cellNumber] : arrCompare[cellNumber] * (-1);
    };

    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    for (let i = 0; i < arrCompare.length; i++) {
      arrCompare[i] = cellNumber === i ? arrCompare[i] * (-1) : 1;
    }

    head.querySelectorAll('span')[cellNumber]
      .textContent = arrCompare[cellNumber] === 1 ? asc : desc;

    head.querySelectorAll('span')[cellNumber].style.fontSize = '12px';

    document.querySelector('tbody')
      .append(...[...document.querySelector('tbody').children].sort((a, b) =>
        compareVariables(a, b)));
  });
}

function selectedTable(table) {
  const rows = table.querySelector('tbody');

  rows.addEventListener('click', (eventFunc) => {
    for (const i of rows.children) {
      i.classList.remove('active');
    }
    eventFunc.target.parentElement.classList.add('active');
  });
}

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
  <label>Name:<input type="text" name="name" data-qa="name"></label>
  <label>Position:<input type="text" name="position" data-qa="position"></label>
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
  <label>Age:<input type="number" name="age" data-qa="age">
  </label>
  <label>Salary:<input type="number" name="salary" data-qa="salary">
  </label>
  <button type="submit">Save to table</button>
  `;
  document.body.insertBefore(form, document.body[1]);
}
