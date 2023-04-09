'use strict';

const table = document.querySelector('table');
let tbodyRows = [...table.tBodies[0].rows];

const form = document.querySelector('.new-employee-form');
const notification = document.querySelector('.notification');
let order = 'asc';

form.addEventListener('submit', e => {
  e.preventDefault();

  if (form.checkValidity()) {
    e.preventDefault();
    addEmployee();
    showNotification('Success', 'New employee was added', 'success')
    form.reset();
  }
});

table.addEventListener('click', function(e) {
  if (e.target.tagName === 'TH') {
    const thIndex = e.target.cellIndex;

    if (order === 'asc') {
      order = 'desc';
    } else {
      order = 'asc';
    }

    tbodyRows.sort((a, b) => sortRows(a, b, thIndex, order));

    for (const tr of tbodyRows) {
      table.tBodies[0].append(tr);
    }
  }
});

table.addEventListener('dblclick', function(e) {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const cellIndex = e.target.cellIndex;
  const rowIndex = e.target.parentElement.sectionRowIndex;

  editCell(tbodyRows[rowIndex].cells[cellIndex]);
});

table.tBodies[0].addEventListener('click', e => {
  if (e.target.tagName === 'TD') {
    const rowIndex = e.target.parentElement.sectionRowIndex;

    for (const row of tbodyRows) {
      if (row.sectionRowIndex !== rowIndex) {
        row.className = '';
      } else {
        row.className = 'active';
      }
    }
  }
});

function sortRows(a, b, index, typeOrder) {
  const aText = a.children[index].textContent;
  const bText = b.children[index].textContent;

  if (aText[0] !== '$') {
    return typeOrder === 'asc'
      ? aText.localeCompare(bText) : bText.localeCompare(aText);
  }

  return typeOrder === 'asc'
    ? formatToNum(aText) - formatToNum(bText)
    : formatToNum(bText) - formatToNum(aText);
}

function formatToNum(num) {
  return Number(num.slice(1).split(',').join(''));
}

function formatToSting(str) {
  return '$' + str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// function onSuccessSubmit() {
//   notification.hidden = false;

//   setInterval(() => {
//     notification.hidden = true;
//   }, 1500);
// }

function addEmployee() {
  const data = new FormData(form);

  table.children[1].insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${data.get('age')}</td>
      <td>${formatToSting(data.get('salary'))}</td>
    </tr>
  `);
  tbodyRows = [...table.tBodies[0].rows];
}

function editCell(cell) {
  const cellText = cell.innerText;

  cell.innerText = '';

  const editFild = addEditField(cellText, cell);

  editFild.addEventListener('keyup', (ev) => {
    if (ev.code === 'Enter') {
      handleEventsEditFild(editFild, cell, cellText);
    }
  });

  editFild.addEventListener('blur', (ev) => {
    handleEventsEditFild(editFild, cell, cellText);
  });
}

function getCorrectAge(prevAge, currentAge) {
  if (currentAge >= 18 && currentAge <= 90) {
    return currentAge;
  } else {
    showNotification('Error', 'Age must be between 18 and 90', 'error');

    return prevAge;
  }
}

function getCorrectSalary(prevSalary, currentSalary) {
  if (currentSalary >= 1) {
    return formatToSting(currentSalary);
  } else {
    showNotification('Error', 'Salary must be greater than zero', 'error');

    return prevSalary;
  }
}

function getCorrectName(prevName, currentName) {
  if (currentName.length >= 4) {
    return currentName;
  } else {
    showNotification(
      'Error',
      'The name must be longer than 4 characters',
      'error'
    );

    return prevName;
  }
}

function getFinallyValue(cell, prevText, currentText) {
  switch (cell.cellIndex) {
    case 0:
      cell.textContent = getCorrectName(currentText, prevText);
      break;

    case 3:
      cell.textContent = getCorrectAge(currentText, prevText);
      break;

    case 4:
      cell.textContent = getCorrectSalary(currentText, prevText);
      break;

    default:
      cell.textContent = prevText;
  }
}

function addEditField(cellText, cell) {
  const editField = document.createElement('input');

  editField.className = 'cell-input';

  if (Number.parseFloat(cellText)) {
    editField.type = 'number';
    editField.min = 18;
    editField.max = 90;
  }

  if (cellText.startsWith('$')) {
    editField.type = 'number';
    editField.min = 1;
  }

  cell.append(editField);
  editField.focus();

  return editField;
}

function handleEventsEditFild(editFildValue, cell, cellText) {
  if (editFildValue.value.length > 0) {
    getFinallyValue(cell, editFildValue.value, cellText);
  }

  if (editFildValue.value.length === 0) {
    cell.textContent = cellText;
  }
}

function showNotification(title, textContent, classType) {
  notification.classList.add(classType);
  notification.hidden = false;
  notification.querySelector('h2').innerHTML = title;
  notification.querySelector('p').innerHTML = textContent;

  setInterval(() => {
    notification.hidden = true;
    notification.classList.remove(classType);
  }, 2200);
}
