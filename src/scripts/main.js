'use strict';
addNewEmployeeForm();

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const submitBtn = document.querySelector('[data-btn="submit"]');

setTHeadListener();
setTBodyActivateRowHoverListener();
setTbodyOpenCellEditInput();

submitBtn.addEventListener('click', addNewEmployee);

function setTHeadListener() {
  let lastSortType = null;

  thead.addEventListener('click', sortTable);

  function sortTable(e) {
    if (!e.target.closest('th')) {
      return;
    }

    const sortType = e.target.dataset.cellHead;
    const data = createTableData();
    const sortedData = sortData(data, sortType);
    const newTBodyHTML = createSortedTBodyHTML(sortedData);

    tbody.innerHTML = '';
    tbody.insertAdjacentHTML('beforeend', newTBodyHTML);
  }

  function createTableData(e) {
    const trows = [...document.querySelector('tbody').children];

    return trows.map((tr) => {
      const cells = [...tr.children];

      return {
        name: cells[0].textContent.trim(),
        position: cells[1].textContent.trim(),
        office: cells[2].textContent.trim(),
        age: Number(cells[3].textContent.trim()),
        salary: Number(
          cells[4].textContent.trim().replace('$', '').replaceAll(',', ''),
        ),
      };
    });
  }

  function sortData(data, sortType) {
    if (lastSortType === sortType) {
      lastSortType = null;

      return sortTableDESC();
    } else {
      lastSortType = sortType;

      return sortTableASC();
    }

    function sortTableASC() {
      return data.sort((p1, p2) => {
        if (typeof p1[sortType] === 'string') {
          return p1[sortType].localeCompare(p2[sortType]);
        }

        return p1[sortType] - p2[sortType];
      });
    }

    function sortTableDESC() {
      return data.sort((p1, p2) => {
        if (typeof p1[sortType] === 'string') {
          return p2[sortType].localeCompare(p1[sortType]);
        }

        return p2[sortType] - p1[sortType];
      });
    }
  }

  function createSortedTBodyHTML(sortedData) {
    return sortedData.reduce((prev, elem) => {
      return (
        prev +
        `
        <tr>
          <td>${elem.name}</td>
          <td>${elem.position}</td>
          <td>${elem.office}</td>
          <td>${elem.age}</td>
          <td>${formatSalary(elem.salary)}</td>
        </tr>
      `
      );
    }, '');
  }
}

function setTBodyActivateRowHoverListener() {
  let activeRow = null;

  tbody.addEventListener('click', activateRowHover);

  function activateRowHover(e) {
    if (!e.target.closest('tr')) {
      return;
    }

    const tr = e.target.closest('tr');

    if (activeRow !== null) {
      activeRow.classList.remove('active');
    }

    tr.classList.add('active');

    activeRow = tr;
  }
}

function addNewEmployeeForm() {
  const table = document.querySelector('table');
  const form = `
    <form class="new-employee-form">
      <label>Name: <input name="name" type="text" data-qa="name" required></label>
      <label>Position: <input name="position" type="text" data-qa="position" required></label>
      <label>
        Office:
        <select name="office" data-qa="office" required>
          <option value="tokyo">Tokyo</option>
          <option value="singapore">Singapore</option>
          <option value="london">London</option>
          <option value="newyork">New York</option>
          <option value="edinburgh">Edinburgh</option>
          <option value="sanfrancisco">San Francisco</option>
        </select>
      </label>

      <label>Age: <input name="age" type="number" data-qa="age" required></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>

      <button type="submit" data-btn="submit">Save to table</button>
    </form>
  `;

  table.insertAdjacentHTML('afterend', form);

  addNotificationElem();

  function addNotificationElem() {
    const notificationForm = document.createElement('div');

    notificationForm.classList.add('notification');
    notificationForm.dataset.qa = 'notification';
    notificationForm.style.display = 'none';

    table.insertAdjacentElement('afterend', notificationForm);
  }
}

function addNewEmployee(e) {
  e.preventDefault();

  const officeValue = document.querySelector('[name="office"]').value;

  const newEmployee = {
    name: document.querySelector('[name="name"]').value.trim(),
    position: document.querySelector('[name="position"]').value.trim(),
    office: officeValue[0].toUpperCase() + officeValue.slice(1),
    age: document.querySelector('[name="age"]').value.trim(),
    salary: document.querySelector('[name="salary"]').value.trim() || 0,
  };

  const invalid =
    newEmployee.name.length < 4 || newEmployee.age < 18 || newEmployee.age > 90;

  if (invalid) {
    showNotification(false);

    return;
  }

  showNotification(true);

  const newEmployeeElem = `
    <tr>
      <td>${newEmployee.name}</td>
      <td>${newEmployee.position}</td>
      <td>${newEmployee.office}</td>
      <td>${newEmployee.age}</td>
      <td>${formatSalary(newEmployee.salary)}</td>
    </tr>
  `;

  tbody.insertAdjacentHTML('beforeend', newEmployeeElem);
}

function showNotification(isValid) {
  const notificationForm = document.querySelector('.notification');
  const result = isValid ? 'success' : 'error';
  const title = isValid ? 'Success :)' : 'Invalid data:( Try again';

  notificationForm.classList.add(result);
  notificationForm.innerHTML = `<h3 class="title">${title}</h3>`;
  notificationForm.style.display = 'block';

  setTimeout(() => {
    notificationForm.style.display = 'none';
    notificationForm.classList.remove(result);
    notificationForm.innerHTML = '';
  }, 2000);
}

function formatSalary(salary) {
  const CURRENCY = '$';
  const reversedSalaryStr = String(salary).split('').reverse().join('');
  let res = '';

  for (let i = 0; i < reversedSalaryStr.length; i++) {
    res += reversedSalaryStr[i];

    if (i % 3 === 2 && i !== reversedSalaryStr.length - 1) {
      res += ',';
    }
  }

  res = CURRENCY + res.split('').reverse().join('');

  return res;
}

function setTbodyOpenCellEditInput() {
  let isInputActive = false;

  tbody.addEventListener('dblclick', openCellEditInput);

  function openCellEditInput(e) {
    if (isInputActive) {
      return;
    }

    isInputActive = true;

    const target = e.target;

    if (!target.closest('td')) {
      return;
    }

    const value = target.textContent.trim();

    target.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.classList.add('cell-input');
    input.value = value;

    target.insertAdjacentElement('beforeend', input);

    input.addEventListener('blur', () => closeInput(input, value, target));

    input.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        closeInput(input, value, target);
      }
    });

    function closeInput(inputElement, oldValue, cell) {
      isInputActive = false;

      const newValue = inputElement.value.trim() || oldValue;

      cell.textContent = newValue;
    }
  }
}
