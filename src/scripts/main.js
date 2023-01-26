'use strict';

const employees = document.querySelector('table');

sortTable(employees);
selectRow(employees);
createForm(employees);

function sortTable(table) {
  let isAsc = true;
  let columnTitle = '';

  document.querySelectorAll('th').forEach((th) => {
    return th.addEventListener('click', (e) => {
      const tbody = table.querySelector('tbody');

      if (columnTitle !== e.target.textContent) {
        isAsc = true;
        columnTitle = e.target.textContent;
      }

      Array.from(tbody.querySelectorAll('tr'))
        .sort(
          getCompareFunction(
            Array.from(th.parentNode.children).indexOf(th),
            isAsc
          )
        )
        .forEach((tr) => tbody.appendChild(tr));

      isAsc = !isAsc;
    });
  });
}

function getCompareFunction(headerIndex, dir) {
  return function(a, b) {
    const aCellValue = getRowCellValue(dir ? a : b, headerIndex);
    const bCellValue = getRowCellValue(dir ? b : a, headerIndex);

    if (
      aCellValue !== ''
      && bCellValue !== ''
      && !isNaN(aCellValue)
      && !isNaN(bCellValue)
    ) {
      return aCellValue - bCellValue;
    }

    return aCellValue[0] === '$'
      ? parseInt(aCellValue.slice(1)) - parseInt(bCellValue.slice(1))
      : aCellValue.toString().localeCompare(bCellValue);
  };
}

function getRowCellValue(tr, index) {
  return tr.children[index].textContent;
}

function selectRow(table) {
  let previousSelectedRow;

  table.querySelector('tbody').addEventListener('click', (e) => {
    if (previousSelectedRow) {
      previousSelectedRow.classList.remove('active');
    }

    e.target.parentNode.classList.add('active');
    previousSelectedRow = e.target.parentNode;
  });
}

function createForm(table) {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>
      Name: 
      <input 
        name="name" 
        type="text"
        data-qa="name"
        required
      >
    </label>

    <label>
      Position: 
      <input 
        name="position" 
        type="text"
        data-qa="position"
        required 
      >
    </label>

    <label>
      Office:
      <select 
        name="office" 
        data-qa="office"
        required
      >
        <option>Tokyo</option>
        <option>San Francisco</option>
        <option>Singapore</option>
        <option>New York</option>
        <option>London</option>
        <option>Edinburgh</option>
      </select>
    </label>
    <label>
      Age: 
      <input 
        name="age" 
        type="number"
        data-qa="age"
        required
      >
    </label>
    <label>
      Salary: 
      <input 
        name="salary" 
        type="number" 
        data-qa="salary"
        required
      >
    </label>
    <button type="submit">
      Save to table
    </button>
  `;

  table.parentNode.insertBefore(form, table.nextSibling);
}
