'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const formCreated = document.createElement('form');
let prevSortingKey = null;
let isError = false;
let tempTdContent = '';

formCreated.classList.add('new-employee-form');
formCreated.name = 'new-employee-form';

formCreated.innerHTML = `
  <label>
    <input data-qa="name"></input>
  </label>

  <label>
    <input data-qa="position"></input>
  </label>

  <label>
    <select data-qa="office">
      <option value = 'Tokyo'>Tokyo</option>
      <option value = 'Singapore'>Singapore</option>
      <option value = 'London'>London</option>
      <option value = 'New York'>New York</option>
      <option value = 'Edinburgh'>Edinburgh</option>
      <option value = 'San Francisco'>San Francisco</option>
    </select>
  </label>

  <label>
    <input data-qa='age' type = 'number'></input>
  </label>

  <label>
    <input data-qa = 'salary' type = 'number'></input>
  </label>

  <button type = 'submit'>Save to table</button>`;

for (const label of formCreated.querySelectorAll('label')) {
  let labelName = label.children[0].dataset.qa;

  labelName = labelName[0].toUpperCase() + labelName.slice(1);
  label.children[0].insertAdjacentHTML('beforeBegin', `${labelName}:`);
};

formCreated.addEventListener('submit', addNewEmployee);

document.body.lastElementChild.before(formCreated);

thead.addEventListener('click', sortTable);
tbody.addEventListener('click', selectRow);
tbody.addEventListener('dblclick', editCell);

function createArray(htmlRows) {
  const finalArray = [];

  for (let i = 0; i < htmlRows.length; i++) {
    finalArray.push({
      name: htmlRows[i].children[0].textContent,
      position: htmlRows[i].children[1].textContent,
      office: htmlRows[i].children[2].textContent,
      age: htmlRows[i].children[3].textContent,
      salary: htmlRows[i].children[4].textContent,
    });
  }

  return finalArray;
}

function sortTable(e) {
  const people = createArray(tbody.rows);

  if (e.target.tagName !== 'TH') {
    return;
  };

  sortArray(people, e.target.textContent);

  for (let j = 0; j < people.length; j++) {
    for (const item of tbody.rows) {
      if (item.cells[0].textContent === people[j].name) {
        tbody.append(item);
      }
    }
  };
}

function sortArray(array, markerName) {
  switch (markerName) {
    case ('Age'):
      array.sort((a, b) => {
        if (prevSortingKey !== markerName) {
          return a.age - b.age;
        };

        return b.age - a.age;
      });
      break;

    case ('Salary'):
      array.sort((a, b) => {
        const formated = (rare) => rare.slice(1).replace(',', '');

        if (prevSortingKey !== markerName) {
          return formated(a.salary) - formated(b.salary);
        };

        return formated(b.salary) - formated(a.salary);
      });
      break;

    default:
      array.sort((a, b) => {
        if (prevSortingKey !== markerName) {
          return a[markerName.toLowerCase()]
            .localeCompare(b[markerName.toLowerCase()]);
        };

        return b[markerName.toLowerCase()]
          .localeCompare(a[markerName.toLowerCase()]);
      });
  };

  if (prevSortingKey !== markerName) {
    prevSortingKey = markerName;

    return;
  }
  prevSortingKey = null;
}

function selectRow(e) {
  const selectedRow = e.target.closest('tr');

  for (const row of tbody.rows) {
    row.classList.remove('active');
  };

  selectedRow.classList.add('active');
}

function pushNotification(topShift, title, description, type) {
  const message = document.createElement('div');
  const descriptionMesssage = document.createElement('p');

  message.innerHTML = `
  <h2 class = 'title'>${title}</h2>`;
  descriptionMesssage.innerText = description;
  message.dataset.qa = 'notification';
  message.append(descriptionMesssage);

  message.classList.add('notification', type);
  message.style.top = topShift + 'px';
  document.body.lastElementChild.before(message);

  setTimeout(() => {
    message.hidden = true;
  }, 2000);
};

function checkInput(form) {
  for (let i = 0; i < 5; i++) {
    switch (form[i].dataset.qa) {
      case ('name'):
        if (form[i].value.trim().length < 4) {
          isError = true;

          pushNotification(100, 'Error message',
            'Name value has less than 4 letters', 'error');
        };
        break;

      case ('age'):
        if (form[i].value < 18 || form[i].value > 90) {
          isError = true;

          pushNotification(300, 'Error message',
            'Age value is less than 18 or more than 90', 'error');
        };
        break;

      case ('position'):
        if (form[i].value.trim().length < 1) {
          isError = true;

          return pushNotification(200, 'Error message',
            `Position value length is less than 1`, 'error');
        };
        break;

      default:
        if (form[i].value.trim().length < 1) {
          isError = true;

          return pushNotification(220, 'Error message',
            `All fields are required`, 'error');
        };
    };
  }
}

function addNewEmployee(e) {
  const newRow = document.createElement('tr');

  e.preventDefault();
  checkInput(this);

  if (isError) {
    isError = false;

    return;
  }

  newRow.innerHTML = `
    <td>${this[0].value}</td>
    <td>${this[1].value}</td>
    <td>${this[2].value}</td>
    <td>${this[3].value}</td>
    <td>$${Number(this[4].value).toLocaleString('en-US')}</td>`;

  tbody.append(newRow);
  formCreated.reset();

  pushNotification(220, 'Success message',
    'Good Job!', 'success');
}

function editCell(e) {
  const inputTemp = document.createElement('input');

  e.preventDefault();

  if (e.target.tagName !== 'TD') {
    return;
  }
  tempTdContent = e.target.innerHTML;

  inputTemp.classList.add('cell-input');
  inputTemp.value = e.target.textContent;
  inputTemp.style.width = e.target.clientWidth + 'px';

  e.target.innerHTML = '';
  e.target.append(inputTemp);
  inputTemp.focus();
  document.addEventListener('keydown', pressEnter);
  inputTemp.addEventListener('blur', endEdit);
}

function endEdit() {
  const edingCell = document.querySelector('.cell-input');

  if (edingCell.value.trim().length > 1) {
    edingCell.parentElement.textContent = edingCell.value;
  } else {
    edingCell.parentElement.textContent = tempTdContent;
  }
}

function pressEnter(e) {
  if (e.key === 'Enter') {
    document.querySelector('.cell-input').blur();
  }
}
