/* eslint-disable max-len */
'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');

tbody.isSorted = false;
tbody.currentIndex = 0;

function tableSort(indexCol = tbody.currentIndex) {
  const rowsForSort = [...tbody.querySelectorAll('tr')];

  rowsForSort.sort((a, b) => {
    const first = a.children[indexCol].innerText;
    const second = b.children[indexCol].innerText;

    if (isNaN(parseFloat(first.slice(1)))) {
      return first.localeCompare(second);
    } else {
      if (first.slice(0, 1) === '$') {
        return parseFloat(first.slice(1)) - parseFloat(second.slice(1));
      }

      return parseFloat(first) - parseFloat(second);
    }
  });

  if (tbody.isSorted) {
    rowsForSort.reverse().forEach((el) => tbody.append(el));
    tbody.isSorted = false;
  } else {
    rowsForSort.forEach((el) => tbody.append(el));
    tbody.isSorted = true;
  }
}

table.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const place = e.target.closest('thead') ? 0 : table.rows.length - 1;

    tbody.currentIndex = [...table.rows[place].children].indexOf(e.target);

    tableSort(tbody.currentIndex);
  }
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('TR');
  const rowsForSort = [...tbody.querySelectorAll('tr')];

  rowsForSort.forEach((item) => item.classList.remove('active'));
  row.classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    const cell = e.target;
    const columnNum = [...cell.closest('TR').children].indexOf(cell);
    const defaultValue = cell.innerText.trim();
    const selection = window.getSelection();
    const range = document.createRange();

    if (columnNum === 2) {
      const select = createSelect(cityList, 'office', true);

      cell.innerText = '';
      cell.append(select);
      cell.firstElementChild.classList.add('cell-input');

      cell.addEventListener('change', () => {
        cell.innerText = cell.firstElementChild.value;
      });
    } else {
      cell.contentEditable = true;
      range.selectNodeContents(cell);
      selection.removeAllRanges();
      selection.addRange(range);

      cell.addEventListener('blur', () => {
        const content = cell.innerText.trim();

        if (columnNum === 4 && content.slice(0, 1) !== '$') {
          if (!isNaN(parseFloat(content))) {
            cell.innerText = '$' + (+content).toLocaleString('en');
          } else {
            cell.innerText = defaultValue;
          }
        }

        if (columnNum === 3) {
          if (+content > 90
              || +content < 18
              || isNaN(content)) {
            cell.innerText = defaultValue;
          }
        }

        if (columnNum === 0 || columnNum === 1) {
          if (!isNaN(parseFloat(content))) {
            cell.innerText = defaultValue;
          }
        }

        if (!content) {
          cell.innerText = defaultValue;
        }
      });
    }

    cell.addEventListener('keydown', eventCell => {
      if (eventCell.key === 'Enter') {
        cell.blur();
      };
    });
  }
});

function createInput(labelText, inputName, data, inputtype = 'text') {
  const label = document.createElement('LABEL');

  label.innerHTML = `${labelText} <input name =${inputName} type=${inputtype} data-qa=${data} required></input>`;
  label.setAttribute('for', inputName);

  if (inputName === 'name' || inputName === 'position') {
    label.children[0].setAttribute('minlength', 4);
    label.children[0].setAttribute('pattern', '[a-zA-Zа-яА-Яа-щА-ЩьюЯҐґІіЇїЄє]+(?:\\s[a-zA-Zа-яА-Яа-щА-ЩьюЯҐґІіЇїЄє]*)*');
  }

  if (inputName === 'age') {
    label.children[0].min = '18';
    label.children[0].max = '90';
  }

  return label;
}

function createSelect(arr, data, isEdit = false) {
  const label = document.createElement('LABEL');
  const select = document.createElement('SELECT');

  for (let i = 0; i < arr.length; i++) {
    const option = document.createElement('OPTION');

    option.innerText = arr[i];
    select.add(option, select[i]);
  }

  select.setAttribute('data-qa', data);

  if (!isEdit) {
    label.innerText = data[0].toLocaleUpperCase() + data.slice(1) + ':';
    label.append(select);

    return label;
  }

  return select;
}

const addEmployForm = document.createElement('FORM');
const formButton = document.createElement('BUTTON');

const cityList = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

addEmployForm.classList.add('new-employee-form');
addEmployForm.action = '#';
addEmployForm.method = 'GET';
formButton.innerText = 'Save to table';

addEmployForm.append(createInput('Name:', 'name', 'name'));
addEmployForm.append(createInput('Position:', 'position', 'position'));
addEmployForm.append(createSelect(cityList, 'office'));
addEmployForm.append(createInput('Age:', 'age', 'age', 'number'));
addEmployForm.append(createInput('Salary:', 'salary', 'salary', 'number'));
addEmployForm.append(formButton);

addEmployForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newRow = tbody.rows[0].cloneNode();
  const rowLength = tbody.rows[0].children.length;

  for (let i = 0; i < rowLength; i++) {
    const cell = newRow.insertCell(i);

    cell.innerText = e.target[i].value;
  }

  newRow.lastElementChild.innerText = '$' + (+newRow.lastElementChild.innerText).toLocaleString('en');
  tbody.append(newRow);
  tableSort(tbody.currentIndex);
  e.currentTarget.reset();
});

document.body.append(addEmployForm);
