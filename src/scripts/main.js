/* eslint-disable no-unused-vars */
'use strict';

const thead = document.querySelector('thead');
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const arrayTr = document.querySelectorAll('tr');
const arrayCell = [...arrayTr];
const arrayPeople = [];
let directionSort = '';

const showNewPersonInTable = table.insertAdjacentHTML('afterend', `
<form class = 'new-employee-form'>
  <label>Name:
    <input name = "name"
    type = "text"
    data-qa = "name"
    >
  </label>
  <label>Position:
    <input name = "position"
    type="text"
    data-qa="position"
    >
  </label>
  <label>Office:
    <select name = "office" type="text" data-qa="office" required="required">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input name = "age"
    type="number"
    data-qa="age"
    >
  </label>
  <label>Salary:
    <input name = "salary"
    type="number"
    data-qa="salary"
    >
  </label>
  <button type = 'submit'>Save to table</button>
`);

const form = document.querySelector('form');

const addNewPersonInTable = form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const informNewPerson = Object.fromEntries(data.entries());

  if (informNewPerson.name.length < 4
    || informNewPerson.age < 18
    || informNewPerson.age > 90) {
    pushNotification(100, 10,
      'ERROR',
      'It is necessary to fill in all fields'
      + 'of the form to correct!',
      'error');

    return;
  } else {
    pushNotification(100, 10,
      'SUCCESS',
      'I congratulate you!',
      'success');
  }

  tbody.insertAdjacentHTML('beforeend', `
   <tr>
    <td>${informNewPerson.name}</td>
    <td>${informNewPerson.position}</td>
    <td>${informNewPerson.office}</td>
    <td>${informNewPerson.age}</td>
    <td>${'$' + divideSalary(informNewPerson.salary)}</td>
</tr>
`
  );

  arrayPeople.push(informNewPerson);
});

const sortPersonInTable = thead.addEventListener('click', (e) => {
  const headerName = e.target.innerHTML;

  choiceColumnSort(e, 'Name', headerName);
  choiceColumnSort(e, 'Position', headerName);
  choiceColumnSort(e, 'Office', headerName);
  choiceColumnSort(e, 'Age', headerName);
  choiceColumnSort(e, 'Salary', headerName);
}
);

const selectRow = tbody.addEventListener('click', (e) => {
  const selected = document.querySelectorAll('.active');

  for (const elem of selected) {
    elem.classList.remove('active');
  }

  e.target.closest('tr').classList.add('active');
});

for (let i = 1; i < arrayCell.length - 1; i++) {
  for (let j = 0; j < arrayCell[i].children.length; j++) {
    const cell = arrayCell[i].children[j];

    cell.addEventListener('dblclick', (e) => {
      const lastValue = e.target.innerText;
      const input = document.createElement('input');

      input.classList.add('cell-input');
      input.value = cell.textContent;

      while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
      }

      cell.appendChild(input);
      input.focus();

      input.onblur = function() {
        if (j === 0 && input.value.length < 4) {
          pushNotification(100, 10,
            'ERROR',
            'It is necessary to fill in all fields'
            + 'of the form to correct!',
            'error');

          input.value = lastValue;
        };

        if (j === 3) {
          if (input.value < 18
            || input.value > 90
            || input.value.length > 2) {
            pushNotification(100, 10,
              'ERROR',
              'It is necessary to fill in all fields'
              + 'of the form to correct!',
              'error');

            input.value = lastValue;
          };

          if (j === 4) {
            if (input.value === '') {
              pushNotification(100, 10,
                'ERROR',
                'It is necessary to fill in all fields'
                + 'of the form to correct!',
                'error');

              input.value = lastValue;
            }
            input.value = divideSalary(cell.textContent);
          }
        }
      };

      input.addEventListener('keydown', (inputKeyEvent) => {
        if (inputKeyEvent.key !== 'Enter') {
          return;
        }
        cell.removeChild(input);
        cell.appendChild(document.createTextNode(input.value || lastValue));
      });
    });
  }
}

for (let i = 0; i <= tbody.children.length - 1; i++) {
  const people = {
    name: tbody.rows[i].cells[0].innerText,
    position: tbody.rows[i].cells[1].innerText,
    office: tbody.rows[i].cells[2].innerText,
    age: tbody.rows[i].cells[3].innerHTML,
    salary: tbody.rows[i].cells[4].innerHTML,
  };

  arrayPeople.push(people);
};

function choiceColumnSort(each, item, nameColumn) {
  if (each.target.innerText === item) {
    if (nameColumn !== directionSort) {
      sortEmployeesASC(arrayPeople, each.target.innerText);
      directionSort = nameColumn;
    } else {
      sortEmployeesDESC(arrayPeople, each.target.innerText);
      directionSort = '';
    }
    showSorted(arrayPeople);
  }
}

function showSorted(list) {
  for (let i = 0; i < list.length; i++) {
    tbody.rows[i].cells[0].innerText = list[i].name;
    tbody.rows[i].cells[1].innerText = list[i].position;
    tbody.rows[i].cells[2].innerText = list[i].office;
    tbody.rows[i].cells[3].innerHTML = list[i].age;
    tbody.rows[i].cells[4].innerHTML = list[i].salary;
  }
};

function sortEmployeesASC(array, field) {
  const fieldLower = field.toLowerCase();

  return array.sort((a, b) => {
    return Number(a[fieldLower].replace(/[^\d]/g, ''))
      ? a[fieldLower].replace(/[^\d]/g, '')
      - b[fieldLower].replace(/[^\d]/g, '')
      : a[fieldLower].localeCompare(b[fieldLower]);
  });
}

function sortEmployeesDESC(array, field) {
  const fieldLower = field.toLowerCase();

  return array.sort((a, b) => {
    return Number(a[fieldLower].replace(/[^\d]/g, ''))
      ? b[fieldLower].replace(/[^\d]/g, '')
      - a[fieldLower].replace(/[^\d]/g, '')
      : b[fieldLower].localeCompare(a[fieldLower]);
  });
}

function divideSalary(number) {
  let count = 0;
  let result = '';
  const string = String(number);
  let long = (string.length % 3) !== 0 ? string.length % 3 : 3;

  for (let i = 0; i < string.length; i++) {
    if (count === long) {
      result += ',';
      count = 0;
      long = 3;
    }
    result += string[i];
    count++;
  }

  return result;
}

function pushNotification(posTop, posRight, title, description, type) {
  const block = document.querySelector('body');

  const message = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;
  message.style.zIndex = `${99999}`;

  message.classList.add('notification', type);
  message.setAttribute('data-qa', 'notification');

  h2.innerText = title;
  p.innerText = description;

  block.children[0].after(message);
  message.append(h2, p);

  setTimeout(() => message.remove(), 2000);
};
